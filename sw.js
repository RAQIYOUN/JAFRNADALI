/* ============================================================
   Service Worker — کش برای استفادهٔ آفلاین
   نسخه از ?v= در آدرس ثبت خوانده می‌شود (همان عدد meta در HTML).
   فایل جدیدی که به assets اضافه کردید را به آرایهٔ ASSETS هم اضافه کنید.
   مسیرها نسبی‌اند؛ پوشه را هرجا ببرید کار می‌کند.
   ============================================================ */
const V=new URL(self.location.href).searchParams.get('v')||'0';
const CACHE='raqiyoun-'+V;
const ASSETS=[
 './','index.html','manifest.json','favicon.ico',
 'icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png',
 'assets/css/base.css','assets/css/jafrnadali.css','assets/css/pwa.css','assets/css/updates.css',
 'assets/js/jafr-core.js','assets/js/jafr-ui.js','assets/js/pwa.js','assets/js/protect.js','assets/js/updater.js','assets/js/updates.js'
].map(u=>/\.(css|js)$/.test(u)?u+'?v='+V:u);

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('raqiyoun-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if(req.method!=='GET')return;
 if(url.searchParams.has('_chk'))return; // بررسی نسخه همیشه مستقیم از شبکه
 const sameOrigin=url.origin===self.location.origin;
 const fonts=url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com';
 if(!sameOrigin&&!fonts)return;
 if(req.mode==='navigate'){ // صفحات: اول شبکه؛ بدون اینترنت از کش
  e.respondWith(fetch(req).then(r=>{
   if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}
   return r;
  }).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
  return;
 }
 // سایر فایل‌ها: از کش بخوان و هم‌زمان تازه کن
 e.respondWith(caches.match(req).then(hit=>{
  const net=fetch(req).then(r=>{
   if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}
   return r;
  }).catch(()=>hit);
  return hit||net;
 }));
});
