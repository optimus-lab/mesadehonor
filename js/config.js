/*
 * MESA DE HONOR V2 — CONFIGURACIÓN
 * 1) Cambia whatsapp por el número con código de país, sin + ni espacios.
 * 2) Cuando publiques Apps Script, pega la URL en apiUrl.
 */
window.MH_CONFIG = {
  businessName: "Mesa de Honor",
  whatsapp: "529981199650",
  currency: "MXN",
  deliveryFee: 100,
  apiUrl: "https://script.google.com/macros/s/AKfycbzd7AQ-Qqb8YJNDNasbkJ0zmqaxFMQFyymVhciLDcgbSWm7FQDuNvl9ni0o6dRF2mHCmQ/exec", // Ejemplo: https://script.google.com/macros/s/XXXXXXXX/exec
  times: ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"],
  packages: [
    {id:"esencial", icon:"🥘", name:"Esencial", description:"Ideal para reuniones pequeñas y mesas de honor sencillas.", units:1, price:200},
    {id:"celebracion", icon:"✨", name:"Celebración", description:"Una presentación completa para cumpleaños, bautizos y reuniones.", units:2, price:400, badge:"Más elegido"},
    {id:"gran-evento", icon:"👑", name:"Gran Evento", description:"Mayor capacidad para bodas, XV años y eventos empresariales.", units:4, price:750}
  ],
  extras: [
    {id:"mantel", name:"Mantel elegante", description:"Presentación cuidada", price:150},
    {id:"montaje", name:"Montaje", description:"Armado antes del evento", price:250},
    {id:"desmontaje", name:"Desmontaje", description:"Retiro del equipo", price:150},
    {id:"vajilla", name:"Vajilla y cubiertos", description:"Servicio para invitados", price:200},
    {id:"charolas", name:"Charolas", description:"Presentación adicional", price:80},
    {id:"decoracion", name:"Decoración", description:"Detalle decorativo", price:300}
  ]
};
