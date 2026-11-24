let cb;
const fs=require('fs'),vm=require('vm'),http=require('http'),assert=require('assert');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const stub=new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?()=>0:p==='getBoundingClientRect'?()=>({width:800,height:500}):stub,apply:()=>stub,construct:()=>stub,set:()=>true});
const ctx=vm.createContext({document:stub,window:stub,addEventListener(){},requestAnimationFrame(f){cb=f},setTimeout(){},devicePixelRatio:1});
vm.runInContext(js+';globalThis.T={krathongSVG,FL,BS,CC,go,launch}',ctx);
const {krathongSVG,FL,BS,CC}=ctx.T;let n=0;
for(const base of Object.keys(BS))for(const candle of Object.keys(CC))for(const incense of [false,true])
 for(const flowers of [[],Object.keys(FL),['lotus'],['jasmine','rose-red']]){
  const s=krathongSVG({base,flowers,candle,incense});n++;
  assert(s.startsWith('<svg')&&s.endsWith('</svg>'));
  assert.strictEqual((s.match(/<g /g)||[]).length,(s.match(/<\/g>/g)||[]).length);
  assert(!/undefined|NaN/.test(s),`bad svg ${base}/${candle}`);
 }
console.log(`✔ ตรวจ SVG กระทง ${n} แบบ ผ่านทั้งหมด`);
const srv=http.createServer((q,r)=>r.end(html)).listen(0,async()=>{
 const res=await fetch(`http://localhost:${srv.address().port}/`);
 assert.strictEqual(res.status,200);assert((await res.text()).includes('ลอยกระทง'));
 console.log('✔ เซิร์ฟเวอร์ Node.js เสิร์ฟหน้าเว็บได้ (200)');srv.close()});

ctx.T.go('river');for(let i=1;i<=400;i++)cb(i*50);ctx.T.launch();for(let i=401;i<=700;i++)cb(i*50);
console.log('✔ รันแอนิเมชัน (พลุ เงา ระลอกน้ำ ดาว) 700 เฟรม ไม่มีข้อผิดพลาด');
const okIds=['pt','pt2','mg','jm','gd','lf','lf2','bs','rR','rP','rW','rY','am','bt'];
for(const b of Object.keys(BS))for(const f of Object.keys(FL))for(const m of krathongSVG({base:b,flowers:[f],candle:'red',incense:true}).matchAll(/url\(#(\w+)\)/g))assert(okIds.includes(m[1]),m[1]);
console.log('✔ gradient ที่ฐาน/ดอกไม้อ้างอิงมีครบทุกตัว');
