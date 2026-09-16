(() => {
const C=window.MH_CONFIG; let selectedPackage=C.packages[1]; let selectedExtras=[]; let reservations={};
const $=id=>document.getElementById(id), money=n=>new Intl.NumberFormat("es-MX",{style:"currency",currency:C.currency,maximumFractionDigits:0}).format(n);
$("year").textContent=new Date().getFullYear();
const today=new Date().toISOString().slice(0,10); $("deliveryDate").min=today; $("eventDate").min=today;
function renderPackages(){
  $("packageGrid").innerHTML=C.packages.map(p=>`<article class="package ${p.id===selectedPackage.id?"selected":""}">
    ${p.badge?`<span class="badge">${p.badge}</span>`:""}<div class="package-icon">${p.icon}</div><h3>${p.name}</h3><p>${p.description}</p><div class="price">${money(p.price)}</div><button class="btn btn-dark" data-pick="${p.id}">Elegir paquete</button></article>`).join("");
  $("bookingPackages").innerHTML=C.packages.map(p=>`<label class="mini-option ${p.id===selectedPackage.id?"selected":""}"><input type="radio" name="package" value="${p.id}" ${p.id===selectedPackage.id?"checked":""}><b>${p.name}</b><small>${p.units} bufetera(s) · ${money(p.price)}</small></label>`).join("");
  document.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{selectedPackage=C.packages.find(p=>p.id===b.dataset.pick); renderPackages(); updateSummary(); document.querySelector("#reservar").scrollIntoView({behavior:"smooth"})});
  document.querySelectorAll('input[name="package"]').forEach(i=>i.onchange=()=>{selectedPackage=C.packages.find(p=>p.id===i.value);renderPackages();updateSummary()});
}
function renderExtras(){
 $("extraGrid").innerHTML=C.extras.map(e=>`<label class="extra"><input type="checkbox" value="${e.id}"><span><b>${e.name}</b><small>${e.description} · ${money(e.price)}</small></span></label>`).join("");
 $("bookingExtras").innerHTML=C.extras.map(e=>`<label class="check-item"><input type="checkbox" value="${e.id}"><span><b>${e.name}</b><br><small>${money(e.price)}</small></span></label>`).join("");
 document.querySelectorAll("#extraGrid input,#bookingExtras input").forEach(i=>i.onchange=syncExtras);
}
function syncExtras(e){
 const id=e.target.value; const checked=e.target.checked;
 if(checked&&!selectedExtras.includes(id))selectedExtras.push(id);
 if(!checked)selectedExtras=selectedExtras.filter(x=>x!==id);
 document.querySelectorAll(`input[value="${id}"]`).forEach(i=>i.checked=checked);
 updateSummary();
}
async function getReservations(){
 if(!C.apiUrl){reservations=JSON.parse(localStorage.getItem("mh_demo_reservations")||"{}");return}
 try{const r=await fetch(`${C.apiUrl}?action=availability`); reservations=await r.json()}catch{reservations={}}
}
function key(){return `${$("deliveryDate").value}|${$("time").value}`}
function renderTimes(){
 const date=$("deliveryDate").value;
 $("availabilityGrid").innerHTML=C.times.map(t=>{
   const busy=!!reservations[`${date}|${t}`];
   return `<button type="button" class="time-btn ${busy?"busy":""} ${$("time").value===t?"active":""}" ${busy?"disabled":""} data-time="${t}">${t} ${busy?"· Ocupado":""}</button>`
 }).join("");
 $("time").innerHTML=`<option value="">Selecciona horario</option>`+C.times.map(t=>`<option value="${t}" ${$("time").value===t?"selected":""}>${t}</option>`).join("");
 document.querySelectorAll("[data-time]").forEach(b=>b.onclick=()=>{ $("time").value=b.dataset.time; renderTimes(); updateSummary()});
}
function updateSummary(){
 const extras=C.extras.filter(e=>selectedExtras.includes(e.id)), subtotal=selectedPackage.price+extras.reduce((a,e)=>a+e.price,0), delivery=C.deliveryFee,total=subtotal+delivery;
 $("sDate").textContent=$("deliveryDate").value||"—"; $("sTime").textContent=$("time").value||"—"; $("sEvent").textContent=$("eventType").value||"—"; $("sPackage").textContent=selectedPackage.name;
 $("sExtras").innerHTML=extras.length?extras.map(e=>`<div>+ ${e.name} · ${money(e.price)}</div>`).join(""):"<div>Sin extras</div>";
 $("subtotal").textContent=money(subtotal);$("delivery").textContent=money(delivery);$("total").textContent=money(total);
}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),3000)}
async function submit(e){
 e.preventDefault();
 if(!$("time").value){toast("Selecciona un horario disponible.");return}
 if(reservations[key()]){toast("Ese horario acaba de ser ocupado. Elige otro.");renderTimes();return}
 const extras=C.extras.filter(x=>selectedExtras.includes(x.id)), subtotal=selectedPackage.price+extras.reduce((a,x)=>a+x.price,0), total=subtotal+C.deliveryFee;
 const folio=`MH-${new Date().toISOString().slice(2,10).replaceAll("-","")}-${Math.floor(1000+Math.random()*9000)}`;
 const data={folio,deliveryDate:$("deliveryDate").value,eventDate:$("eventDate").value,time:$("time").value,package:selectedPackage.name,extras:extras.map(x=>x.name).join(", "),eventType:$("eventType").value,guests:$("guests").value,name:$("name").value,phone:$("phone").value,address:$("address").value,email:$("email").value,notes:$("notes").value,subtotal,delivery:C.deliveryFee,total,status:"PENDIENTE",createdAt:new Date().toISOString()};
 if(C.apiUrl){try{await fetch(C.apiUrl,{method:"POST",body:JSON.stringify(data)});}catch(err){console.warn(err)}}
 reservations[key()]=data;localStorage.setItem("mh_demo_reservations",JSON.stringify(reservations));
 const text=`Hola, Mesa de Honor. Quiero solicitar una reservación.%0A%0AFolio: ${folio}%0AFecha de entrega: ${data.deliveryDate}%0AHorario: ${data.time}%0AFecha del evento: ${data.eventDate}%0AEvento: ${data.eventType}%0AInvitados: ${data.guests}%0APaquete: ${data.package}%0AExtras: ${data.extras||"Ninguno"}%0ATotal estimado: ${money(total)}%0A%0ANombre: ${data.name}%0AWhatsApp: ${data.phone}%0ADirección: ${data.address}%0ANotas: ${data.notes||"—"}`;
 window.open(`https://wa.me/${C.whatsapp}?text=${text}`,"_blank");
 toast(`Solicitud ${folio} preparada.`);
 renderTimes();
}
$("deliveryDate").onchange=async()=>{await getReservations();renderTimes();updateSummary()};
$("time").onchange=()=>{renderTimes();updateSummary()}; $("eventType").onchange=updateSummary;
$("bookingForm").onsubmit=submit;
renderPackages();renderExtras();getReservations().then(renderTimes);updateSummary();
})();
