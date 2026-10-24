/* ============================================================
   جفر ناد علی — هستهٔ محاسبات (توابع خالص؛ بدون دست‌زدن به صفحه)
   normalize ← build ← (جدول ۱۶ سطری)
   ============================================================ */
// CORE-START
// ابجد فلکی
const FAL={};
[['ایقغ',1],['بکر',2],['جلش',3],['دمت',4],['هنث',5],['وسخ',6],['زعذ',7],['حفض',8],['طصظ',9]]
 .forEach(([s,n])=>[...s].forEach(c=>FAL[c]=n));
// حروف فارسی که در ابجد فلکی نیستند به حرف هم‌صدای خود برمی‌گردند
const ALIAS={'پ':'ب','چ':'ج','ژ':'ز','گ':'ک','ء':'ا'};
const base=c=>ALIAS[c]||c;
const fal=c=>FAL[base(c)];
// دایرهٔ مستحصلهٔ ناد علی (۲۸ حرف)
const CIRCLE=[...'نادعلیمظهرجبتوفکغسصحقشضطثزخذ'];
// ابجد کبیر (به ترتیب مقدار)
const ORDER=[['ا',1],['ب',2],['ج',3],['د',4],['ه',5],['و',6],['ز',7],['ح',8],['ط',9],['ی',10],['ک',20],['ل',30],['م',40],['ن',50],['س',60],['ع',70],['ف',80],['ص',90],['ق',100],['ر',200],['ش',300],['ت',400],['ث',500],['خ',600],['ذ',700],['ض',800],['ظ',900],['غ',1000]];
const KNOWN=new Set([...ORDER.map(x=>x[0]),'پ','چ','ژ','گ','ء']);

// یکدست‌سازی حروف و حذف هرچه حرف نیست
function normalize(t){
 const map={'پ':'ب','چ':'ج','ژ':'ز','گ':'ک','ي':'ی','ى':'ی','ك':'ک','ة':'ه','ۀ':'ه','آ':'ا','أ':'ا','إ':'ا','ٱ':'ا','ؤ':'و','ئ':'ی'};
 t=t.replace(/[\u064B-\u065F\u0670\u0640]/g,'');
 let r=[];
 for(const c of t){const m=map[c]||c;if(KNOWN.has(m))r.push(m)}
 return r;
}
const dedupe=a=>{const s=new Set();return a.filter(c=>s.has(c)?false:(s.add(c),true))};
// صدر و مؤخر: یک حرف از آخر، یک حرف از اول، به‌نوبت
function sadr(a){
 let l=0,r=a.length-1;const o=[];
 while(l<=r){o.push(a[r--]);if(l<=r)o.push(a[l++])}
 return o;
}
// ناد علی: از خود حرف شروع می‌کنیم و آن را «۱» می‌شماریم
function nadAli(letter,n){
 const i=CIRCLE.indexOf(base(letter));
 return CIRCLE[(i+n-1)%CIRCLE.length];
}
// نصف: اگر نصف مقدار حرف، حرفی در ابجد کبیر دارد همان حرف؛ وگرنه حرفِ قبل از خود حرف
function half(c){
 const i=ORDER.findIndex(x=>x[0]===c);
 const v=ORDER[i][1];
 if(v%2===0){const j=ORDER.findIndex(x=>x[1]===v/2);if(j>=0)return ORDER[j][0]}
 return i>0?ORDER[i-1][0]:c; // «ا» حرف قبلی ندارد
}
// امتزاج: یک حرف از نیمهٔ راست و یک حرف از نیمهٔ چپ، به‌نوبت
function emtizaj(a){
 const n=a.length,h=Math.floor(n/2);
 const R=a.slice(0,h),L=a.slice(n-h),o=[];
 for(let i=0;i<h;i++){o.push(R[i]);o.push(L[i])}
 return o;
}
function build(input){
 const rows=[];const add=(title,cells,type,extra)=>rows.push(Object.assign({title,cells,type:type||'l'},extra||{}));
 const r1=dedupe(input);
 add('حذف مکررات',r1);
 const r2=r1.map(fal);add('ابجد فلکی سطر ۱',r2,'n');
 const r3=sadr(r1);add('صدر و مؤخر سطر ۱',r3);
 const r4=r3.map(fal);add('ابجد فلکی سطر ۳',r4,'n');
 const r5=sadr(r3);add('صدر و مؤخر سطر ۳',r5);
 const r6=r5.map(fal);add('ابجد فلکی سطر ۵',r6,'n');
 const r7=r2.map((v,i)=>v+r4[i]+r6[i]);add('جمع عمودی سطرهای ۲، ۴ و ۶',r7,'n');
 const r8=r5.map((c,i)=>nadAli(c,r7[i]));add('مستحصلهٔ ناد علی',r8);
 const r9=sadr(r8);add('صدر و مؤخر سطر ۸',r9);
 const r10=r9.map(half);add('نصف سطر ۹',r10);
 const r11=r10.map(half);
 const n=r11.length,ex={};
 if(n%2)ex.cut=(n-1)/2;else if(n>=2)ex.split=n/2-1;
 add('نصف سطر ۱۰',r11,'l',ex);
 const r12=emtizaj(r11);
 if(!r12.length)return {rows,note:'تعداد حروف برای امتزاج کافی نبود؛ متن بلندتری وارد کنید.'};
 add('امتزاج سطر ۱۱',r12);
 const r13=dedupe(r12);add('حذف مکررات سطر ۱۲',r13);
 const r14=sadr(r13);add('صدر و مؤخر سطر ۱۳',r14);
 const r15=sadr(r14);add('صدر و مؤخر سطر ۱۴',r15);
 const r16=r15.map(half);add('نصف سطر ۱۵',r16);
 return {rows};
}
// CORE-END
