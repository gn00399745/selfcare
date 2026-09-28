// 共用：導覽列、工具函式、反向索引
(function(){
  const pages=[
    ["index.html","🏠 首頁"],["disease.html","🤒 疾病速查"],["westmed.html","💊 常用西藥"],["tcm.html","🌿 常用方劑"],["cpm.html","📦 中成藥"],["herbs.html","🍃 中藥材"],["knowledge.html","📖 用藥知識"]
  ];
  const cur=(location.pathname.split("/").pop()||"index.html");
  const nav=document.createElement("nav");nav.className="topnav";
  nav.innerHTML=pages.map(([h,t])=>`<a href="${h}" class="${cur===h||(cur===""&&h==="index.html")?"active":""}">${t}</a>`).join("");
  document.body.prepend(nav);
})();

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const qs=k=>new URLSearchParams(location.search).get(k);
const byId=(arr,id)=>arr.find(x=>x.id===id);
const norm=s=>String(s||"").toLowerCase();

// 反向索引：藥物 → 適用疾病
function diseasesUsingWest(id){ return (window.DISEASES||[]).filter(d=>d.west.some(w=>w.id===id)); }
function diseasesUsingTcm(id){ return (window.DISEASES||[]).filter(d=>d.tcm.some(t=>t.rx.includes(id))); }

const DISCLAIMER=`本工具整理自公開醫藥資訊，僅供日常輕症自我照護參考，不能取代醫師診斷與藥師指示。<br>
用藥前請詳閱藥品仿單；孕婦、哺乳、兒童、長者、慢性病及長期服藥者請先諮詢醫師或藥師。<br>
中藥需辨證使用，建議經中醫師診斷。緊急狀況請撥 <b>119</b>。`;

// 藥典資料：依疾病排序（毒性、注射劑排除；關鍵字越前面、分類越單純者優先）
const TOXIC_NOTE="含毒性或作用峻烈藥材，須由醫師處方，勿自行服用";
function rankFor(list,did){
  const d=(window.DISEASES||[]).find(x=>x.id===did);
  return list.filter(r=>r.d&&r.d.includes(did)&&!(r.tx&&r.tx.length)&&!r.inj)
    .map(r=>({r,s:(r.t?r.t.length:0)*3+(r.fn.indexOf("用於")>-1?0:2)+r.fn.length/80}))
    .sort((a,b)=>a.s-b.s).map(x=>x.r);
}
function pregnancyFlag(no){ return /孕婦(禁用|忌用|忌服)/.test(no)?"孕婦禁用":/孕婦慎用/.test(no)?"孕婦慎用":""; }
const CP_SRC='資料來源：《中國藥典》2015年版一部，經 OCR 擷取並轉為繁體，可能有少數誤字；大陸藥典收載品項在台灣不一定有許可證，購買前請確認衛福部中藥許可證字號。';

// 安裝成桌面／手機 App（PWA）
if("serviceWorker" in navigator){ window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{})); }
let _installEvt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();_installEvt=e;const b=document.getElementById("installBtn");if(b)b.style.display="";});
function installApp(){ if(_installEvt){_installEvt.prompt();_installEvt=null;document.getElementById("installBtn").style.display="none";} }
