import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, BarChart3, Dumbbell, Images, MessageCircle, Settings, Utensils } from "lucide-react";
import { routines } from "./data/routines";
import "./styles.css";

const today = () => new Date().toISOString().slice(0, 10);
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function vibrate(pattern = [120]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
}

const defaultProfile = {
  name: "민준",
  birthYear: "2010",
  height: "",
  currentWeight: "",
  goalWeight: "73",
  bodyFat: "",
  goalType: "cut",
  daysPerWeek: "6"
};

function App() {
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState("");
  const [profile, setProfile] = useLocalState("ascend2.profile", defaultProfile);
  const [daily, setDaily] = useLocalState(`ascend2.daily.${today()}`, {});
  const [day, setDay] = useLocalState("ascend2.day", new Date().getDay());
  const [checks, setChecks] = useLocalState(`ascend2.check.${today()}.${day}`, {});
  const [logs, setLogs] = useLocalState("ascend2.logs", {});
  const [weights, setWeights] = useLocalState("ascend2.weights", []);
  const [days, setDays] = useLocalState("ascend2.days", []);
  const [food, setFood] = useLocalState("ascend2.food", "");
  const [photos, setPhotos] = useLocalState("ascend2.photos", []);
  const [xp, setXp] = useLocalState("ascend2.xp", 0);
  const [chat, setChat] = useLocalState("ascend2.chat", []);
  const [session, setSession] = useLocalState("ascend2.session", {
    active: false,
    index: 0,
    set: 0,
    resting: false,
    remaining: 0
  });
  const [transition, setTransition] = useState(null);
  const routine = routines[day] ?? routines[0];
  const exercise = routine.items[session.index] ?? routine.items[0];
  const nextExercise = routine.items[session.index + 1];
  const done = Object.values(checks).filter(Boolean).length;
  const workoutPct = routine.items.length ? Math.round((done / routine.items.length) * 100) : 0;

  const notify = (msg) => {
    setToast(msg);
    window.clearTimeout(window.__toast);
    window.__toast = window.setTimeout(() => setToast(""), 1600);
  };

  useEffect(() => {
    setChecks(load(`ascend2.check.${today()}.${day}`, {}));
  }, [day]);

  useEffect(() => {
    if (!session.resting || session.remaining <= 0) return;
    const id = setInterval(() => {
      setSession((s) => {
        if (!s.resting) return s;
        const next = s.remaining - 1;
        if (next <= 0) {
          vibrate([220, 80, 220]);
          notify("휴식 끝");
          return { ...s, resting: false, remaining: 0 };
        }
        return { ...s, remaining: next };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [session.resting, session.remaining]);

  const startTransition = (title, sub) => {
    setTransition({ title, sub });
    setTimeout(() => setTransition(null), 900);
  };

  const addXp = (n) => setXp((x) => x + n);

  const markToday = () => {
    setDays((arr) => Array.from(new Set([...arr, today()])));
  };

  const startSession = () => {
    const first = routine.items[0];
    setSession({ active: true, index: 0, set: 0, resting: false, remaining: 0 });
    notify("세션 시작");
    vibrate([100]);
    startTransition("READY", first?.[0] ?? routine.label);
  };

  const completeSet = () => {
    if (!session.active) {
      startSession();
      return;
    }
    if (session.resting) {
      notify("휴식 중이야");
      return;
    }
    const setNo = session.set + 1;
    addXp(2);
    notify(`${exercise[0]} ${setNo}세트 완료`);
    vibrate([90]);

    if (setNo >= exercise[1]) {
      const newChecks = { ...checks, [`ex${session.index}`]: true };
      setChecks(newChecks);
      save(`ascend2.check.${today()}.${day}`, newChecks);
      if (session.index >= routine.items.length - 1) {
        setSession({ active: false, index: 0, set: 0, resting: false, remaining: 0 });
        markToday();
        startTransition("MISSION COMPLETE", routine.label);
        notify("오늘 운동 완료");
        vibrate([160, 80, 160]);
      } else {
        const next = routine.items[session.index + 1];
        setSession({ active: true, index: session.index + 1, set: 0, resting: false, remaining: 0 });
        startTransition("NEXT EXERCISE", next[0]);
      }
    } else {
      setSession({ ...session, set: setNo, resting: true, remaining: exercise[3] });
    }
  };

  const goNext = () => {
    if (!session.active) return startSession();
    if (session.index >= routine.items.length - 1) {
      setSession({ active: false, index: 0, set: 0, resting: false, remaining: 0 });
      markToday();
      startTransition("MISSION COMPLETE", routine.label);
      notify("오늘 운동 완료");
      return;
    }
    const next = routine.items[session.index + 1];
    setSession({ active: true, index: session.index + 1, set: 0, resting: false, remaining: 0 });
    startTransition("NEXT EXERCISE", next[0]);
    notify(next[0]);
  };

  const saveWeight = () => {
    const weight = Number(daily.todayWeight);
    if (!weight) {
      notify("체중을 입력해줘");
      return;
    }
    setWeights((arr) => [...arr.filter((x) => x.date !== today()), { date: today(), weight }].slice(-30));
    notify("체중 저장됨");
  };

  const saveDay = () => {
    saveWeight();
    markToday();
    addXp(30);
    notify("오늘 기록 저장됨");
  };

  const score = useMemo(() => {
    let s = Math.round(workoutPct * 0.35);
    s += Math.min(20, Math.round((Number(daily.protein) || 0) / 150 * 20));
    s += Math.min(15, Math.round((Number(daily.water) || 0) / 3000 * 15));
    s += Math.min(15, Math.round((Number(daily.sleep) || 0) / 7 * 15));
    ["creatine", "proteinCheck", "skin", "steps"].forEach((k) => { if (daily[k]) s += 4; });
    return Math.min(100, s);
  }, [daily, workoutPct]);

  return (
    <div>
      <div className="bg" />
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
      <AnimatePresence>{transition && <Transition title={transition.title} sub={transition.sub} />}</AnimatePresence>

      <main className="app">
        <header className="top">
          <div>
            <p className="tag">ASCEND 2.0 · REACT</p>
            <h1>{profile.name || "민준"}, 오늘도 올라가자</h1>
          </div>
          <img className="logo" src="/logo.png" />
        </header>

        <AnimatePresence mode="wait">
          {tab === "home" && <Home key="home" {...{ profile, daily, setDaily, score, workoutPct, xp, days, exercise, nextExercise, session, saveWeight, saveDay, setTab }} />}
          {tab === "workout" && <Workout key="workout" {...{ routine, day, setDay, session, exercise, nextExercise, checks, setChecks, startSession, completeSet, goNext }} />}
          {tab === "log" && <Log key="log" {...{ routine, logs, setLogs, addXp, notify }} />}
          {tab === "food" && <Food key="food" {...{ food, setFood, addXp, notify }} />}
          {tab === "body" && <Body key="body" {...{ photos, setPhotos, addXp, notify }} />}
          {tab === "progress" && <Progress key="progress" {...{ weights, setWeights, days, markToday, notify }} />}
          {tab === "profile" && <Profile key="profile" {...{ profile, setProfile, daily, setDaily, notify }} />}
          {tab === "aria" && <Aria key="aria" {...{ profile, daily, routine, workoutPct, logs, chat, setChat, notify }} />}
        </AnimatePresence>

        <nav className="tabs">
          <Tab id="home" tab={tab} setTab={setTab} icon={<Activity />} label="Home" />
          <Tab id="workout" tab={tab} setTab={setTab} icon={<Dumbbell />} label="Workout" />
          <Tab id="log" tab={tab} setTab={setTab} icon={<BarChart3 />} label="Log" />
          <Tab id="food" tab={tab} setTab={setTab} icon={<Utensils />} label="Food" />
          <Tab id="body" tab={tab} setTab={setTab} icon={<Images />} label="Body" />
          <Tab id="progress" tab={tab} setTab={setTab} icon={<BarChart3 />} label="Progress" />
          <Tab id="profile" tab={tab} setTab={setTab} icon={<Settings />} label="Profile" />
          <Tab id="aria" tab={tab} setTab={setTab} icon={<MessageCircle />} label="ARIA" />
        </nav>
      </main>
    </div>
  );
}

function useLocalState(key, fallback) {
  const [value, setValue] = useState(() => load(key, fallback));
  useEffect(() => save(key, value), [key, value]);
  return [value, setValue];
}

function Page({ children }) {
  return <motion.section className="page active" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{children}</motion.section>;
}

function Transition({ title, sub }) {
  return (
    <motion.div className="transition" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.04 }}>
      <img src="/logo.png" />
      <h2>{title}</h2>
      <p>{sub}</p>
    </motion.div>
  );
}

function Tab({ id, tab, setTab, icon, label }) {
  return <button className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{React.cloneElement(icon, { size: 18 })}<span>{label}</span></button>;
}

function Home({ profile, daily, setDaily, score, workoutPct, xp, days, exercise, nextExercise, session, saveWeight, saveDay, setTab }) {
  const weight = Number(daily.todayWeight || profile.currentWeight || 0);
  const start = Number(profile.currentWeight || weight || 0);
  const goal = Number(profile.goalWeight || 73);
  const goalPct = weight && start !== goal ? Math.max(0, Math.min(100, ((start - weight) / (start - goal)) * 100)) : 0;
  return (
    <Page>
      <article className="card hero">
        <div><p className="tag">TODAY SCORE</p><h2>{score}<small>/100</small></h2><p>{score >= 85 ? "오늘 흐름 좋다." : score >= 60 ? "부족한 미션만 채우자." : "아직 채울 게 많아."}</p></div>
        <Ring pct={workoutPct} />
      </article>
      <article className="card">
        <p className="tag">LIVE WORKOUT</p>
        <h2>{session.active ? exercise[0] : "운동을 시작해줘"}</h2>
        <p>{session.active ? `${session.set + 1}/${exercise[1]}세트 · 다음 ${nextExercise ? nextExercise[0] : "완료"}` : "Workout 탭에서 Start Session"}</p>
        <button className="btn" onClick={() => setTab("workout")}>운동 시작</button>
      </article>
      <section className="grid2">
        <article className="card stat"><span>Level</span><b>{Math.floor(xp / 100) + 1}</b><small>{xp % 100}/100 XP</small></article>
        <article className="card stat"><span>Streak</span><b>{calcStreak(days)}🔥</b><small>Save Day 기준</small></article>
      </section>
      <article className="card goal"><div className="row"><h3>{weight || start || 0}kg → {goal}kg</h3><b>{Math.round(goalPct)}%</b></div><div className="bar"><i style={{ width: `${goalPct}%` }} /></div><p>{weight ? `목표까지 ${(weight - goal).toFixed(1)}kg` : "체중을 입력해줘."}</p></article>
      <section className="grid2">
        <Metric label="Today Weight" value={daily.todayWeight || ""} unit="kg" onChange={(v) => setDaily({ ...daily, todayWeight: v })} button="체중 저장" onClick={saveWeight} />
        <Metric label="Sleep" value={daily.sleep || ""} unit="h" onChange={(v) => setDaily({ ...daily, sleep: v })} />
        <Metric label="Protein" value={daily.protein || ""} unit="/150g" onChange={(v) => setDaily({ ...daily, protein: v })} bar={Math.min(100, (Number(daily.protein) || 0) / 150 * 100)} />
        <Metric label="Water" value={daily.water || ""} unit="/3000mL" onChange={(v) => setDaily({ ...daily, water: v })} bar={Math.min(100, (Number(daily.water) || 0) / 3000 * 100)} />
      </section>
      <article className="card checks">
        <div className="row"><h3>Daily System</h3><button className="miniBtn" onClick={saveDay}>Save Day</button></div>
        <Check label="크레아틴" checked={!!daily.creatine} onChange={(v) => setDaily({ ...daily, creatine: v })} />
        <Check label="프로틴" checked={!!daily.proteinCheck} onChange={(v) => setDaily({ ...daily, proteinCheck: v })} />
        <Check label="운동 후 세안/샤워" checked={!!daily.skin} onChange={(v) => setDaily({ ...daily, skin: v })} />
        <Check label="8,000보" checked={!!daily.steps} onChange={(v) => setDaily({ ...daily, steps: v })} />
      </article>
    </Page>
  );
}

function Ring({ pct }) {
  return <div className="ring"><svg viewBox="0 0 150 150"><circle className="bgc" cx="75" cy="75" r="62" /><circle className="fgc" cx="75" cy="75" r="62" style={{ strokeDashoffset: 389.6 * (1 - pct / 100) }} /></svg><b>{pct}%</b></div>;
}

function Metric({ label, value, unit, onChange, bar, button, onClick }) {
  return <label className="card inputCard"><span>{label}</span><div><input value={value} type="number" step=".1" onChange={(e) => onChange(e.target.value)} /><b>{unit}</b></div>{typeof bar === "number" && <em><i style={{ width: `${bar}%` }} /></em>}{button && <button className="miniBtn" type="button" onClick={onClick}>{button}</button>}</label>;
}

function Check({ label, checked, onChange }) {
  return <label><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /> {label}</label>;
}

function Workout({ routine, day, setDay, session, exercise, nextExercise, checks, setChecks, startSession, completeSet, goNext }) {
  const pct = routine.items.length ? Math.round((Object.values(checks).filter(Boolean).length / routine.items.length) * 100) : 0;
  return (
    <Page>
      <div className="sticky row"><div><p className="tag">LIVE SESSION</p><h2>Workout</h2></div><select value={day} onChange={(e) => setDay(Number(e.target.value))}>{Object.entries(routines).map(([k, r]) => <option key={k} value={k}>{["일","월","화","수","목","금","토"][k]} · {r.label}</option>)}</select></div>
      <article className="card session">
        <div className="row"><div><p className="tag">{session.resting ? "REST" : session.active ? "NOW" : "READY"}</p><h2>{session.active ? exercise[0] : "Start Session"}</h2></div><b>{session.active ? `${session.index + 1}/${routine.items.length}` : `0/${routine.items.length}`}</b></div>
        <div className="bar"><i style={{ width: `${session.active ? (session.index / routine.items.length) * 100 : 0}%` }} /></div>
        <p>{session.active ? `${exercise[1]}세트 · ${exercise[2]} · 휴식 ${exercise[3]}초 · ${exercise[4]}` : "Start Session을 누르면 현재 운동 중심으로 진행돼."}</p>
        <p>다음 운동: {session.active ? nextExercise?.[0] || "마지막 운동" : "-"}</p>
        <div className="setDots">{Array.from({ length: session.active ? exercise[1] : 3 }).map((_, i) => <div key={i} className={`dot ${i < session.set ? "done" : ""}`}>{i + 1}</div>)}</div>
        <div className="timerBig">{format(session.remaining || 0)}</div>
        <div className="sessionActions"><button className="btn" onClick={startSession}>Start Session</button><button className="btn" onClick={completeSet}>Set 완료</button><button className="ghostBtn" onClick={goNext}>다음 운동</button></div>
      </article>
      <article className="card summary">{routine.label} · {Object.values(checks).filter(Boolean).length}/{routine.items.length} 완료 · {pct}%</article>
      {routine.items.map((it, i) => <ExerciseCard key={it[0]} item={it} done={!!checks[`ex${i}`]} onChange={(v) => setChecks({ ...checks, [`ex${i}`]: v })} />)}
    </Page>
  );
}

function ExerciseCard({ item, done, onChange }) {
  return <article className={`exercise ${done ? "done" : ""}`}><div className="exTop"><div className="icon">{item[5]}</div><div className="exBody"><h3>{item[0]}</h3><div className="chips"><span className="chip">{item[1]}세트</span><span className="chip">{item[2]}</span><span className="chip">{item[3]}초</span></div></div><input type="checkbox" checked={done} onChange={(e) => onChange(e.target.checked)} /></div><details><summary>자세</summary>{item[4]}</details></article>;
}

function Log({ routine, logs, setLogs, addXp, notify }) {
  const saveLog = (name, next) => {
    setLogs({ ...logs, [name]: { ...next, date: today(), time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) } });
    addXp(8); notify("운동 기록 저장됨");
  };
  return <Page><div className="sticky"><p className="tag">LOG</p><h2>Training Log</h2></div><article className="card info">3세트 모두 12회 이상이면 다음 운동 +2.5kg 추천.</article>{routine.items.filter((it) => it[3] > 0).map((it) => <LogCard key={it[0]} item={it} log={logs[it[0]] || {}} onSave={(v) => saveLog(it[0], v)} />)}</Page>;
}

function LogCard({ item, log, onSave }) {
  const [v, setV] = useState(log);
  useEffect(() => setV(log), [log]);
  return <article className="logCard"><h3>{item[0]}</h3><p className="status">{recommend(log)}</p><div className="setgrid">{["kg", "r1", "r2", "r3"].map((k, idx) => <input key={k} type="number" placeholder={idx ? `${idx}` : "kg"} value={v[k] || ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} />)}</div><button className="btn" onClick={() => onSave(v)}>저장</button><p className="status">{log.time ? `최근 저장 ${log.time}` : "저장 대기 중"}</p></article>;
}

function recommend(d) {
  const kg = Number(d.kg), reps = [Number(d.r1), Number(d.r2), Number(d.r3)];
  if (!kg || reps.some((x) => !x)) return "기록하면 추천 표시";
  if (reps.every((x) => x >= 12)) return `다음 ${kg + 2.5}kg 추천`;
  if (reps.some((x) => x < 8)) return `${Math.max(0, kg - 2.5)}kg로 낮춰도 됨`;
  return "현재 무게 유지";
}

function Food({ food, setFood, addXp, notify }) {
  const [draft, setDraft] = useState(food);
  return <Page><div className="sticky"><p className="tag">NUTRITION</p><h2>Food</h2></div><article className="card"><h3>Food Memo</h3><textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="오늘 먹은 음식, 단백질, 간식" /><button className="btn" onClick={() => { setFood(draft); addXp(5); notify("Food 저장됨"); }}>Save Food</button><div className="preview">{food || "저장된 식단 없음"}</div></article></Page>;
}

function Body({ photos, setPhotos, addXp, notify }) {
  const [memo, setMemo] = useState("");
  const savePhoto = (file) => {
    if (!file) return notify("사진을 선택해줘");
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos([...photos, { date: today(), time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }), memo, data: reader.result }].slice(-12));
      setMemo(""); addXp(10); notify("사진 저장됨");
    };
    reader.readAsDataURL(file);
  };
  return <Page><div className="sticky"><p className="tag">BODY JOURNAL</p><h2>Body</h2></div><article className="card"><h3>Progress Photo</h3><input type="file" accept="image/*" onChange={(e) => savePhoto(e.target.files?.[0])} /><textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="사진 메모" /></article><article className="card"><div className="row"><h3>Photo Timeline</h3><button className="miniBtn" onClick={() => setPhotos([])}>Clear</button></div><p className="status">{photos.length}개</p><div className="photos">{photos.length ? photos.slice().reverse().map((p, i) => <article className="photo" key={i}><img src={p.data} /><div><b>{p.date} {p.time}</b><p>{p.memo || "메모 없음"}</p></div></article>) : "저장된 사진 없음"}</div></article></Page>;
}

function Progress({ weights, setWeights, days, markToday, notify }) {
  const vals = weights.map((x) => x.weight);
  const min = vals.length ? Math.min(...vals) - 0.5 : 0;
  const max = vals.length ? Math.max(...vals) + 0.5 : 1;
  const daySet = new Set(days);
  const start = new Date(); start.setDate(start.getDate() - 20);
  const calendar = Array.from({ length: 21 }).map((_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return { day: d.getDate(), done: daySet.has(iso) };
  });
  return <Page><div className="sticky"><p className="tag">PROGRESS</p><h2>Progress</h2></div><article className="card"><div className="row"><h3>Weight Trend</h3><button className="miniBtn" onClick={() => setWeights([])}>Clear</button></div><div className="chart">{weights.length ? weights.map((x) => <div className="chartBar" key={x.date} style={{ height: 22 + ((x.weight - min) / (max - min)) * 82 }}><span>{x.weight}</span></div>) : "체중 저장하면 그래프가 생겨."}</div></article><article className="card"><div className="row"><h3>Calendar</h3><button className="miniBtn" onClick={() => { markToday(); notify("오늘 체크"); }}>오늘 체크</button></div><div className="calendar">{calendar.map((d, i) => <div key={i} className={`dayDot ${d.done ? "done" : ""}`}>{d.day}</div>)}</div></article></Page>;
}

function Profile({ profile, setProfile, daily, setDaily, notify }) {
  const [draft, setDraft] = useState(profile);
  const fields = [["name", "이름"], ["birthYear", "출생년도"], ["height", "키"], ["currentWeight", "현재 체중"], ["goalWeight", "목표 체중"], ["bodyFat", "체지방률"]];
  return <Page><div className="sticky"><p className="tag">SETUP</p><h2>Profile</h2></div><article className="card setup"><h3>기본 정보</h3><div className="grid2">{fields.map(([k, label]) => <label key={k}><span>{label}</span><input value={draft[k] || ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} /></label>)}</div><h3>목표</h3><select value={draft.goalType} onChange={(e) => setDraft({ ...draft, goalType: e.target.value })}><option value="cut">커팅 / 다이어트</option><option value="recomp">리컴프</option><option value="bulk">벌크업</option><option value="fitness">체력 향상</option></select><h3>주 운동 횟수</h3><select value={draft.daysPerWeek} onChange={(e) => setDraft({ ...draft, daysPerWeek: e.target.value })}><option value="3">주 3회</option><option value="4">주 4회</option><option value="5">주 5회</option><option value="6">주 6회</option></select><button className="btn" onClick={() => { setProfile(draft); if (draft.currentWeight && !daily.todayWeight) setDaily({ ...daily, todayWeight: draft.currentWeight }); notify("Profile 저장됨"); }}>Profile 저장</button></article></Page>;
}

function Aria({ profile, daily, routine, workoutPct, logs, chat, setChat, notify }) {
  const report = ariaReport(profile, daily, routine, workoutPct);
  const [text, setText] = useState("");
  const send = () => {
    const q = text.trim();
    if (!q) return;
    setChat([...chat, { role: "user", text: q }, { role: "bot", text: ariaAnswer(q) }].slice(-30));
    setText(""); notify("ARIA 답변");
  };
  return <Page><div className="sticky"><p className="tag">ARIA CHAT</p><h2>AI Coach</h2></div><article className="card ariaBox"><h3>ARIA Report</h3><p>{report}</p></article><article className="card chat"><h3>Ask ARIA</h3><div className="chatLog">{chat.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.text}</div>)}</div><div className="chatInput"><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="예: 랫풀다운 자세, 커팅 식단, 수면 부족" /><button onClick={send}>전송</button></div></article></Page>;
}

function ariaReport(profile, daily, routine, workoutPct) {
  const lines = [`${profile.name || "사용자"} 기준 분석`, `오늘 루틴: ${routine.label}`, `운동 완료율: ${workoutPct}%`];
  if (Number(daily.sleep) && Number(daily.sleep) < 6) lines.push("수면 부족: 오늘은 실패지점까지 가지 말고 RIR 2 추천.");
  if ((Number(daily.protein) || 0) < 120) lines.push("단백질 부족: 단백질 식사나 프로틴 보충 추천.");
  if ((Number(daily.water) || 0) < 2000) lines.push("수분 부족: 운동 전후 물을 더 챙겨.");
  return lines.join("\\n");
}

function ariaAnswer(q) {
  const s = q.toLowerCase();
  if (s.includes("랫풀") || s.includes("풀다운")) return "랫풀다운은 팔로 당기기보다 팔꿈치를 아래로 꽂는 느낌이 좋아. 가슴을 살짝 들고 어깨가 귀 쪽으로 올라가지 않게 해.";
  if (s.includes("커팅") || s.includes("다이어트")) return "커팅은 급하게 굶기보다 단백질을 충분히 두고 천천히 감량하는 게 좋아. 단백질 130~150g, 물 2.5L 이상, 주당 0.5~0.8kg 감량을 목표로 잡아.";
  if (s.includes("수면")) return "수면이 6시간 미만이면 고중량 실패지점까지 밀기보다 RIR 2 정도로 남기고, 유산소 강도도 살짝 낮추는 게 좋아.";
  if (s.includes("프로틴") || s.includes("여드름")) return "여드름이 잘 나면 WPC보다 WPI나 식물성 단백질을 먼저 고려해. 당 많은 매스게이너는 피하는 쪽이 좋아.";
  if (s.includes("어깨")) return "어깨는 레터럴 레이즈의 볼륨이 중요해. 승모 개입을 줄이고 12~20회 범위를 정확한 자세로 반복해.";
  return "현재 ARIA는 규칙 기반 베타야. 운동명, 자세, 식단, 수면, 프로틴처럼 구체적으로 물어보면 더 정확히 도와줄게.";
}

function calcStreak(days) {
  const set = new Set(days);
  let n = 0;
  const d = new Date();
  while (set.has(d.toISOString().slice(0, 10))) {
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

function format(sec) {
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

createRoot(document.getElementById("root")).render(<App />);
