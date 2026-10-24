/* ============================================================
   جفر ناد علی — رابط کاربری: رسم جدول و رویدادها
   جدول همیشه کامل و در یک تکه رسم می‌شود؛ اگر از عرض صفحه بزرگ‌تر باشد
   داخل کادر خودش به چپ و راست اسکرول می‌شود (عنوان هر سطر در دید می‌ماند).
   به توابع jafr-core.js (normalize و build) وابسته است.
   ============================================================ */
const $=i=>document.getElementById(i);
const fa=n=>n.toLocaleString('fa-IR');
let lastRes=null;
const maxLenOf=res=>Math.max.apply(null,res.rows.map(r=>r.cells.length));
// پاک‌کردن محتوای یک عنصر (سازگار با مرورگرهای قدیمی اندروید)
function clear(el){while(el.firstChild)el.removeChild(el.firstChild)}
function render(res){
 lastRes=res;
 const n=maxLenOf(res);
 const t=document.createElement('table');
 t.style.setProperty('--n',n);
 const cg=document.createElement('colgroup');
 for(let i=0;i<n;i++)cg.appendChild(document.createElement('col'));
 t.appendChild(cg);
 res.rows.forEach((row,i)=>{
  const mark=row.type==='n'?' mark':'';
  // سطر عنوان (عنوان با position:sticky هنگام اسکرول افقی در دید می‌ماند)
  const tt=t.insertRow();tt.className='tt'+mark;
  const th=tt.insertCell();th.colSpan=n;
  const box=document.createElement('div');box.className='tt-in';
  const s=document.createElement('span');s.className='rn';s.textContent=fa(i+1)+'.';
  box.appendChild(s);box.appendChild(document.createTextNode(row.title));
  th.appendChild(box);
  // سطر خانه‌ها
  const tr=t.insertRow();tr.className='cr'+mark;
  row.cells.forEach((c,idx)=>{
   const td=tr.insertCell();td.textContent=c;
   const cl=[];
   if(row.type==='n')cl.push('num');
   if(row.cut===idx)cl.push('cut');
   if(row.split===idx)cl.push('split');
   if(cl.length)td.className=cl.join(' ');
  });
  const rest=n-row.cells.length;
  if(rest>0){const pad=tr.insertCell();pad.colSpan=rest;pad.className='pad'}
 });
 const wrap=$('tbl');
 clear(wrap);wrap.appendChild(t);wrap.scrollLeft=0;
 const m=$('msg');
 if(res.note){m.textContent=res.note;m.hidden=false}else m.hidden=true;
 hint();
}
// اگر جدول از کادر بزرگ‌تر است، راهنمای کشیدن نشان داده شود
function hint(){
 const w=$('tbl'),h=$('shint');
 if(!h)return;
 h.hidden=!(lastRes&&w.scrollWidth>w.clientWidth+2);
}
['resize','orientationchange'].forEach(ev=>window.addEventListener(ev,()=>setTimeout(hint,150)));
$('gen').addEventListener('click',()=>{
 const letters=normalize($('q').value);
 if(!letters.length){lastRes=null;clear($('tbl'));hint();const m=$('msg');m.textContent='حرف فارسی یا عربی وارد کنید.';m.hidden=false;return}
 render(build(letters));
});
