/* ============================================================
   بررسی نسخه — برای انتشار نسخهٔ جدید فقط عدد
   <meta name="app-version"> در HTML را عوض کنید.
   - همهٔ فایل‌های assets با ?v=نسخه دوباره دریافت می‌شوند.
   - اگر کاربر صفحهٔ قدیمی را باز گذاشته باشد، در بررسی بعدی
     (بازگشت به صفحه / هر ۶۰ ثانیه) کش پاک و صفحه خودکار تازه می‌شود.
   ============================================================ */
(function(){
 const cur=window.APP_VERSION||'';
 const el=document.getElementById('ver');
 if(el&&cur)el.textContent='نسخه '+cur.replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
 if(!cur||!window.fetch)return;
 const KEY='jafrnadali-reloaded',gap=60000;let last=0;
 async function check(){
  if(Date.now()-last<gap)return;last=Date.now();
  try{
   const r=await fetch(location.pathname+'?_chk='+Date.now(),{cache:'no-store'});
   if(!r.ok)return;
   const m=(await r.text()).match(/<meta\s+name="app-version"\s+content="([^"]+)"/);
   if(!m||m[1]===cur)return;
   const nv=m[1];
   try{if(sessionStorage.getItem(KEY)===nv)return;sessionStorage.setItem(KEY,nv)}catch(e){}
   if(window.caches){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}
   if(navigator.serviceWorker){const rg=await navigator.serviceWorker.getRegistrations();await Promise.all(rg.map(x=>x.update()))}
   const u=new URL(location.href);u.searchParams.set('v',nv);location.replace(u.toString());
  }catch(e){}
 }
 check();
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
 window.addEventListener('pageshow',e=>{if(e.persisted){last=0;check()}});
})();
