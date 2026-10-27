// r = rect de la imagen en pantalla; g = muestras {t,x,y}; f = fijaciones
function calcularMetricas(e,r,g,f,id){
  const nx=p=>(p.x-r.left)/r.width, ny=p=>(p.y-r.top)/r.height, A=e.aoi;
  const enAoi=k=>nx(k)>=A.x&&nx(k)<=A.x+A.w&&ny(k)>=A.y&&ny(k)<=A.y+A.h;
  const fa=f.filter(enAoi), img=g.filter(p=>nx(p)>=0&&nx(p)<=1&&ny(p)>=0&&ny(p)<=1);
  const lat=img.filter(p=>nx(p)<.15||nx(p)>.85);
  const suma=a=>a.reduce((s,k)=>s+k.dur,0), pct=(a,b)=>b?+(100*a/b).toFixed(1):'';
  return {sujeto:id,estimulo:e.id,categoria:e.cat,formato:e.fmt,aoi:A.nombre,muestras:g.length,
    pct_muestras_en_imagen:pct(img.length,g.length),
    ttff_primera_fijacion_ms:f.length?Math.round(f[0].t0):'',
    ttff_aoi_ms:fa.length?Math.round(fa[0].t0):'',
    fijaciones_total:f.length,dur_fijacion_media_ms:f.length?Math.round(suma(f)/f.length):'',
    dur_fijaciones_total_ms:Math.round(suma(f)),
    fijaciones_en_aoi:fa.length,dur_en_aoi_ms:Math.round(suma(fa)),
    pct_bordes_laterales:pct(lat.length,img.length)};
}
