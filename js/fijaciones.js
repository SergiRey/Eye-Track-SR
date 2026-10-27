// Algoritmo I-DT (Dispersion-Threshold). muestras: [{t,x,y}] ordenadas por t (ms)
function detectarFijaciones(m, maxDisp, minDur){
  const out=[], n=m.length;
  const disp=(a,b)=>{let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
    for(let k=a;k<=b;k++){x0=Math.min(x0,m[k].x);x1=Math.max(x1,m[k].x);y0=Math.min(y0,m[k].y);y1=Math.max(y1,m[k].y);}
    return (x1-x0)+(y1-y0);};
  let i=0;
  while(i<n){
    let j=i; while(j<n&&m[j].t-m[i].t<minDur) j++;
    if(j>=n) break;
    if(disp(i,j)<=maxDisp){
      while(j+1<n&&disp(i,j+1)<=maxDisp) j++;
      const s=m.slice(i,j+1);
      out.push({t0:m[i].t,dur:m[j].t-m[i].t,x:s.reduce((a,p)=>a+p.x,0)/s.length,y:s.reduce((a,p)=>a+p.y,0)/s.length,n:s.length});
      i=j+1;
    } else i++;
  }
  return out;
}
