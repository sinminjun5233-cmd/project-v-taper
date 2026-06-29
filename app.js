const routine={1:{ko:"가슴 + 삼두",cardio:"천국의 계단 20분",items:[["인클라인 머신 프레스","4","8–10","120초","가슴을 높이고 어깨를 뒤로 고정. 팔꿈치 45도.","🏔️"],["체스트 프레스 머신","3","8–12","120초","어깨가 앞으로 말리지 않게. 팔꿈치 잠금 금지.","⚙️"],["인클라인 덤벨 프레스","3","8–12","120초","내릴 때 2~3초. 윗가슴 옆으로.","🏋️"],["펙덱 플라이","3","12–15","60초","수축 지점 1초 정지.","🪽"],["삼두 푸쉬다운","4","10–15","60초","팔꿈치 고정.","⚡"],["오버헤드 익스텐션","3","12–15","60초","머리 뒤로 충분히 늘리기.","🔩"]]},2:{ko:"등 + 이두",cardio:"사이클 20분",items:[["친업","4","가능-1","120초","가슴을 바에 가까이. 광배 늘리기.","🦅"],["랫풀다운","4","8–12","120초","팔꿈치를 아래로 꽂는 느낌.","⬇️"],["시티드 케이블 로우","3","10–12","90초","배꼽 방향. 수축 1초.","🚣"],["체스트 서포티드 로우","3","8–12","90초","가슴 패드 고정.","🧱"],["스트레이트 암 풀다운","3","12–15","60초","광배로 바를 허벅지까지.","📐"],["덤벨 컬","3","10–12","60초","팔꿈치 고정.","💪"],["해머컬","3","10–15","60초","엄지가 위.","🔨"]]},3:{ko:"하체 + 팔",cardio:"런닝머신 30분",items:[["레그컬","4","10–15","75초","햄스트링 접기.","🦵"],["레그익스텐션","4","12–15","75초","상단 1초 정지.","⚙️"],["핵스쿼트","4","8–10","150초","무릎은 발끝 방향.","🏔️"],["레그프레스","4","10–12","150초","무릎 잠그지 않기.","🚀"],["루마니안 데드리프트","3","8–10","150초","엉덩이를 뒤로.","🧲"],["카프레이즈","5","12–20","60초","아래 끝까지 늘리기.","📈"],["케이블 컬","3","12–15","60초","이두만.","💪"],["푸쉬다운","3","12–15","60초","팔꿈치 고정.","⚡"]]},4:{ko:"어깨 + 팔",cardio:"천국의 계단 20분",items:[["머신 숄더프레스","4","8–10","120초","허리 과신전 금지.","🛡️"],["덤벨 숄더프레스","3","8–12","120초","귀 옆으로 내리기.","🏋️"],["케이블 레터럴 레이즈","4","12–20","60초","5kg 힘들면 몸 기울여 한 팔씩.","📡"],["덤벨 레터럴 레이즈","3","15–20","60초","반동 최소.","🪽"],["리어델트 플라이","4","12–20","60초","팔꿈치 벌리기.","🎯"],["페이스풀","3","15–20","60초","눈높이로 당기기.","🧬"],["해머컬","3","10–15","60초","팔 두께.","🔨"],["오버헤드 익스텐션","3","12–15","60초","삼두 장두.","🔩"]]},5:{ko:"가슴 + 등 + 팔",cardio:"사이클 20분",items:[["인클라인 머신 프레스","3","8–10","120초","윗가슴.","🏔️"],["펙덱 플라이","3","12–15","60초","가슴 수축.","🪽"],["랫풀다운","3","8–12","120초","광배.","⬇️"],["체스트 서포티드 로우","3","10–12","90초","등 두께.","🧱"],["프리처 컬","3","10–12","60초","반동 금지.","💪"],["삼두 푸쉬다운","3","10–15","60초","끝까지 펴기.","⚡"]]},6:{ko:"어깨 + 하체 + 팔",cardio:"런닝머신 25분",items:[["덤벨 레터럴 레이즈","4","15–20","60초","측면 펌핑.","🪽"],["리어델트 플라이","4","15–20","60초","후면어깨.","🎯"],["레그프레스","4","10–12","150초","하체 볼륨.","🚀"],["레그컬","3","12–15","75초","햄스트링.","🦵"],["레그익스텐션","3","12–15","75초","대퇴사두.","⚙️"],["해머컬","3","10–15","60초","팔 두께.","🔨"],["오버헤드 익스텐션","3","12–15","60초","삼두 장두.","🔩"]]},0:{ko:"휴식 / 걷기",cardio:"8,000–10,000보",items:[["걷기","1","30–60분","-","회복 목적.","🚶"],["스트레칭","1","10분","-","광배, 고관절, 햄스트링.","🧘"]]}};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],today=()=>new Date().toISOString().slice(0,10),get=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let day=Number(get("asc5.day",new Date().getDay())),tid=null,remain=0;const key=()=>`asc5.check.${today()}.${day}`;
function toast(msg){
  const t=$("#toast");
  if(!t) return;
  t.textContent=msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>t.classList.remove("show"),1500);
}
function flash(el){
  if(!el) return;
  el.classList.add("pulse");
  setTimeout(()=>el.classList.remove("pulse"),700);
}


function shortText(t){
  t=(t||"").trim();
  if(!t) return "";
  return t.length>34 ? t.slice(0,34)+"…" : t;
}
function renderMemos(){
  const food=get("asc5.food","");
  const note=get("asc5.note","");
  const fp=$("#foodPreview"), np=$("#notePreview"), hf=$("#homeFood"), hn=$("#homeNote");
  if(fp) fp.textContent=food ? food : "아직 저장된 식단 메모가 없어.";
  if(np) np.textContent=note ? note : "아직 저장된 저널이 없어.";
  if(hf) hf.textContent=food ? shortText(food) : "저장된 식단 없음";
  if(hn) hn.textContent=note ? shortText(note) : "저장된 저널 없음";
}

function ariaReportText(){
  const prot=+$("#protein").value||0, wat=+$("#water").value||0, sleep=+$("#sleep").value||0;
  const total=routine[day].items.length;
  const done=Object.values(get(key(),{})).filter(Boolean).length;
  const cp=total?Math.round(done/total*100):0;
  const w=+$("#weight").value||0;
  let lines=[];
  lines.push(`운동 완료율: ${cp}%`);
  if(cp===100) lines.push("✓ 오늘 운동 수행은 완료 상태야. 기록 저장까지 하면 다음 증량 판단이 더 정확해져.");
  else lines.push("• 아직 운동 체크가 남아 있어. 완료한 운동은 바로 체크해줘.");
  if(prot>=130) lines.push("✓ 단백질은 근육 유지에 충분한 편이야.");
  else lines.push(`• 단백질이 부족해. 목표까지 약 ${Math.max(0,130-prot)}g 정도 더 채우면 좋아.`);
  if(wat>=2500) lines.push("✓ 수분 섭취가 좋아. 펌핑과 회복에 도움돼.");
  else lines.push("• 물은 2.5L 이상을 먼저 목표로 잡자.");
  if(sleep && sleep<6) lines.push("⚠ 수면이 부족해. 오늘/내일은 실패지점까지 밀지 말고 RIR 2 정도로.");
  else if(sleep>=7) lines.push("✓ 수면이 괜찮아. 고중량 운동을 진행하기 좋은 편.");
  if(w) lines.push(`체중 목표까지 ${(w-73).toFixed(1)}kg 남았어. 급하게 빼기보다 주당 0.5~0.8kg 감량을 노리자.`);
  return lines.join("\\n");
}
function renderAria(){
  const report=ariaReportText();
  const r=$("#ariaReport");
  if(r) r.textContent=report;
}
function renderPhotos(){
  const box=$("#photoTimeline");
  if(!box) return;
  const photos=get("asc6.photos",[]);
  if(!photos.length){ box.innerHTML='<p class="soft">저장된 사진이 없어. Progress Photo에서 사진을 추가해줘.</p>'; return; }
  box.innerHTML="";
  photos.slice().reverse().forEach(p=>{
    const card=document.createElement("article");
    card.className="photo-card";
    card.innerHTML=`<img src="${p.data}" alt="progress photo"><div><b>${p.date}</b><p>${p.memo||"메모 없음"}</p></div>`;
    box.appendChild(card);
  });
}

function init(){
  const h=new Date().getHours();
  $("#hello").textContent=h<12?"민준, 아침 미션 시작":h<18?"민준, 루틴 가자":"민준, 오늘도 올라가자";

  ["일","월","화","수","목","금","토"].forEach((n,i)=>{
    let o=document.createElement("option");
    o.value=i;
    o.textContent=`${n} · ${routine[i].ko}`;
    $("#day").appendChild(o);
  });
  $("#day").value=day;
  $("#day").onchange=e=>{
    day=+e.target.value;
    set("asc5.day",day);
    render();
  };

  $$(".tab").forEach(b=>b.addEventListener("click",()=>route(b.dataset.tab)));
  $$("[data-go]").forEach(b=>b.addEventListener("click",()=>route(b.dataset.go)));

  const p=get("asc5.profile",{});
  ["weight","protein","water","sleep"].forEach(id=>{
    $("#"+id).value=p[id]??"";
    $("#"+id).addEventListener("input",saveProfile);
  });
  ["cWorkout","cCreatine","cProtein","cSkin","cSteps"].forEach(id=>{
    $("#"+id).checked=!!p[id];
    $("#"+id).addEventListener("change",saveProfile);
  });

  $("#saveDay").addEventListener("click",saveDay);
  $("#clearWeight").addEventListener("click",()=>{
    set("asc5.weights",[]);
    draw();
  });
  $("#stop").addEventListener("click",()=>{
    clearInterval(tid);
    $("#timer").classList.remove("show");
  });

  $("#foodMemo").value=get("asc5.food","");
  $("#bodyNote").value=get("asc5.note","");

  $("#saveFood").addEventListener("click",()=>{
    const memo=$("#foodMemo").value;
    set("asc5.food",memo);
    set("asc5.food."+today(),memo);
    const el=$("#foodSaved");
    if(el) el.textContent="저장됨 · "+new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});
    renderMemos();
    $("#foodPreview")?.classList.add("flash");
    setTimeout(()=>$("#foodPreview")?.classList.remove("flash"),600);
    toast("Nutrition 저장됨");
    navigator.vibrate?.(80);
  });

  $("#saveNote").addEventListener("click",()=>{
    const memo=$("#bodyNote").value;
    set("asc5.note",memo);
    set("asc5.note."+today(),memo);
    const el=$("#noteSaved");
    if(el) el.textContent="저장됨 · "+new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});
    renderMemos();
    $("#notePreview")?.classList.add("flash");
    setTimeout(()=>$("#notePreview")?.classList.remove("flash"),600);
    navigator.vibrate?.(80);
  });

  const refresh=$("#refreshAria");
  if(refresh) refresh.addEventListener("click",()=>{
    renderAria();
    const r=$("#ariaReport");
    if(r) r.textContent += "\n\n업데이트: "+new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});
    flash(r?.closest(".card"));
    toast("ARIA 분석 새로고침");
    navigator.vibrate?.(70);
  });

  const savePhoto=$("#savePhoto");
  if(savePhoto) savePhoto.addEventListener("click",()=>{
    const input=$("#photoInput");
    const file=input?.files?.[0];
    const memo=$("#photoMemo")?.value || "";
    if(!file){
      $("#photoSaved").textContent="사진을 먼저 선택해줘.";
      return;
    }
    const reader=new FileReader();
    reader.onload=()=>{
      const photos=get("asc6.photos",[]);
      photos.push({date:today(),memo,data:reader.result});
      set("asc6.photos",photos.slice(-12));
      $("#photoSaved").textContent="저장됨 · "+new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});
      $("#photoMemo").value="";
      input.value="";
      renderPhotos();
      toast("사진 저장됨");
      navigator.vibrate?.(90);
    };
    reader.readAsDataURL(file);
  });

  const clearPhotos=$("#clearPhotos");
  if(clearPhotos) clearPhotos.addEventListener("click",()=>{
    set("asc6.photos",[]);
    renderPhotos();
  });

  renderMemos();
  renderPhotos();
  renderAria();
  render();
}
function route(t){$$(".tab").forEach(x=>x.classList.toggle("on",x.dataset.tab===t));$$(".page").forEach(x=>x.classList.toggle("on",x.id===t))}
function saveProfile(){set("asc5.profile",{weight:$("#weight").value,protein:$("#protein").value,water:$("#water").value,sleep:$("#sleep").value,cWorkout:$("#cWorkout").checked,cCreatine:$("#cCreatine").checked,cProtein:$("#cProtein").checked,cSkin:$("#cSkin").checked,cSteps:$("#cSteps").checked});update()}
function render(){renderWorkout();renderLog();update();draw();calendar();renderAria()}
function renderWorkout(){const s=get(key(),{}),wrap=$("#workoutList");wrap.innerHTML="";routine[day].items.forEach((it,i)=>{const id="ex"+i,card=document.createElement("article");card.className="exercise"+(s[id]?" done":"");card.innerHTML=`<div class="exmain"><div class="icon">${it[5]}</div><div class="extitle"><h3>${it[0]}</h3><div class="chips"><span class="chip">${it[1]}세트</span><span class="chip">${it[2]}</span><span class="chip">${it[3]}</span></div></div><input type="checkbox" ${s[id]?"checked":""}></div><details><summary>자세</summary><p>${it[4]}</p></details><div class="timerrow">${it[3]!=="-"?`<button data-sec="${parseInt(it[3])}">휴식 ${it[3]}</button>`:""}<button data-log="${it[0]}">기록</button></div>`;$("input",card).onchange=e=>{
  let n=get(key(),{});
  n[id]=e.target.checked;
  set(key(),n);
  toast(e.target.checked ? "운동 체크 완료" : "운동 체크 해제");
  renderWorkout();
  update();
};const tb=$("[data-sec]",card);if(tb)tb.onclick=()=>start(+tb.dataset.sec);$("[data-log]",card).onclick=()=>{route("log");setTimeout(()=>document.querySelector(`[data-name="${CSS.escape(it[0])}"]`)?.scrollIntoView({behavior:"smooth",block:"center"}),60)};wrap.appendChild(card)});updateWorkoutSummary()}

function updateWorkoutSummary(){
  const box=$("#workoutSummary");
  if(!box) return;
  const total=routine[day].items.length;
  const done=Object.values(get(key(),{})).filter(Boolean).length;
  const pct=total?Math.round(done/total*100):0;
  const remaining=total-done;
  box.innerHTML=`<b>Workout Progress</b><br>${done}/${total} 완료 · ${pct}% · 남은 운동 ${remaining}개`;
  if(pct===100) box.innerHTML += `<br><span style="color:#d8b4fe">MISSION COMPLETE</span>`;
}
function renderLog(){const wrap=$("#logList");wrap.innerHTML="";routine[day].items.forEach(it=>{if(it[3]==="-")return;const name=it[0],d=get("asc5.log."+name,{}),card=document.createElement("article");card.className="logcard card";card.dataset.name=name;card.innerHTML=`<h3>${name}</h3><p class="rec">${rec(d)}</p><div class="setgrid"><input class="kg" type="number" step=".5" placeholder="kg" value="${d.kg??""}"><input class="r1" type="number" placeholder="1" value="${d.r1??""}"><input class="r2" type="number" placeholder="2" value="${d.r2??""}"><input class="r3" type="number" placeholder="3" value="${d.r3??""}"></div><button class="save">저장</button><p class="log-status">저장 대기 중</p>`;$(".save",card).onclick=()=>{
  let nd={kg:$(".kg",card).value,r1:$(".r1",card).value,r2:$(".r2",card).value,r3:$(".r3",card).value,date:today()};
  set("asc5.log."+name,nd);
  $(".rec",card).textContent=rec(nd);
  $(".log-status",card).textContent="저장됨 · "+new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"});
  flash(card);
  toast("운동 기록 저장됨");
  update();
  renderAria();
  navigator.vibrate?.(80);
};wrap.appendChild(card)})}
function rec(d){const kg=+d.kg,reps=[+d.r1,+d.r2,+d.r3];if(!kg||reps.some(x=>!x))return"기록하면 다음 무게 추천.";if(reps.every(x=>x>=12))return`다음 운동 ${kg+2.5}kg 추천.`;if(reps.every(x=>x>=10))return"같은 무게로 12회까지.";if(reps.some(x=>x<8))return`${Math.max(kg-2.5,0)}kg로 낮춰도 됨.`;return"현재 무게 유지."}
function update(){const prot=+$("#protein").value||0,wat=+$("#water").value||0,w=+$("#weight").value||0,sleep=+$("#sleep").value||0;$("#proteinBar").style.width=Math.min(100,prot/150*100)+"%";$("#waterBar").style.width=Math.min(100,wat/3000*100)+"%";if(w){let pct=Math.max(0,Math.min(100,(81-w)/8*100));$("#goalLine").style.width=pct+"%";$("#goalPct").textContent=Math.round(pct)+"%";$("#goalMsg").textContent=`목표까지 ${(w-73).toFixed(1)}kg`;}const total=routine[day].items.length,done=Object.values(get(key(),{})).filter(Boolean).length,cp=total?Math.round(done/total*100):0;$("#pct").textContent=cp+"%";$("#ring").style.strokeDashoffset=389.6*(1-cp/100);let score=0;if(cp===100)score+=35;if(prot>=130)score+=20;else score+=Math.round(prot/130*20);if(wat>=2500)score+=15;else score+=Math.round(wat/2500*15);if(sleep>=7)score+=15;["cCreatine","cProtein","cSkin","cSteps"].forEach(id=>{if($("#"+id).checked)score+=5});score=Math.min(100,score);$("#score").textContent=score;$("#scoreMsg").textContent=score>=90?"A급. 오늘 루틴 좋다.":score>=70?"좋아. 단백질/물만 더 채우자.":"아직 채울 미션이 남아있어.";$("#ariaText").textContent=coach(score,cp,prot,wat,sleep);let xp=get("asc5.xp",0);$("#level").textContent=Math.floor(xp/100)+1;$("#xpText").textContent=`${xp%100}/100 XP`;$("#streak").textContent=get("asc5.streak",0)+"🔥"; updateWorkoutSummary()}
function coach(score,cp,prot,wat,sleep){if(sleep&&sleep<6)return"수면이 부족해. 오늘은 실패 직전까지 가지 말고 RIR 2 정도로 마무리해.";if(cp===100&&prot>=130&&wat>=2500)return"오늘은 수행이 좋다. 다음 운동에서는 기록한 종목 중 12회 달성한 운동만 소폭 증량해봐.";if(prot<110)return"단백질이 부족해. 오늘은 프로틴 1스쿱이나 단백질 식사를 추가하는 게 좋아.";if(wat<1800)return"수분이 부족해. 운동 전후로 물을 더 챙기면 펌핑과 회복에 도움돼.";if(score>=80)return"좋은 흐름이야. 무게보다 자세 유지하면서 볼륨을 쌓자.";return"오늘은 기본 미션부터 채우자. 운동 체크, 물, 단백질만 챙겨도 충분히 올라간다."}
function saveDay(){saveProfile();let arr=get("asc5.days",[]).filter(x=>x!==today());arr.push(today());set("asc5.days",arr.slice(-90));set("asc5.xp",get("asc5.xp",0)+30);set("asc5.streak",calcStreak(arr));let w=+$("#weight").value;if(w){let wa=get("asc5.weights",[]).filter(x=>x.date!==today());wa.push({date:today(),weight:w});set("asc5.weights",wa.slice(-21))}update();draw();calendar();toast("오늘 기록 저장됨");navigator.vibrate?.(120)}
function calcStreak(arr){let setd=new Set(arr),n=0,d=new Date();while(setd.has(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1)}return n}
function draw(){let arr=get("asc5.weights",[]),c=$("#chart");if(!arr.length){c.innerHTML='<p id="goalMsg">아침 체중 저장하면 그래프가 생겨.</p>';return}let vals=arr.map(x=>x.weight),min=Math.min(...vals)-.5,max=Math.max(...vals)+.5;c.innerHTML="";arr.forEach(x=>{let b=document.createElement("div");b.className="bar";b.style.height=22+((x.weight-min)/(max-min))*72+"px";b.innerHTML=`<span>${x.weight}</span>`;c.appendChild(b)})}
function calendar(){let done=new Set(get("asc5.days",[])),c=$("#calendar");c.innerHTML="";let d=new Date();d.setDate(d.getDate()-20);for(let i=0;i<21;i++){let iso=d.toISOString().slice(0,10),el=document.createElement("div");el.className="daydot"+(done.has(iso)?" done":"");el.textContent=d.getDate();c.appendChild(el);d.setDate(d.getDate()+1)}}
function start(sec){clearInterval(tid);remain=sec;$("#timer").classList.add("show");tick();tid=setInterval(()=>{remain--;tick();if(remain<=0){clearInterval(tid);navigator.vibrate?.([250,120,250])}},1000)}
function tick(){let m=String(Math.floor(remain/60)).padStart(2,"0"),s=String(remain%60).padStart(2,"0");$("#timerText").textContent=`${m}:${s}`}
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").then(reg=>reg.update?.()).catch(()=>{});init();
