# Mesa de Honor — V2

Rediseño estático para GitHub Pages con agenda compartida opcional mediante Google Sheets + Apps Script.

## 1. Publicación rápida

Sube todo el contenido de esta carpeta a tu repositorio `mesadehonor` y activa GitHub Pages desde la rama principal.

La web funciona incluso sin backend: guarda solicitudes de prueba en `localStorage`.

## 2. Activar agenda compartida gratis

### Google Sheet
1. Crea un Google Sheet.
2. Abre **Extensiones > Apps Script**.
3. Copia `apps-script/Code.gs`.
4. Ejecuta `setup()` una vez.
5. Implementa como **Aplicación web**.
6. Ejecutar como: tú.
7. Acceso: cualquier persona.
8. Copia la URL `/exec`.

### Conectar el sitio
Abre `js/config.js` y cambia:

```js
apiUrl: ""
```

por:

```js
apiUrl: "https://script.google.com/macros/s/TU_ID/exec"
```

Cambia también:

```js
whatsapp: "5210000000000"
```

por tu WhatsApp.

## 3. Personalización

Los paquetes, extras, precios, horarios y costo de entrega están en `js/config.js`.

Puedes modificar:
- nombre
- WhatsApp
- costo de entrega
- horarios
- paquetes
- extras

## 4. Flujo

Cliente → GitHub Pages → Apps Script → Google Sheets → WhatsApp.

El Apps Script usa `LockService` para reducir el riesgo de que dos clientes soliciten simultáneamente el mismo horario.

## 5. Importante

Esta versión maneja solicitudes de reservación; no almacena tarjetas ni procesa pagos.

Para producción conviene añadir autenticación al panel administrativo y políticas de privacidad antes de almacenar datos personales de clientes.

## Estructura

```text
mesadehonor/
├── index.html
├── admin.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js
│   └── app.js
├── img/
├── apps-script/
│   └── Code.gs
└── README.md
```
