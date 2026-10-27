function aCSV(rows){if(!rows.length)return'';const h=Object.keys(rows[0]);
  const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  return '\ufeff'+[h.join(','),...rows.map(r=>h.map(k=>q(r[k])).join(','))].join('\n');}
function descargarCSV(nombre,rows){const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([aCSV(rows)],{type:'text/csv;charset=utf-8'}));a.download=nombre;a.click();}
async function enviarSheets(hoja,filas){
  if(!CFG.APPS_SCRIPT_URL.startsWith('https')||!filas.length) return false;
  try{await fetch(CFG.APPS_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hoja,filas})});return true;}
  catch(e){console.error(e);return false;}
}
const leer=k=>JSON.parse(sessionStorage.getItem(k)||'null');
