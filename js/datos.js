/* =========================================================
   DATOS ESTÁTICOS INICIALES
   Estos valores provienen del documento de propuesta.
   Son cifras ilustrativas y NO oficiales.
========================================================= */

const DATOS_DASHBOARD = {
  avisoDatos: {
    visible: true,
    texto: "Datos ilustrativos — Cuadro 1.1 pendiente de captura oficial"
  },

  estructuraCuadro: {
    encabezados: [
      "Cuenta Pública",
      "Ente Fiscalizable",
      "Oficio ASEBCS",
      "Tipo de Falta",
      "Tipo de Falta Art. LRAEMBCS",
      "Número de expediente radicado",
      "Estatus*",
      "Ubicación Actual*",
      "Detalle Breve"
    ],

    filas: [
      ["Año", "Institución auditada", "Folio u oficio", "Grave / No Grave", "Conducta infractora", "Folio del expediente", "I / S / C / P / O", "CG / CM / OIC / TJABCS / ASEBCS", "Solo cuando aplique"]
    ]
  },

  reglasLlenado: [
    {
      titulo: "Un expediente por renglón",
      texto: "Si un ente fiscalizable cuenta con más de un expediente, se agregan los renglones necesarios repitiendo Cuenta Pública y Ente Fiscalizable."
    },
    {
      titulo: "Describir la falta",
      texto: "En Tipo de Falta Art. LRAEMBCS se describirá de forma breve y precisa la conducta infractora conforme a la ley aplicable."
    },
    {
      titulo: "Encabezados visibles",
      texto: "Los encabezados deberán repetirse al inicio de cada hoja impresa para preservar la legibilidad y continuidad de la información."
    },
    {
      titulo: "Detalle Breve solo si aplica",
      texto: "Este campo se usará únicamente para información complementaria, especialmente cuando el estatus registrado sea Otro."
    }
  ],

  graficas: {
    procedimientos: {
      etiquetas: ["2020", "2021", "2022", "TOTAL"],
      faltasGraves: [10, 16, 55, 81],
      faltasNoGraves: [67, 141, 29, 251],
      denunciasPenales: [0, 0, 2, 2],
      total: [77, 157, 86, 334]
    },

    prescritos: {
      etiquetas: ["2021", "2022"],
      valores: [26, 3]
    },

    investigacion: {
      etiquetas: ["2020", "2021", "2022"],
      valores: [68, 113, 42]
    },

    concluidos: {
      etiquetas: ["2020", "2021"],
      valores: [4, 14]
    },

    estatus: {
      etiquetas: ["En investigación", "Prescrito", "Concluido", "En trámite", "En Instrucción", "Sentencia", "Pendiente de atender"],
      valores: [223, 29, 18, 10, 6, 2, 1]
    },

    ubicacion: {
      etiquetas: ["OIC", "Contraloría General", "ASEBCS", "Tribunal de Justicia Administrativa"],
      valores: [139, 115, 45, 9],
      porcentajes: [45, 37, 15, 3]
    }
  },

  ejemploCaptura: {
    encabezados: [
      "Cuenta Pública",
      "Ente Fiscalizable",
      "Oficio ASEBCS",
      "Tipo de Falta",
      "Tipo de Falta Art. LRAEMBCS",
      "Número de expediente radicado",
      "Estatus*",
      "Ubicación Actual*",
      "Detalle Breve"
    ],

    filas: [
      ["2020", "OOMSAPAS Los Cabos", "ASEBCS/DGAJ/014/2023", "No Grave", "", "EIPRA/123/2023", "I", "CG", ""],
      ["2020", "OOMSAPAS Los Cabos", "ASEBCS/DGAJ/014/2023", "No Grave", "", "EIPRA/124/2023", "I", "CG", ""],
      ["2020", "OOMSAPAS Los Cabos", "ASEBCS/DGAJ/014/2023", "No Grave", "", "EIPRA/122/2023", "C", "OIC", ""],
      ["2020", "Municipio de Loreto", "ASEBCS/DGAJ/009/2023", "No Grave", "", "CM/EPRA/001/2023", "P", "OIC", ""],
      ["2020", "OOMSAPAS Loreto", "EPRA/ASEBCS/DI/004/2022", "Grave", "", "006/2024", "O", "TJABCS", "Estatus: En Instrucción"]
    ]
  },

  beneficios: [
    { titulo: "Seguimiento institucional", texto: "Permite visualizar el avance de los expedientes en una sola sección." },
    { titulo: "Información homologada", texto: "Ordena la captura con criterios comunes para todos los registros." },
    { titulo: "Trazabilidad", texto: "Cada expediente conserva su identificación individual por renglón." },
    { titulo: "Indicadores automáticos", texto: "Las gráficas se actualizan a partir del Cuadro 1.1 cuando exista captura oficial." },
    { titulo: "Transparencia", texto: "Fortalece la claridad del informe y facilita su lectura institucional." },
    { titulo: "Toma de decisiones", texto: "Apoya el análisis ejecutivo de resultados y pendientes por atender." }
  ]
};
