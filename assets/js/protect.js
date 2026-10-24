/* ============================================================
   جلوگیری از کپی و مشاهدهٔ ساده‌ی کد
   توجه: کد صفحه به مرورگر کاربر می‌رسد و حفاظت صددرصدی ممکن نیست؛
   این‌ها فقط کار را سخت‌تر می‌کنند. برای غیرفعال‌کردن، خط مربوط را در HTML بردارید.
   ============================================================ */
(function(){
 const inField=t=>t&&t.closest&&t.closest('textarea,input');
 ['copy','cut','dragstart','selectstart'].forEach(ev=>document.addEventListener(ev,e=>{
  if(inField(e.target))return;e.preventDefault();
 }));
 document.addEventListener('contextmenu',e=>{if(!inField(e.target))e.preventDefault()});
 document.addEventListener('keydown',e=>{
  const k=(e.key||'').toLowerCase(),c=e.ctrlKey||e.metaKey;
  if(k==='f12'||(c&&['u','s','p'].includes(k))||(c&&e.shiftKey&&['i','j','c'].includes(k))||(e.metaKey&&e.altKey&&['i','j','c','u'].includes(k)))e.preventDefault();
  if(c&&['c','x','a'].includes(k)&&!inField(e.target))e.preventDefault();
 });
})();
