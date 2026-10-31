const C='lb-v4',SHELL=['./','index.html','lb-extra.js','manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
async function icon(size,mask){
  const c=new OffscreenCanvas(size,size),g=c.getContext('2d');
  const gr=g.createLinearGradient(0,0,size,size);
  gr.addColorStop(0,'#1de9c6');gr.addColorStop(.55,'#0a8bff');gr.addColorStop(1,'#ff5ca8');
  g.fillStyle=gr;
  if(mask)g.fillRect(0,0,size,size);else{g.beginPath();g.roundRect(0,0,size,size,size*.25);g.fill()}
  g.fillStyle='#fff';g.font='900 '+(size*(mask?.34:.44))+'px Arial';
  g.textAlign='center';g.textBaseline='middle';g.fillText('LB',size/2,size/2);
  return c.convertToBlob({type:'image/png'});
}
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  const p=u.pathname;
  if(/icon-(192|512|maskable)\.png$/.test(p)){
    const s=p.includes('192')?192:512,m=p.includes('maskable');
    e.respondWith(icon(s,m).then(b=>new Response(b,{headers:{'Content-Type':'image/png'}})).catch(()=>fetch(r)));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>hit||caches.match('index.html'));
    return hit||net;
  }));
});
