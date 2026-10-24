/* ============================================================
   جفر ناد علی — رابط کاربری: رسم جدول ریسپانسیو و رویدادها
   به توابع jafr-core.js (normalize و build) وابسته است.
   ============================================================ */
const $=i=>document.getElementById(i);
const fa=n=>n.toLocaleString('fa-IR');
let lastRes=null,curK=0;
// تعداد ستون در هر بخش: بر اساس عرض صفحه، با حداقل ~۳۲ پیکسل برای هر خانه
function calcK(maxLen){
 const w=$('tbl').clientWidth||Math.min(window.innerWidth,900)-32;
 const fit=Math.max(5,Math.floor(w/34));
 const parts=Math.ceil(maxLen/fit);
 return Math.max(1,Math.ceil(maxLen/parts));
}
const maxLenOf=res=>Math.max(...res.rows.map(r=>r.cells.length));
function render(res){
 lastRes=res;
 const maxLen=maxLenOf(res);
 const K=curK=calcK(maxLen),parts=Math.ceil(maxLen/K);
 const frag=document.createDocumentFragment();
 for(let p=0;p<parts;p++){
  const from=p*K,to=from+K;
  const box=document.createElement('div');box.className='chunk';box.style.setProperty('--k',K);
  if(parts>1){
   const h=document.createElement('p');h.className='chunk-h';
   h.textContent='بخش '+fa(p+1)+' از '+fa(parts)+' — ستون‌های '+fa(from+1)+' تا '+fa(Math.min(to,maxLen));
   box.appendChild(h);
  }
  const t=document.createElement('table');
  const cg=document.createElement('colgroup');
  for(let i=0;i<K;i++)cg.appendChild(document.createElement('col'));
  t.appendChild(cg);
  res.rows.forEach((row,i)=>{
   const slice=row.cells.slice(from,to);
   if(!slice.length)return;
   const mark=row.type==='n'?' mark':'';
   const tt=t.insertRow();tt.className='tt'+mark;
   const th=tt.insertCell();th.colSpan=K;
   const s=document.createElement('span');s.className='rn';s.textContent=fa(i+1)+'.';
   th.append(s,row.title);
   const tr=t.insertRow();tr.className='cr'+mark;
   slice.forEach((c,j)=>{
    const td=tr.insertCell();td.textContent=c;
    const idx=from+j,cl=[];
    if(row.type==='n')cl.push('num');
    if(row.cut===idx)cl.push('cut');
    if(row.split===idx)cl.push('split');
    if(cl.length)td.className=cl.join(' ');
   });
  });
  box.appendChild(t);frag.appendChild(box);
 }
 $('tbl').replaceChildren(frag);
 const m=$('msg');
 if(res.note){m.textContent=res.note;m.hidden=false}else m.hidden=true;
}
// با چرخش گوشی یا تغییر اندازهٔ پنجره، تقسیم ستون‌ها دوباره محاسبه شود
let rt;
['resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>{
 clearTimeout(rt);
 rt=setTimeout(()=>{if(lastRes&&calcK(maxLenOf(lastRes))!==curK)render(lastRes)},150);
}));
$('gen').addEventListener('click',()=>{
 const letters=normalize($('q').value);
 if(!letters.length){lastRes=null;$('tbl').replaceChildren();const m=$('msg');m.textContent='حرف فارسی یا عربی وارد کنید.';m.hidden=false;return}
 render(build(letters));
});
