/*
 * MESA DE HONOR V2 — GOOGLE APPS SCRIPT
 *
 * 1. Crea un Google Sheet llamado "Mesa de Honor".
 * 2. Extensiones > Apps Script.
 * 3. Pega este archivo.
 * 4. Ejecuta setup() una vez y acepta permisos.
 * 5. Implementa > Nueva implementación > Aplicación web.
 *    Ejecutar como: Tú
 *    Quién tiene acceso: Cualquier persona
 * 6. Copia la URL /exec en js/config.js -> apiUrl
 *
 * Hojas creadas: Reservas y Config.
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();
const RES = "Reservas";

function setup(){
  let sh=SS.getSheetByName(RES)||SS.insertSheet(RES);
  const headers=["folio","createdAt","deliveryDate","eventDate","time","package","extras","eventType","guests","name","phone","address","email","notes","subtotal","delivery","total","status"];
  if(sh.getLastRow()===0) sh.appendRow(headers);
  if(!SS.getSheetByName("Config")){
    const c=SS.insertSheet("Config");
    c.getRange(1,1,5,2).setValues([
      ["clave","valor"],["whatsapp","5210000000000"],["deliveryFee","100"],["businessName","Mesa de Honor"],["timezone","America/Mexico_City"]
    ]);
  }
}

function doGet(e){
  setup();
  const action=(e.parameter.action||"availability").toLowerCase();
  if(action==="availability") return json(availability());
  if(action==="reservations") return json(allReservations());
  return json({ok:true,service:"Mesa de Honor API",version:"2.0"});
}

function doPost(e){
  setup();
  const d=JSON.parse(e.postData.contents||"{}");
  const sh=SS.getSheetByName(RES);
  // Bloqueo básico para evitar dos solicitudes simultáneas del mismo horario.
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try{
    const existing=availability();
    const key=d.deliveryDate+"|"+d.time;
    if(existing[key]) return json({ok:false,error:"HORARIO_OCUPADO"});
    sh.appendRow([
      d.folio,new Date(),d.deliveryDate,d.eventDate,d.time,d.package,d.extras,d.eventType,d.guests,
      d.name,d.phone,d.address,d.email,d.notes,d.subtotal,d.delivery,d.total,d.status||"PENDIENTE"
    ]);
    return json({ok:true,folio:d.folio});
  } finally { lock.releaseLock(); }
}

function availability(){
  const sh=SS.getSheetByName(RES), values=sh.getDataRange().getValues();
  if(values.length<2) return {};
  const h=values[0], out={};
  values.slice(1).forEach(r=>{
    const o={};h.forEach((k,i)=>o[k]=r[i]);
    if(o.deliveryDate && o.time && o.status!=="CANCELADA") out[formatDate(o.deliveryDate)+"|"+o.time]=o;
  });
  return out;
}

function allReservations(){
  const sh=SS.getSheetByName(RES), values=sh.getDataRange().getValues();
  if(values.length<2) return {};
  const h=values[0], out={};
  values.slice(1).forEach(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]); if(o.folio) out[o.folio]=o;});
  return out;
}

function formatDate(v){
  if(Object.prototype.toString.call(v)==="[object Date]") return Utilities.formatDate(v,Session.getScriptTimeZone()||"America/Mexico_City","yyyy-MM-dd");
  return String(v).slice(0,10);
}
function json(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
