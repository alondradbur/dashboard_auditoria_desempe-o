/* =========================================================
   APLICACIÓN PRINCIPAL DEL DASHBOARD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  actualizarFechasDelSistema();
  inicializarPantallaInicio();
  inicializarDescargaPDF();
  construirTablas();
  construirTarjetas();
  inicializarGraficas();
  inicializarMenuNarrativo();
});


/* =========================================================
   PANTALLA DE INICIO
========================================================= */
function inicializarPantallaInicio() {
  const botonIngresar = document.getElementById("botonIngresar");
  const botonVolverInicio = document.getElementById("botonVolverInicio");
  const pantallaInicio = document.getElementById("pantallaInicio");
  const dashboardApp = document.getElementById("dashboardApp");

  botonIngresar.addEventListener("click", function () {
    pantallaInicio.hidden = true;
    dashboardApp.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  });

  botonVolverInicio.addEventListener("click", function () {
    dashboardApp.hidden = true;
    pantallaInicio.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}



/* =========================================================
   FECHA ACTUAL DEL DASHBOARD
========================================================= */
function actualizarFechasDelSistema() {
  const fechaActual = obtenerFechaLarga(new Date());

  document.querySelectorAll("#fechaInicio, .pildora-fecha span, .footer-dashboard span").forEach(function (elemento) {
    if (elemento.textContent.includes("junio") || elemento.textContent.includes("mayo") || elemento.id === "fechaInicio") {
      elemento.textContent = fechaActual;
    }
  });
}

function obtenerFechaLarga(fecha) {
  return fecha.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}


/* =========================================================
   DESCARGA DEL INFORME EN PDF PROFESIONAL
   Genera un informe ejecutivo página por página, sin capturar
   todo el dashboard como una sola imagen.
========================================================= */
function inicializarDescargaPDF() {
  const botonPDF = document.getElementById("botonDescargarPDF");

  if (!botonPDF) {
    return;
  }

  botonPDF.addEventListener("click", async function () {
    await descargarInformePDF();
  });
}

async function descargarInformePDF() {
  const JsPDF = obtenerConstructorPDF();

  if (!JsPDF) {
    window.print();
    return;
  }

  const botonPDF = document.getElementById("botonDescargarPDF");
  const textoOriginal = botonPDF ? botonPDF.innerHTML : "";

  if (botonPDF) {
    botonPDF.disabled = true;
    botonPDF.innerHTML = "<span>⌛</span><strong>Generando informe</strong><small>Preparando PDF</small>";
  }

  try {
    await esperarRenderGraficas();

    const pdf = new JsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter",
      compress: true
    });

    const informe = crearContextoInformePDF(pdf);
    const datosInforme = prepararDatosInformePDF();

    agregarPortadaInforme(informe, datosInforme);
    agregarResumenEjecutivo(informe, datosInforme);
    agregarPaginaProcedimientos(informe, datosInforme);
    agregarPaginaEstatusUbicacion(informe, datosInforme);
    agregarPaginaEstructura(informe, datosInforme);
    agregarPaginaReglasBeneficios(informe, datosInforme);
    agregarPaginaConclusiones(informe, datosInforme);

    informe.aplicarNumeracion();

    pdf.save("Informe_de_Solventacion_UEC.pdf");
  } catch (error) {
    console.error("No fue posible generar el informe PDF:", error);
    alert("No fue posible generar el PDF. Intenta nuevamente cuando las gráficas terminen de cargar.");
  } finally {
    if (botonPDF) {
      botonPDF.disabled = false;
      botonPDF.innerHTML = textoOriginal;
    }
  }
}

function obtenerConstructorPDF() {
  if (window.jspdf && window.jspdf.jsPDF) {
    return window.jspdf.jsPDF;
  }

  if (window.jsPDF) {
    return window.jsPDF;
  }

  return null;
}

function esperarRenderGraficas() {
  return new Promise(function (resolver) {
    setTimeout(resolver, 450);
  });
}

function crearContextoInformePDF(pdf) {
  const ancho = pdf.internal.pageSize.getWidth();
  const alto = pdf.internal.pageSize.getHeight();

  const contexto = {
    pdf,
    ancho,
    alto,
    margen: 16,
    colorVerde: "#002F28",
    colorVerdeClaro: "#EAF1ED",
    colorDorado: "#C69A43",
    colorAzul: "#123E63",
    colorRojo: "#C91F24",
    colorTexto: "#1D1D1F",
    colorGris: "#6B7280",
    colorFondo: "#F7F3EA",

    nuevaPagina: function (titulo, subtitulo) {
      this.pdf.addPage();
      this.encabezado(titulo, subtitulo);
      return 34;
    },

    encabezado: function (titulo, subtitulo) {
      const pdfDoc = this.pdf;
      pdfDoc.setFillColor(this.colorVerde);
      pdfDoc.rect(0, 0, this.ancho, 18, "F");
      pdfDoc.setTextColor("#FFFFFF");
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setFontSize(10);
      pdfDoc.text("Unidad de Evaluación y Control", this.margen, 8);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.setFontSize(8);
      pdfDoc.text("Comisión de Vigilancia de la ASEBCS", this.margen, 13);

      pdfDoc.setTextColor(this.colorTexto);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setFontSize(15);
      pdfDoc.text(titulo, this.margen, 29);

      if (subtitulo) {
        pdfDoc.setFont("helvetica", "normal");
        pdfDoc.setFontSize(8.5);
        pdfDoc.setTextColor(this.colorGris);
        pdfDoc.text(subtitulo, this.margen, 34);
      }
    },

    pie: function (numeroPagina, totalPaginas) {
      const pdfDoc = this.pdf;
      pdfDoc.setDrawColor("#D8D1C4");
      pdfDoc.line(this.margen, this.alto - 13, this.ancho - this.margen, this.alto - 13);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.setFontSize(7.5);
      pdfDoc.setTextColor(this.colorGris);
      pdfDoc.text("Informe de Solventación · Dashboard institucional", this.margen, this.alto - 8);
      pdfDoc.text(`Página ${numeroPagina} de ${totalPaginas}`, this.ancho - this.margen, this.alto - 8, { align: "right" });
    },

    aplicarNumeracion: function () {
      const total = this.pdf.getNumberOfPages();
      for (let i = 1; i <= total; i += 1) {
        this.pdf.setPage(i);
        this.pie(i, total);
      }
    }
  };

  return contexto;
}

function prepararDatosInformePDF() {
  const procedimientos = DATOS_DASHBOARD.graficas.procedimientos;
  const totalExpedientes = procedimientos.total[procedimientos.total.length - 1];
  const totalGraves = sumarValores(procedimientos.faltasGraves);
  const totalNoGraves = sumarValores(procedimientos.faltasNoGraves);
  const totalDenuncias = sumarValores(procedimientos.denunciasPenales);
  const estatus = DATOS_DASHBOARD.graficas.estatus;
  const ubicacion = DATOS_DASHBOARD.graficas.ubicacion;
  const enInvestigacion = estatus.valores[estatus.etiquetas.indexOf("En investigación")] || 0;
  const prescritos = estatus.valores[estatus.etiquetas.indexOf("Prescrito")] || 0;
  const concluidos = estatus.valores[estatus.etiquetas.indexOf("Concluido")] || 0;
  const porcentajeInvestigacion = Math.round((enInvestigacion / totalExpedientes) * 100);
  const fecha = obtenerFechaLarga(new Date());

  return {
    fecha,
    objetivo: "Incorporar una nueva sección denominada Consolidado de Procedimientos Jurídicos, que concentre en un solo apartado la información referente a faltas administrativas graves y no graves derivadas de la fiscalización superior.",
    kpis: [
      { etiqueta: "Expedientes acumulados", valor: totalExpedientes, nota: "Cuentas públicas 2020–2022" },
      { etiqueta: "En investigación", valor: enInvestigacion, nota: `${porcentajeInvestigacion}% del total acumulado` },
      { etiqueta: "Prescritos", valor: prescritos, nota: "Casos con vencimiento procesal" },
      { etiqueta: "Concluidos", valor: concluidos, nota: "Expedientes cerrados" }
    ],
    resumen: [
      `El universo ilustrativo considera ${totalExpedientes} expedientes acumulados, integrados por ${totalGraves} faltas graves, ${totalNoGraves} faltas no graves y ${totalDenuncias} denuncias penales.`,
      `La mayor concentración se ubica en expedientes en investigación, con ${enInvestigacion} registros, por lo que se recomienda priorizar el seguimiento operativo y la trazabilidad de cada etapa procesal.`,
      "La propuesta permite homologar la captura, ordenar la lectura ejecutiva del informe semestral y generar indicadores automáticos para la toma de decisiones institucionales."
    ],
    procedimientos,
    estatus,
    ubicacion,
    estructura: DATOS_DASHBOARD.estructuraCuadro,
    ejemplo: DATOS_DASHBOARD.ejemploCaptura,
    reglas: DATOS_DASHBOARD.reglasLlenado,
    beneficios: DATOS_DASHBOARD.beneficios
  };
}

function sumarValores(valores) {
  return valores.reduce(function (total, valor) {
    return total + Number(valor || 0);
  }, 0);
}

function agregarPortadaInforme(ctx, datos) {
  const pdf = ctx.pdf;

  pdf.setFillColor(ctx.colorFondo);
  pdf.rect(0, 0, ctx.ancho, ctx.alto, "F");

  pdf.setFillColor(ctx.colorVerde);
  pdf.rect(0, 0, ctx.ancho, 48, "F");

  pdf.setFillColor(ctx.colorDorado);
  pdf.rect(0, 48, ctx.ancho, 4, "F");

  agregarLogoUEC(pdf, ctx.ancho - 48, 14, 25, 25);

  pdf.setTextColor("#FFFFFF");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("Unidad de Evaluación y Control", ctx.margen, 20);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("Comisión de Vigilancia de la Auditoría Superior del Estado de Baja California Sur", ctx.margen, 28, { maxWidth: 132 });

  pdf.setTextColor(ctx.colorTexto);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(25);
  pdf.text("Informe de Solventación", ctx.margen, 82);
  pdf.setFontSize(15);
  pdf.setTextColor(ctx.colorVerde);
  pdf.text("Consolidado de Procedimientos Jurídicos", ctx.margen, 94);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(ctx.colorGris);
  pdf.text("Auditoría de Desempeño de la Unidad de Evaluación y Control", ctx.margen, 105);

  dibujarCajaTexto(pdf, ctx.margen, 124, ctx.ancho - ctx.margen * 2, 38, "Objetivo", datos.objetivo, ctx);

  pdf.setFillColor("#FFFFFF");
  pdf.roundedRect(ctx.margen, 174, ctx.ancho - ctx.margen * 2, 34, 3, 3, "F");
  pdf.setTextColor(ctx.colorTexto);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9.5);
  pdf.text("Fecha de emisión", ctx.margen + 8, 188);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(ctx.colorGris);
  pdf.text(datos.fecha, ctx.margen + 8, 198);
  pdf.setTextColor(ctx.colorTexto);
  pdf.setFont("helvetica", "bold");
  pdf.text("Fuente", ctx.ancho / 2, 188);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(ctx.colorGris);
  pdf.text("Dashboard institucional / datos ilustrativos", ctx.ancho / 2, 198);
}

function agregarResumenEjecutivo(ctx, datos) {
  let y = ctx.nuevaPagina("Resumen ejecutivo", "Síntesis institucional de los principales indicadores y hallazgos.");

  y += 8;
  dibujarKPIs(ctx, datos.kpis, y);
  y += 44;

  ctx.pdf.setFont("helvetica", "bold");
  ctx.pdf.setFontSize(11);
  ctx.pdf.setTextColor(ctx.colorVerde);
  ctx.pdf.text("Lectura ejecutiva", ctx.margen, y);
  y += 8;

  datos.resumen.forEach(function (parrafo) {
    y = agregarParrafo(ctx.pdf, parrafo, ctx.margen, y, ctx.ancho - ctx.margen * 2, 9, ctx.colorTexto) + 4;
  });

  y += 4;
  dibujarMiniTabla(ctx, ctx.margen, y, ctx.ancho - ctx.margen * 2, [
    ["Tipo de procedimiento", "Total acumulado"],
    ["Faltas graves", String(sumarValores(datos.procedimientos.faltasGraves))],
    ["Faltas no graves", String(sumarValores(datos.procedimientos.faltasNoGraves))],
    ["Denuncias penales", String(sumarValores(datos.procedimientos.denunciasPenales))],
    ["Total general", String(datos.procedimientos.total[datos.procedimientos.total.length - 1])]
  ], ctx);
}

function agregarPaginaProcedimientos(ctx, datos) {
  let y = ctx.nuevaPagina("Evolución por cuenta pública", "Expedientes por tipo de procedimiento y comportamiento anual.");
  y += 6;

  agregarGraficaDesdeCanvas(ctx.pdf, "graficaProcedimientos", ctx.margen, y, ctx.ancho - ctx.margen * 2, 86);
  y += 96;

  const tabla = [["Cuenta pública", "Faltas graves", "Faltas no graves", "Denuncias penales", "Total"]];
  datos.procedimientos.etiquetas.forEach(function (etiqueta, indice) {
    tabla.push([
      etiqueta,
      String(datos.procedimientos.faltasGraves[indice]),
      String(datos.procedimientos.faltasNoGraves[indice]),
      String(datos.procedimientos.denunciasPenales[indice]),
      String(datos.procedimientos.total[indice])
    ]);
  });

  dibujarMiniTabla(ctx, ctx.margen, y, ctx.ancho - ctx.margen * 2, tabla, ctx);
}

function agregarPaginaEstatusUbicacion(ctx, datos) {
  let y = ctx.nuevaPagina("Estatus y ubicación de expedientes", "Distribución acumulada para focalizar seguimiento institucional.");
  y += 6;

  agregarGraficaDesdeCanvas(ctx.pdf, "graficaEstatus", ctx.margen, y, ctx.ancho - ctx.margen * 2, 82);
  y += 92;

  const mitad = (ctx.ancho - ctx.margen * 2 - 8) / 2;
  agregarGraficaDesdeCanvas(ctx.pdf, "graficaUbicacion", ctx.margen, y, mitad, 78);

  const tablaUbicacion = [["Ubicación", "Expedientes", "%"]];
  datos.ubicacion.etiquetas.forEach(function (etiqueta, indice) {
    tablaUbicacion.push([etiqueta, String(datos.ubicacion.valores[indice]), `${datos.ubicacion.porcentajes[indice]}%`]);
  });

  dibujarMiniTabla(ctx, ctx.margen + mitad + 8, y + 2, mitad, tablaUbicacion, ctx);
}

function agregarPaginaEstructura(ctx, datos) {
  let y = ctx.nuevaPagina("Estructura del Cuadro 1.1", "Campos mínimos para conservar trazabilidad por expediente.");
  y += 8;

  agregarParrafo(ctx.pdf, "El cuadro base deberá registrar un expediente por renglón. Esto permite conservar la identificación individual de cada caso, evitar duplicidades y generar indicadores consistentes.", ctx.margen, y, ctx.ancho - ctx.margen * 2, 8.5, ctx.colorTexto);
  y += 24;

  const filas = [["Campo", "Criterio de captura"]];
  datos.estructura.encabezados.forEach(function (encabezado, indice) {
    filas.push([encabezado, datos.estructura.filas[0][indice] || ""]);
  });

  dibujarTablaFlexible(ctx, ctx.margen, y, ctx.ancho - ctx.margen * 2, filas, [58, ctx.ancho - ctx.margen * 2 - 58]);
}

function agregarPaginaReglasBeneficios(ctx, datos) {
  let y = ctx.nuevaPagina("Reglas y beneficios institucionales", "Criterios de llenado y aportaciones del nuevo apartado.");
  y += 8;

  y = dibujarListaTarjetas(ctx, "Reglas de llenado", datos.reglas, y);
  y += 6;
  dibujarListaTarjetas(ctx, "Beneficios institucionales", datos.beneficios, y);
}

function agregarPaginaConclusiones(ctx, datos) {
  let y = ctx.nuevaPagina("Conclusiones", "Cierre ejecutivo para presentación ante junta.");
  y += 8;

  const conclusiones = [
    "La sección propuesta fortalece el seguimiento institucional al concentrar expedientes jurídicos en una base única y homologada.",
    "La captura por expediente conserva trazabilidad individual y mejora la lectura ejecutiva del informe semestral.",
    "Los indicadores automáticos permiten identificar concentración de asuntos por tipo de procedimiento, estatus y ubicación actual.",
    "El alto volumen de expedientes en investigación exige seguimiento periódico para reducir rezagos y anticipar riesgos de prescripción.",
    "La visualización por cuenta pública facilita detectar tendencias y variaciones relevantes entre ejercicios fiscales.",
    "El formato propuesto mejora la calidad de la información al establecer reglas claras de llenado y encabezados consistentes.",
    "La consolidación de datos facilita la toma de decisiones, la planeación de acciones correctivas y la rendición de cuentas.",
    "Se recomienda implementar el Cuadro 1.1 como insumo base del informe semestral y mantener su actualización institucional."
  ];

  conclusiones.forEach(function (texto, indice) {
    y = dibujarConclusion(ctx, indice + 1, texto, y) + 4;
  });

  y += 4;
  dibujarCajaTexto(ctx.pdf, ctx.margen, y, ctx.ancho - ctx.margen * 2, 32, "Nota", "Las cifras contenidas en este informe son ilustrativas y deberán sustituirse por la captura oficial del Cuadro 1.1 cuando se integre la información definitiva.", ctx);
}

function dibujarKPIs(ctx, kpis, y) {
  const espacio = 6;
  const anchoTarjeta = (ctx.ancho - ctx.margen * 2 - espacio * 3) / 4;

  kpis.forEach(function (kpi, indice) {
    const x = ctx.margen + indice * (anchoTarjeta + espacio);
    ctx.pdf.setFillColor("#FFFFFF");
    ctx.pdf.setDrawColor("#DED6C8");
    ctx.pdf.roundedRect(x, y, anchoTarjeta, 34, 3, 3, "FD");
    ctx.pdf.setFont("helvetica", "bold");
    ctx.pdf.setFontSize(19);
    ctx.pdf.setTextColor(ctx.colorVerde);
    ctx.pdf.text(String(kpi.valor), x + 5, y + 13);
    ctx.pdf.setFontSize(7.5);
    ctx.pdf.setTextColor(ctx.colorTexto);
    ctx.pdf.text(kpi.etiqueta, x + 5, y + 23, { maxWidth: anchoTarjeta - 10 });
    ctx.pdf.setFont("helvetica", "normal");
    ctx.pdf.setTextColor(ctx.colorGris);
    ctx.pdf.text(kpi.nota, x + 5, y + 30, { maxWidth: anchoTarjeta - 10 });
  });
}

function dibujarCajaTexto(pdf, x, y, w, h, titulo, texto, ctx) {
  pdf.setFillColor("#FFFFFF");
  pdf.setDrawColor("#DED6C8");
  pdf.roundedRect(x, y, w, h, 3, 3, "FD");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(ctx.colorVerde);
  pdf.text(titulo, x + 7, y + 10);
  agregarParrafo(pdf, texto, x + 7, y + 19, w - 14, 8.5, ctx.colorTexto);
}

function agregarParrafo(pdf, texto, x, y, ancho, tamano, color) {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(tamano);
  pdf.setTextColor(color);
  const lineas = pdf.splitTextToSize(texto, ancho);
  pdf.text(lineas, x, y);
  return y + lineas.length * (tamano * 0.43 + 2);
}

function agregarLogoUEC(pdf, x, y, w, h) {
  const logo = document.querySelector('img[src="img/logo-uec.png"]');

  if (!logo || !logo.complete) {
    return;
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = logo.naturalWidth || 300;
    canvas.height = logo.naturalHeight || 300;
    const ctxCanvas = canvas.getContext("2d");
    ctxCanvas.drawImage(logo, 0, 0, canvas.width, canvas.height);
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, y, w, h);
  } catch (error) {
    console.warn("No se pudo insertar el logo en el PDF.", error);
  }
}

function agregarGraficaDesdeCanvas(pdf, idCanvas, x, y, w, h) {
  const canvas = document.getElementById(idCanvas);

  if (!canvas) {
    return;
  }

  pdf.setFillColor("#FFFFFF");
  pdf.setDrawColor("#DED6C8");
  pdf.roundedRect(x, y, w, h, 3, 3, "FD");

  try {
    const imagen = canvas.toDataURL("image/png", 1);
    pdf.addImage(imagen, "PNG", x + 5, y + 6, w - 10, h - 12, undefined, "FAST");
  } catch (error) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor("#6B7280");
    pdf.text("No fue posible insertar esta gráfica.", x + 8, y + 14);
  }
}

function dibujarMiniTabla(ctx, x, y, w, filas, colores) {
  const pdf = ctx.pdf;
  const altoFila = 8;
  const columnas = filas[0].length;
  const anchoColumna = w / columnas;

  filas.forEach(function (fila, indiceFila) {
    const esEncabezado = indiceFila === 0;
    pdf.setFillColor(esEncabezado ? ctx.colorVerde : "#FFFFFF");
    pdf.setDrawColor("#DED6C8");
    pdf.rect(x, y + indiceFila * altoFila, w, altoFila, "FD");

    fila.forEach(function (celda, indiceColumna) {
      const tx = x + indiceColumna * anchoColumna + 3;
      pdf.setFont("helvetica", esEncabezado ? "bold" : "normal");
      pdf.setFontSize(esEncabezado ? 7.5 : 7.2);
      pdf.setTextColor(esEncabezado ? "#FFFFFF" : ctx.colorTexto);
      pdf.text(String(celda), tx, y + indiceFila * altoFila + 5.3, { maxWidth: anchoColumna - 5 });
    });
  });
}

function dibujarTablaFlexible(ctx, x, y, w, filas, anchosColumnas) {
  const pdf = ctx.pdf;
  let yActual = y;

  filas.forEach(function (fila, indiceFila) {
    const esEncabezado = indiceFila === 0;
    const lineasPorCelda = fila.map(function (celda, indiceColumna) {
      return pdf.splitTextToSize(String(celda), anchosColumnas[indiceColumna] - 6);
    });
    const altoFila = Math.max(9, Math.max(...lineasPorCelda.map(function (lineas) { return lineas.length; })) * 4.2 + 5);

    if (yActual + altoFila > ctx.alto - 22) {
      yActual = ctx.nuevaPagina("Estructura del Cuadro 1.1", "Continuación de campos de captura.") + 6;
    }

    let xActual = x;
    lineasPorCelda.forEach(function (lineas, indiceColumna) {
      const anchoColumna = anchosColumnas[indiceColumna];
      pdf.setFillColor(esEncabezado ? ctx.colorVerde : "#FFFFFF");
      pdf.setDrawColor("#DED6C8");
      pdf.rect(xActual, yActual, anchoColumna, altoFila, "FD");
      pdf.setFont("helvetica", esEncabezado ? "bold" : "normal");
      pdf.setFontSize(esEncabezado ? 7.5 : 7.1);
      pdf.setTextColor(esEncabezado ? "#FFFFFF" : ctx.colorTexto);
      pdf.text(lineas, xActual + 3, yActual + 5.5);
      xActual += anchoColumna;
    });

    yActual += altoFila;
  });

  return yActual;
}

function dibujarListaTarjetas(ctx, titulo, elementos, y) {
  const pdf = ctx.pdf;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(ctx.colorVerde);
  pdf.text(titulo, ctx.margen, y);
  y += 6;

  const ancho = (ctx.ancho - ctx.margen * 2 - 6) / 2;

  elementos.forEach(function (elemento, indice) {
    const columna = indice % 2;
    const x = ctx.margen + columna * (ancho + 6);

    if (indice > 0 && columna === 0) {
      y += 29;
    }

    if (y + 26 > ctx.alto - 22) {
      y = ctx.nuevaPagina(titulo, "Continuación.") + 6;
    }

    pdf.setFillColor("#FFFFFF");
    pdf.setDrawColor("#DED6C8");
    pdf.roundedRect(x, y, ancho, 24, 2.5, 2.5, "FD");
    pdf.setFillColor(ctx.colorDorado);
    pdf.circle(x + 7, y + 8, 3, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(ctx.colorTexto);
    pdf.text(elemento.titulo, x + 13, y + 7);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6.8);
    pdf.setTextColor(ctx.colorGris);
    pdf.text(pdf.splitTextToSize(elemento.texto, ancho - 17), x + 13, y + 13);
  });

  return y + 34;
}

function dibujarConclusion(ctx, numero, texto, y) {
  const pdf = ctx.pdf;
  const h = 15;
  pdf.setFillColor("#FFFFFF");
  pdf.setDrawColor("#DED6C8");
  pdf.roundedRect(ctx.margen, y, ctx.ancho - ctx.margen * 2, h, 2.5, 2.5, "FD");
  pdf.setFillColor(ctx.colorVerde);
  pdf.circle(ctx.margen + 8, y + 7.5, 4, "F");
  pdf.setTextColor("#FFFFFF");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text(String(numero), ctx.margen + 8, y + 8.5, { align: "center" });
  pdf.setTextColor(ctx.colorTexto);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text(pdf.splitTextToSize(texto, ctx.ancho - ctx.margen * 2 - 26), ctx.margen + 18, y + 6);
  return y + h;
}

/* =========================================================
   CONSTRUCCIÓN DE TABLAS
========================================================= */
function construirTablas() {
  renderizarTabla("tablaEstructura", DATOS_DASHBOARD.estructuraCuadro);
  renderizarTabla("tablaEjemplo", DATOS_DASHBOARD.ejemploCaptura);
}

function renderizarTabla(idTabla, datosTabla) {
  const tabla = document.getElementById(idTabla);
  const thead = tabla.querySelector("thead");
  const tbody = tabla.querySelector("tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  const filaEncabezado = document.createElement("tr");

  datosTabla.encabezados.forEach(function (encabezado) {
    const th = document.createElement("th");
    th.textContent = encabezado;
    filaEncabezado.appendChild(th);
  });

  thead.appendChild(filaEncabezado);

  datosTabla.filas.forEach(function (fila) {
    const tr = document.createElement("tr");

    fila.forEach(function (celda) {
      const td = document.createElement("td");
      td.textContent = celda;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}


/* =========================================================
   TARJETAS DE REGLAS Y BENEFICIOS
========================================================= */
function construirTarjetas() {
  const contenedorReglas = document.getElementById("contenedorReglas");
  const contenedorBeneficios = document.getElementById("contenedorBeneficios");

  DATOS_DASHBOARD.reglasLlenado.forEach(function (regla, indice) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "regla-card";
    tarjeta.innerHTML = `<strong>${indice + 1}. ${regla.titulo}</strong><p>${regla.texto}</p>`;
    contenedorReglas.appendChild(tarjeta);
  });

  DATOS_DASHBOARD.beneficios.forEach(function (beneficio) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "beneficio-card";
    tarjeta.innerHTML = `<strong>${beneficio.titulo}</strong><p>${beneficio.texto}</p>`;
    contenedorBeneficios.appendChild(tarjeta);
  });

  const avisoDatos = document.getElementById("avisoDatos");

  if (!DATOS_DASHBOARD.avisoDatos.visible) {
    avisoDatos.hidden = true;
  }
}


/* =========================================================
   GRÁFICAS CON ETIQUETAS DE DATOS
========================================================= */
function inicializarGraficas() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js no está disponible. Revisa la conexión a internet o descarga la librería localmente.");
    return;
  }

  if (typeof ChartDataLabels !== "undefined") {
    Chart.register(ChartDataLabels);
  }

  Chart.defaults.font.family = "Cambria, Georgia, Times New Roman, serif";
  Chart.defaults.color = "#1D1D1F";

  crearGraficaProcedimientos();
  crearGraficaBarras("graficaPrescritos", DATOS_DASHBOARD.graficas.prescritos, "#C69A43");
  crearGraficaBarras("graficaInvestigacion", DATOS_DASHBOARD.graficas.investigacion, "#C69A43");
  crearGraficaBarras("graficaConcluidos", DATOS_DASHBOARD.graficas.concluidos, "#C69A43");
  crearGraficaEstatus();
  crearGraficaUbicacion();
}

function opcionesBase() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 38, right: 28, bottom: 4, left: 8 }
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 14,
          usePointStyle: true,
          font: { size: 11, weight: "700" }
        }
      },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#111111",
        font: { weight: "900", size: 12 },
        offset: 4,
        clip: false,
        clamp: false,
        formatter: function (value) {
          return value;
        }
      }
    }
  };
}

function crearGraficaProcedimientos() {
  const datos = DATOS_DASHBOARD.graficas.procedimientos;
  const ctx = document.getElementById("graficaProcedimientos");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: datos.etiquetas,
      datasets: [
        {
          type: "bar",
          label: "Faltas Graves",
          data: datos.faltasGraves,
          backgroundColor: "#C91F24",
          borderRadius: 3
        },
        {
          type: "bar",
          label: "Faltas No Graves",
          data: datos.faltasNoGraves,
          backgroundColor: "#C69A43",
          borderRadius: 3
        },
        {
          type: "bar",
          label: "Denuncias Penales",
          data: datos.denunciasPenales,
          backgroundColor: "#123E63",
          borderRadius: 3
        },
        {
          type: "line",
          label: "TOTAL",
          data: datos.total,
          borderColor: "#002F28",
          backgroundColor: "#002F28",
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.25,
          datalabels: {
            align: "top",
            anchor: "end",
            offset: 4
          }
        }
      ]
    },
    options: {
      ...opcionesBase(),
      scales: {
        y: {
          beginAtZero: true,
          grace: "22%",
          grid: { color: "rgba(0,0,0,0.08)" }
        },
        x: {
          grid: { display: false },
          ticks: { font: { weight: "800" } }
        }
      }
    }
  });
}

function crearGraficaBarras(idCanvas, datos, color) {
  const ctx = document.getElementById(idCanvas);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: datos.etiquetas,
      datasets: [
        {
          label: "Expedientes",
          data: datos.valores,
          backgroundColor: color,
          borderRadius: 4,
          maxBarThickness: 72
        }
      ]
    },
    options: {
      ...opcionesBase(),
      plugins: {
        ...opcionesBase().plugins,
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grace: "28%",
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { display: true, font: { size: 10, weight: "700" } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { weight: "800" } }
        }
      }
    }
  });
}

function crearGraficaEstatus() {
  const datos = DATOS_DASHBOARD.graficas.estatus;
  const ctx = document.getElementById("graficaEstatus");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: datos.etiquetas,
      datasets: [
        {
          label: "Expedientes",
          data: datos.valores,
          backgroundColor: "#00483D",
          borderRadius: 4
        }
      ]
    },
    options: {
      ...opcionesBase(),
      indexAxis: "y",
      plugins: {
        ...opcionesBase().plugins,
        legend: { display: false },
        datalabels: {
          anchor: "end",
          align: "right",
          color: "#111111",
          font: { weight: "900", size: 12 },
          clip: false,
          clamp: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.08)" }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11, weight: "700" } }
        }
      }
    }
  });
}

function crearGraficaUbicacion() {
  const datos = DATOS_DASHBOARD.graficas.ubicacion;
  const ctx = document.getElementById("graficaUbicacion");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: datos.etiquetas,
      datasets: [
        {
          data: datos.valores,
          backgroundColor: ["#002F28", "#C69A43", "#123E63", "#707070"],
          borderColor: "#FFFFFF",
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "58%",
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            font: { size: 11, weight: "700" }
          }
        },
        datalabels: {
          color: "#FFFFFF",
          font: { weight: "900", size: 15 },
          formatter: function (value, context) {
            return datos.porcentajes[context.dataIndex] + "%";
          }
        }
      }
    }
  });
}


/* =========================================================
   MENÚ LATERAL ACTIVO SEGÚN SCROLL
========================================================= */
function inicializarMenuNarrativo() {
  const enlaces = Array.from(document.querySelectorAll("#menuSecciones a"));
  const secciones = enlaces.map(function (enlace) {
    return document.querySelector(enlace.getAttribute("href"));
  });

  window.addEventListener("scroll", function () {
    let indiceActivo = 0;

    secciones.forEach(function (seccion, indice) {
      if (seccion && seccion.getBoundingClientRect().top < 180) {
        indiceActivo = indice;
      }
    });

    enlaces.forEach(function (enlace) {
      enlace.classList.remove("activo");
    });

    enlaces[indiceActivo].classList.add("activo");
  });
}
