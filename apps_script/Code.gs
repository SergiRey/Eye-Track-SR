// Pega esto en Extensiones > Apps Script de tu Google Sheet
function doPost(e){
  const lock=LockService.getScriptLock(); lock.waitLock(20000);
  try{
    const d=JSON.parse(e.postData.contents);
    if(!d.filas||!d.filas.length) return ContentService.createTextOutput('vacio');
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    const sh=ss.getSheetByName(d.hoja)||ss.insertSheet(d.hoja);
    const h=Object.keys(d.filas[0]);
    if(sh.getLastRow()===0) sh.appendRow(h);
    const datos=d.filas.map(r=>h.map(k=>r[k]===undefined?'':r[k]));
    sh.getRange(sh.getLastRow()+1,1,datos.length,h.length).setValues(datos);
    return ContentService.createTextOutput('ok');
  } finally { lock.releaseLock(); }
}
