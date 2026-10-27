const $=s=>document.querySelector(s); let datos=[];
const sel=$('#sel'); CFG.ESTIMULOS.forEach(e=>sel.add(new Option(`${e.id} · ${e.cat} ${e.fmt}`,e.id)));
function csv(t){const L=t.replace(/^\ufeff/,'').trim().split(/\r?\n/),h=L[0].split(',').map(s=>s.replace(/"/g,''));
  return L.slice(1).map(l=>{const v=l.split(',').map(s=>s.replace(/^"|"$/g,''));const o={};h.forEach((k,i)=>o[k]=v[i]);return o;});}
$('#arch').onchange=async ev=>{datos=[];for(const f of ev.target.files)datos.push(...csv(await f.text()));dibujar();};
sel.onchange=$('#chkMapa').onchange=$('#chkRuta').onchange=$('#chkAoi').onchange=dibujar;

const paleta=(()=>{const c=document.createElement('canvas');c.width=256;c.height=1;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,256,0);
  [[0,'#1e3a8a'],[.35,'#16a34a'],[.65,'#facc15'],[1,'#dc2626']].forEach(([p,col])=>g.addColorStop(p,col));x.fillStyle=g;x.fillRect(0,0,256,1);return x.getImageData(0,0,256,1).data;})();

function dibujar(){
  const e=CFG.ESTIMULOS.find(k=>k.id===sel.value), pts=datos.filter(p=>p.estimulo===e.id);
  const img=new Image(); img.onerror=()=>{img.onerror=null;img.src=placeholderSVG(e);};
  img.onload=()=>{
    const cv=$('#cv'),W=Math.min(760,img.naturalWidth),H=Math.round(W*img.naturalHeight/img.naturalWidth);cv.width=W;cv.height=H;
    const c=cv.getContext('2d'); c.drawImage(img,0,0,W,H);
    $('#info').textContent=`${pts.length} muestras de ${new Set(pts.map(p=>p.sujeto)).size} participante(s).`;
    if($('#chkMapa').checked&&pts.length){
      const a=document.createElement('canvas');a.width=W;a.height=H;const x=a.getContext('2d'),R=Math.round(W*.05);
      pts.forEach(p=>{const px=p.nx*W,py=p.ny*H,g=x.createRadialGradient(px,py,0,px,py,R);g.addColorStop(0,'rgba(0,0,0,.1)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(px-R,py-R,2*R,2*R);});
      const im=x.getImageData(0,0,W,H),d=im.data;let mx=1;for(let i=3;i<d.length;i+=4)mx=Math.max(mx,d[i]);
      for(let i=0;i<d.length;i+=4){const v=d[i+3]/mx,k=Math.floor(v*255)*4;d[i]=paleta[k];d[i+1]=paleta[k+1];d[i+2]=paleta[k+2];d[i+3]=v<.05?0:Math.min(210,v*255);}
      x.putImageData(im,0,0);c.drawImage(a,0,0);
    }
    if($('#chkRuta').checked){
      const cols=['#fff','#f0abfc','#67e8f9','#fde047','#86efac'];
      [...new Set(pts.map(p=>p.sujeto))].forEach((s,si)=>{
        const m=pts.filter(p=>p.sujeto===s).map(p=>({t:+p.t_ms,x:p.nx*1000,y:p.ny*1000})),f=detectarFijaciones(m,60,100);
        c.strokeStyle=cols[si%5];c.lineWidth=2;c.beginPath();f.forEach((k,i)=>{const px=k.x/1000*W,py=k.y/1000*H;i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();
        f.forEach((k,i)=>{const px=k.x/1000*W,py=k.y/1000*H;c.fillStyle=cols[si%5];c.beginPath();c.arc(px,py,Math.max(5,k.dur/40),0,7);c.globalAlpha=.55;c.fill();c.globalAlpha=1;c.fillStyle='#000';c.font='11px sans-serif';c.fillText(i+1,px-3,py+4);});
      });
    }
    if($('#chkAoi').checked){const A=e.aoi;c.setLineDash([6,4]);c.strokeStyle='#fff';c.lineWidth=2;c.strokeRect(A.x*W,A.y*H,A.w*W,A.h*H);c.setLineDash([]);}
  };
  img.src=e.src;
}
dibujar();
