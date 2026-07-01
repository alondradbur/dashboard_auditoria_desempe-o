/* =========================================================
   CONFIGURACIÓN GENERAL DEL DASHBOARD
   Edita este archivo para ocultar o mostrar páginas futuras.
========================================================= */

const CONFIG_DASHBOARD = {
  nombreDashboard: "Panel Institucional de Seguimiento",
  area: "Auditoría de Desempeño",
  unidad: "Unidad de Evaluación y Control de la CVASEBCS",

  ultimaActualizacion: "30 de junio de 2026",
  fuenteInformacion: "Google Sheets / Apps Script",
  version: "1.0",
  desarrolladoPor: "Alondra Burgoin Beltrán",

  usarDatosDesdeGoogleSheets: false,

  /*
    Pega aquí tu URL de Apps Script cuando tu Google Sheet ya tenga datos.
    Después cambia usarDatosDesdeGoogleSheets a true.
  */
  urlAppsScript: "https://script.google.com/macros/s/AKfycbwFe5AFtARasRIvvAuSy1Yq1vReZjWjKDexjY1I-Zq2HoOff4zfvHi4OKTOMeVxvwwd/exec",

  paginas: [
    {
      id: "informe-solventacion",
      titulo: "Informe de Solventación",
      visible: true
    }
  ]
};
