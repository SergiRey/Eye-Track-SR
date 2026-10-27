const $=s=>document.querySelector(s);
const PUNTOS=[[8,8],[50,8],[92,8],[8,50],[50,50],[92,50],[8,92],[50,92],[92,92]];
const VAL=[[50,50],[25,25],[75,25],[25,75],[75,75]];
const CLICS=5; let i=0,c=0,ultimo=null,listo=false;
const dot=$('#dot'), espera=ms=>new Promise(r=>setTimeout(r,ms));
const mover=p=>{dot.style.left=p[0]+'%';dot.style.top=p[1]+'%';};

async function arrancar(){
  $('#intro').hidden=true; $('#cal').hidden=false; $('#res').hidden=true;
  try{await document.documentElement.requestFullscreen();}catch(e){}
  if(!listo){
    webgazer.params.faceMeshSolutionPath='./js/mediapipe/face_mesh';
    webgazer.setRegression('ridge').saveDataAcrossSessions(true).setGazeListener(d=>{if(d)ultimo={x:d.x,y:d.y};});
    await webgazer.begin();
    webgazer.showPredictionPoints(false).applyKalmanFilter(true);
    listo=true;
  }
  await webgazer.clearData();
  i=0;c=0; dot.style.pointerEvents='auto'; dot.style.opacity=.3; mover(PUNTOS[0]); txt();
}
const txt=()=>$('#txt').textContent=`Punto ${i+1} de ${PUNTOS.length}. Mira el punto y haz clic ${CLICS} veces (${c}/${CLICS}).`;
dot.onclick=()=>{
  if(dot.style.pointerEvents==='none')return;
  c++; dot.style.opacity=.3+.7*c/CLICS;
  if(c>=CLICS){c=0;i++; if(i>=PUNTOS.length)return validar(); mover(PUNTOS[i]); dot.style.opacity=.3;}
  txt();
};
async function validar(){
  dot.style.pointerEvents='none'; dot.style.opacity=1;
  $('#txt').textContent='Validacion: mira cada punto sin hacer clic y sin mover la cabeza.';
  const errs=[];
  for(const p of VAL){
    mover(p); await espera(1200); ultimo=null;
    const r=dot.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2, m=[], fin=performance.now()+1500;
    while(performance.now()<fin){ if(ultimo)m.push(ultimo); await espera(40); }
    if(m.length){const mx=m.reduce((a,q)=>a+q.x,0)/m.length,my=m.reduce((a,q)=>a+q.y,0)/m.length; errs.push(Math.hypot(mx-cx,my-cy));}
  }
  const err=errs.length?Math.round(errs.reduce((a,b)=>a+b,0)/errs.length):null;
  sessionStorage.setItem('eyet_calib',JSON.stringify({error_px:err,ts:new Date().toISOString()}));
  dot.style.opacity=0; $('#cal').hidden=true; $('#res').hidden=false;
  $('#error').textContent=err===null?'No se detecto tu mirada. Revisa la luz y que tu rostro se vea completo.':
    `Error promedio: ${err} px. `+(err<=100?'Muy buena calibracion.':err<=200?'Aceptable.':'Alto: se recomienda recalibrar.');
}
$('#btnIni').onclick=arrancar; $('#btnRe').onclick=arrancar;
$('#btnSig').onclick=()=>location.href='prueba.html';
