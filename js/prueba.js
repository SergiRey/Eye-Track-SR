const S=leer('eyet_sujeto'); if(!S) location.href='index.html';
const $=s=>document.querySelector(s), espera=ms=>new Promise(r=>setTimeout(r,ms));
let grabando=false,t0=0,buf=[]; const gazeAll=[],fijAll=[],metAll=[];
const barajar=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

function mostrar(e){return new Promise(res=>{
  const img=$('#stim'); img.hidden=true;
  const ok=()=>{const s=Math.min(innerWidth/img.naturalWidth,innerHeight/img.naturalHeight);
    img.style.width=img.naturalWidth*s+'px';img.style.height=img.naturalHeight*s+'px';img.hidden=false;res();};
  img.onload=ok; img.onerror=()=>{img.onerror=null;img.src=placeholderSVG(e);};
  img.src=e.src;
});}

async function iniciar(){
  $('#inicio').hidden=true;
  try{await document.documentElement.requestFullscreen();}catch(e){}
  webgazer.params.faceMeshSolutionPath='./js/mediapipe/face_mesh';
  webgazer.saveDataAcrossSessions(true).setRegression('ridge')
    .setGazeListener(d=>{if(d&&grabando)buf.push({t:performance.now()-t0,x:d.x,y:d.y});});
  await webgazer.begin();
  webgazer.showVideoPreview(false).showPredictionPoints(false).applyKalmanFilter(true);
  for(const e of barajar([...CFG.ESTIMULOS])){
    $('#stim').hidden=true; $('#cruz').hidden=false; await espera(1200); $('#cruz').hidden=true;
    await mostrar(e);
    const r=$('#stim').getBoundingClientRect(); buf=[]; t0=performance.now(); grabando=true;
    await espera(CFG.DURACION_MS); grabando=false; $('#stim').hidden=true;
    const fij=detectarFijaciones(buf,CFG.IDT.dispersion,CFG.IDT.minDur);
    metAll.push(calcularMetricas(e,r,buf,fij,S.id));
    buf.forEach(p=>gazeAll.push({sujeto:S.id,estimulo:e.id,t_ms:Math.round(p.t),x:Math.round(p.x),y:Math.round(p.y),
      nx:+((p.x-r.left)/r.width).toFixed(4),ny:+((p.y-r.top)/r.height).toFixed(4)}));
    fij.forEach((f,k)=>fijAll.push({sujeto:S.id,estimulo:e.id,orden:k+1,inicio_ms:Math.round(f.t0),dur_ms:Math.round(f.dur),
      nx:+((f.x-r.left)/r.width).toFixed(4),ny:+((f.y-r.top)/r.height).toFixed(4)}));
  }
  await webgazer.end();
  sessionStorage.setItem('eyet_gaze',JSON.stringify(gazeAll));
  sessionStorage.setItem('eyet_fij',JSON.stringify(fijAll));
  sessionStorage.setItem('eyet_met',JSON.stringify(metAll));
  if(document.fullscreenElement)document.exitFullscreen();
  location.href='cuestionario.html';
}
$('#btnIni').onclick=iniciar;
