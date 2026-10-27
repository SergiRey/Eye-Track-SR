const S=leer('eyet_sujeto'); if(!S) location.href='index.html';
const CATS=[...new Set(CFG.ESTIMULOS.map(e=>e.cat))];
const cont=$c('#bloques');
function $c(s){return document.querySelector(s);}
CATS.forEach(c=>{cont.insertAdjacentHTML('beforeend',`<fieldset data-cat="${c}"><legend>Contenido ${c}</legend>
 <label>¿En qué formato lo viste mejor?</label>
 <select name="pref"><option value="">Elige…</option><option>Horizontal 16:9</option><option>Vertical 9:16</option><option>Sin preferencia</option></select>
 <label>¿Qué recuerdas de lo que viste?</label><textarea name="rec" rows="2"></textarea>
 <label>¿Qué tan cómodo fue mirarlo? (1 = nada, 5 = muy cómodo)</label>
 <select name="com"><option value="">Elige…</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></fieldset>`);});

$c('#btnFin').onclick=async()=>{
  const q=[...document.querySelectorAll('fieldset')].map(f=>({sujeto:S.id,categoria:f.dataset.cat,
    formato_preferido:f.querySelector('[name=pref]').value,recuerdo:f.querySelector('[name=rec]').value,
    comodidad_1_5:f.querySelector('[name=com]').value}));
  const cal=leer('eyet_calib')||{};
  const suj=[{sujeto:S.id,fecha:S.fecha,edad:S.edad,carrera:S.carrera,pantalla:S.pantalla,navegador:S.navegador,error_calibracion_px:cal.error_px??''}];
  const fij=leer('eyet_fij')||[], met=leer('eyet_met')||[], gaze=leer('eyet_gaze')||[];
  $c('#btnFin').disabled=true; $c('#estado').textContent='Enviando…';
  const r=await Promise.all([enviarSheets('sujetos',suj),enviarSheets('metricas',met),enviarSheets('fijaciones',fij),enviarSheets('cuestionario',q)]);
  $c('#estado').textContent=r.every(Boolean)?'Datos enviados a Google Sheets. Descarga también tu copia en CSV:':
    'No se pudo enviar a Google Sheets (revisa la URL en config.js). Descarga los CSV y guárdalos:';
  const d=$c('#descargas'); d.hidden=false;
  d.innerHTML='';
  [['gaze_'+S.id+'.csv',gaze],['fijaciones_'+S.id+'.csv',fij],['metricas_'+S.id+'.csv',met],['cuestionario_'+S.id+'.csv',q]].forEach(([n,rows])=>{
    const b=document.createElement('button');b.className='sec';b.textContent=n;b.onclick=()=>descargarCSV(n,rows);d.appendChild(b);});
};
