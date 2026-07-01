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
   DESCARGA DEL INFORME EN PDF
   Usa html2pdf si está disponible. Si no carga el CDN,
   abre la impresión del navegador para guardar como PDF.
========================================================= */
function inicializarDescargaPDF() {
  const botonPDF = document.getElementById("botonDescargarPDF");

  if (!botonPDF) {
    return;
  }

  botonPDF.addEventListener("click", function () {
    descargarInformePDF();
  });
}

function descargarInformePDF() {
  const contenido = document.querySelector(".contenido-principal");

  if (!contenido) {
    return;
  }

  if (typeof html2pdf === "undefined") {
    window.print();
    return;
  }

  const opcionesPDF = {
    margin: [8, 8, 8, 8],
    filename: "Informe_de_Solventacion_Auditoria_de_Desempeno.pdf",
    image: {
      type: "jpeg",
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#F7F3EA",
      scrollY: 0
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape"
    },
    pagebreak: {
      mode: ["css", "legacy"],
      avoid: [".seccion", ".tarjeta-grafica", ".tabla-contenedor"]
    }
  };

  html2pdf().set(opcionesPDF).from(contenido).save();
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
