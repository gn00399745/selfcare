// 藥典清單頁共用（中成藥 cpm.html、中藥材 herbs.html）
function pharmPage(opt){
  // opt: {data, cats, kind:'cpm'|'herb'}
  const PAGE=40;
  let cat=qs("cat")||"全部", kw=qs("q")||"", did=qs("d")||"", hideTox=true, shown=PAGE;
  const focus=qs("id");
  const $=id=>document.getElementById(id);
  const dz=did?byId(DISEASES,did):null;

  const chips=$("chips");
  chips.innerHTML=["全部",...opt.cats].map(c=>`<button class="chip ${c===cat?"on":""}" data-c="${c}">${c}</button>`).join("");
  chips.addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;cat=b.dataset.c;shown=PAGE;
    chips.querySelectorAll(".chip").forEach(x=>x.classList.toggle("on",x===b));draw();});
  const q=$("q");q.value=kw;q.addEventListener("input",()=>{kw=q.value;shown=PAGE;draw();});
  const tox=$("tox"); if(tox){tox.checked=hideTox;tox.addEventListener("change",()=>{hideTox=tox.checked;shown=PAGE;draw();});}
  if(dz){ $("dfilter").innerHTML=`篩選疾病：<b>${dz.icon} ${esc(dz.name)}</b> <a href="${location.pathname.split("/").pop()}">✕ 清除</a>`; $("dfilter").style.display=""; }
  $("more").addEventListener("click",()=>{shown+=PAGE;draw();});

  function item(r){
    const pf=pregnancyFlag(r.no||"");
    const ds=(r.d||[]).map(id=>byId(DISEASES,id)).filter(Boolean);
    const badges=(r.tx&&r.tx.length?`<span class="tag rx">⚠️ ${r.xw!==undefined?esc(r.tx[0]):"含"+esc(r.tx.join("、"))}</span>`:"")+(pf?`<span class="tag rx">${pf}</span>`:"")+(r.inj?`<span class="tag rx">注射劑</span>`:"");
    return `<details class="item ${r.id===focus?"hl":""}" id="m-${r.id}" ${r.id===focus?"open":""}>
      <summary><div><div class="t1">${esc(r.n)} ${badges}</div>
      <div class="t2">${esc(r.t.join("・"))}｜${esc(r.fn.slice(0,34))}${r.fn.length>34?"…":""}</div></div></summary>
      <div class="body"><dl class="kv">
        ${r.xw?`<dt>性味歸經</dt><dd>${esc(r.xw)}</dd>`:""}
        <dt>功能主治</dt><dd>${esc(r.fn)}</dd>
        ${r.c?`<dt>處方</dt><dd style="font-size:13px">${esc(r.c)}</dd>`:""}
        ${r.u?`<dt>用法用量</dt><dd>${esc(r.u)}</dd>`:""}
        ${r.sp?`<dt>規格</dt><dd style="font-size:13px">${esc(r.sp)}</dd>`:""}
        ${r.no?`<dt>注意</dt><dd style="color:var(--red)">${esc(r.no)}</dd>`:""}
        ${r.tx&&r.tx.length&&r.xw===undefined?`<dt>警示</dt><dd style="color:var(--red)">${TOXIC_NOTE}</dd>`:""}
        ${ds.length?`<dt>相關疾病</dt><dd><div class="links">${ds.map(d=>`<a href="disease.html?id=${d.id}">${d.icon} ${esc(d.name)}</a>`).join("")}</div></dd>`:""}
      </dl></div></details>`;
  }
  function draw(){
    const k=norm(kw.trim());
    let list=opt.data.filter(r=>(cat==="全部"||r.t.includes(cat))
      &&(!did||(r.d||[]).includes(did))
      &&(!hideTox||!(r.tx&&r.tx.length))
      &&(!k||norm(r.n+r.py+r.fn+(r.c||"")+(r.xw||"")).includes(k)));
    if(did) list=rankFor(list,did).concat(list.filter(r=>r.tx&&r.tx.length));
    if(focus&&!list.some(r=>r.id===focus)){const f=byId(opt.data,focus);if(f)list.unshift(f);}
    $("cnt").textContent=`共 ${list.length} 項`;
    $("list").innerHTML=list.length?list.slice(0,shown).map(item).join(""):`<div class="empty">找不到符合的資料</div>`;
    $("more").style.display=list.length>shown?"":"none";
  }
  draw();
  $("src").innerHTML=CP_SRC;
  $("disc").innerHTML=DISCLAIMER;
  if(focus){const el=$("m-"+focus);if(el)setTimeout(()=>el.scrollIntoView({behavior:"smooth",block:"center"}),60);}
}
