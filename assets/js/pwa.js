/* ============================================================
   نصب برنامه (PWA): ثبت Service Worker + دکمهٔ نصب
   ============================================================ */
(function(){
 const bar=document.getElementById('pwa-bar'),txt=document.getElementById('pwa-txt'),ok=document.getElementById('pwa-ok'),x=document.getElementById('pwa-x');
 const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const DKEY='pwa-dismissed';
 const dismissed=()=>{try{return localStorage.getItem(DKEY)==='1'}catch(e){return false}};
 if('serviceWorker' in navigator&&location.protocol!=='file:'){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js?v='+(window.APP_VERSION||'0'),{scope:'./'}).catch(()=>{}));
 }
 if(standalone||dismissed())return;
 let dp=null;
 window.addEventListener('beforeinstallprompt',e=>{ // کروم، اج، اندروید، دسکتاپ
  e.preventDefault();dp=e;
  txt.textContent='این صفحه را به‌صورت برنامه روی دستگاه خود نصب کنید.';
  ok.hidden=false;bar.hidden=false;
 });
 ok.addEventListener('click',async()=>{
  if(!dp)return;dp.prompt();
  try{await dp.userChoice}catch(e){}
  dp=null;bar.hidden=true;
 });
 x.addEventListener('click',()=>{bar.hidden=true;try{localStorage.setItem(DKEY,'1')}catch(e){}});
 window.addEventListener('appinstalled',()=>{bar.hidden=true});
 // آیفون/آیپد (سافاری) دکمهٔ نصب خودکار ندارد؛ راهنما نشان داده می‌شود
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 if(ios){
  txt.textContent='برای نصب: دکمهٔ اشتراک‌گذاری (Share) را بزنید و «Add to Home Screen» را انتخاب کنید.';
  ok.hidden=true;bar.hidden=false;
 }
})();
