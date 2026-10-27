// ====== CONFIGURACION GENERAL (edita aqui) ======
const CFG = {
  APPS_SCRIPT_URL: "PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT", // termina en /exec
  DURACION_MS: 8000,                 // tiempo de cada estimulo
  IDT: { dispersion: 80, minDur: 100 }, // I-DT: px de dispersion y ms minimos de fijacion
  // aoi en coordenadas normalizadas de la imagen (0 a 1): x, y, w, h
  ESTIMULOS: [
    { id:"com_h", cat:"comercial",  fmt:"16:9", src:"assets/comercial_16-9.jpg",  aoi:{nombre:"Logo/CTA", x:.62,y:.68,w:.34,h:.28} },
    { id:"com_v", cat:"comercial",  fmt:"9:16", src:"assets/comercial_9-16.jpg",  aoi:{nombre:"Logo/CTA", x:.20,y:.72,w:.60,h:.24} },
    { id:"ui_h",  cat:"interfaz",   fmt:"16:9", src:"assets/interfaz_16-9.jpg",   aoi:{nombre:"Boton principal", x:.35,y:.40,w:.30,h:.20} },
    { id:"ui_v",  cat:"interfaz",   fmt:"9:16", src:"assets/interfaz_9-16.jpg",   aoi:{nombre:"Boton principal", x:.25,y:.40,w:.50,h:.15} },
    { id:"oc_h",  cat:"ocio",       fmt:"16:9", src:"assets/ocio_16-9.jpg",       aoi:{nombre:"Sujeto principal", x:.35,y:.25,w:.30,h:.50} },
    { id:"oc_v",  cat:"ocio",       fmt:"9:16", src:"assets/ocio_9-16.jpg",       aoi:{nombre:"Sujeto principal", x:.25,y:.30,w:.50,h:.35} },
    { id:"inf_h", cat:"informativo",fmt:"16:9", src:"assets/infografia_16-9.jpg", aoi:{nombre:"Titulo/cifra clave", x:.05,y:.05,w:.45,h:.25} },
    { id:"inf_v", cat:"informativo",fmt:"9:16", src:"assets/infografia_9-16.jpg", aoi:{nombre:"Titulo/cifra clave", x:.05,y:.03,w:.90,h:.15} }
  ]
};
// Marcador gris si todavia no pones la imagen real
function placeholderSVG(e){const v=e.fmt==='9:16',w=v?900:1600,h=v?1600:900,a=e.aoi;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#2b3640"/><rect x="${a.x*w}" y="${a.y*h}" width="${a.w*w}" height="${a.h*h}" fill="#3d5a80"/><text x="50%" y="50%" fill="#fff" font-size="64" text-anchor="middle" font-family="sans-serif">${e.id} (${e.fmt})</text></svg>`);}
