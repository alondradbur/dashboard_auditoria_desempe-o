# Panel Institucional de Seguimiento — Auditoría de Desempeño

Dashboard HTML estático listo para GitHub Pages.

## Archivos principales

- `index.html`: estructura general del dashboard.
- `css/estilos.css`: diseño completo y variables de color.
- `js/config.js`: configuración general, URL de Apps Script y páginas visibles.
- `js/datos.js`: datos estáticos editables desde Bloc de Notas.
- `js/app.js`: interacción, tablas, navegación y gráficas.
- `img/logo-uec.png`: logotipo institucional.

## Cómo cambiar los datos

Abre `js/datos.js` en Bloc de Notas y reemplaza los valores de ejemplo por los datos oficiales.

## Cómo conectar Google Sheets / Apps Script

1. Publica tu Apps Script como aplicación web.
2. Copia la URL que termina en `/exec`.
3. Abre `js/config.js`.
4. Pega la URL en `urlAppsScript`.
5. Cambia `usarDatosDesdeGoogleSheets` a `true` cuando el archivo esté preparado para leer datos en vivo.

## Cómo ocultar o mostrar páginas futuras

En `js/config.js`, cada página tendrá una propiedad:

```js
visible: true
```

Para ocultarla cambia a:

```js
visible: false
```

## Despliegue en GitHub Pages

1. Sube todos los archivos al repositorio.
2. En GitHub entra a Settings > Pages.
3. Selecciona la rama principal y la carpeta raíz.
4. Guarda los cambios.

## Descargar el informe en PDF

En el menú lateral, debajo de la sección **Conclusiones**, usa el botón **Informe de Solventación** para descargar una versión PDF del dashboard. Si el navegador no carga la librería externa de PDF, se abrirá la ventana de impresión para guardar como PDF.
