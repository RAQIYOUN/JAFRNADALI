# جفر ناد علی — ساختار پروژه

```
JAFRNADALI.html          ← فقط ساختار صفحه (HTML) + عدد نسخه
manifest.json            ← تنظیمات نصب برنامه
sw.js                    ← Service Worker (آفلاین)
icons/                   ← آیکون‌های برنامه (با لوگوی خودتان عوض کنید)
assets/
  css/
    base.css             ← استایل پایه و مشترک (هدر، کارت، دکمه، تم تیره)
    jafrnadali.css       ← جدول ریسپانسیو + کادر آیات
    pwa.css              ← نوار نصب برنامه
    updates.css          ← جای CSS تازهٔ هر نسخه
  js/
    jafr-core.js         ← محاسبات (normalize و build)
    jafr-ui.js           ← رسم جدول و رویدادها
    pwa.js               ← ثبت Service Worker + دکمهٔ نصب
    protect.js           ← جلوگیری از کپی
    updater.js           ← بررسی نسخه و تازه‌سازی خودکار
    updates.js           ← جای JS تازهٔ هر نسخه
```

## انتشار نسخهٔ جدید
۱. فقط عدد `<meta name="app-version" content="…">` را در `JAFRNADALI.html` عوض کنید.
۲. کد تازه را در `updates.css` / `updates.js` اضافه کنید (یا فایل مربوط را ویرایش کنید).
۳. آپلود کنید. همهٔ فایل‌ها با `?v=نسخه` دوباره دریافت می‌شوند و صفحه‌های باز هم خودکار تازه می‌شوند.

## فایل جدید اضافه کردید؟
نام آن را در دو جا بنویسید: آرایه‌های `CSS` / `JS` در head فایل HTML، و آرایهٔ `ASSETS` در `sw.js`.

## جابه‌جایی پوشه
همهٔ مسیرها نسبی‌اند. فقط این‌ها را بررسی کنید:
- لینک‌های «صفحهٔ اصلی» و «صفحات دیگر» (`index.html`، `JAFRTAKSIRI.html` و …) باید در پوشهٔ جدید وجود داشته باشند.
- `canonical` و `og:url` در head به آدرس جدید اشاره کنند.
- `favicon.ico` و `icons/apple-touch-icon.png` کنار صفحه باشند.
