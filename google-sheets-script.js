/**
 * ===================================================================
 * ADRIÁN REYES CREATIVO — BASE DE DATOS EN GOOGLE SHEETS (API REST)
 * ===================================================================
 */

// Estructura de las tablas y sus columnas oficiales
const ESQUEMA_TABLAS = {
  Clientes: [
    'id', 'name', 'description', 'contactEmail', 'contactPhone', 'secondaryPhone',
    'websiteUrl', 'clientType', 'isActive', 'brandColor', 'logoText',
    'targetPostsCount', 'targetReelsCount', 'storiesCount', 'monthlyPrice',
    'billingDay', 'currency', 'planName', 'notes', 'createdAt'
  ],
  Contratos: [
    'id', 'clientId', 'clientName', 'brandName', 'planName',
    'postsCount', 'reelsCount', 'storiesCount', 'currency', 'price',
    'startDate', 'duration', 'firstMonthTerms', 'recurringDay',
    'revisions', 'customNotes', 'status', 'createdAt'
  ],
  Pagos: [
    'id', 'receiptFolio', 'clientId', 'clientName', 'brandName',
    'month', 'year', 'paidDate', 'currency', 'amount', 'method',
    'status', 'reference', 'description', 'createdAt'
  ],
  Calendario_Posts: [
    'id', 'clientId', 'clientName', 'brandColor', 'title',
    'postType', 'status', 'scheduledDate', 'notes', 'createdAt'
  ]
};

/**
 * 1. FUNCIÓN DE INICIALIZACIÓN:
 * Ejecuta esta función una sola vez para crear todas las pestañas con
 * sus encabezados y formato profesional automáticamente.
 */
function inicializarBaseDatos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  Object.keys(ESQUEMA_TABLAS).forEach(nombreTabla => {
    let sheet = ss.getSheetByName(nombreTabla);
    if (!sheet) {
      sheet = ss.insertSheet(nombreTabla);
    }
    
    // Si la hoja está vacía, configuramos los encabezados
    if (sheet.getLastRow() === 0) {
      const headers = ESQUEMA_TABLAS[nombreTabla];
      sheet.appendRow(headers);
      
      // Estilo visual del encabezado (color corporativo Adrian Crea)
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#1e1e24');
      headerRange.setFontColor('#ff7a00');
      headerRange.setFontWeight('bold');
      headerRange.setFontFamily('Consolas');
      sheet.setFrozenRows(1);
    }
  });

  // Eliminar la "Hoja 1" inicial si quedó vacía
  const hojaDefault = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (hojaDefault && ss.getSheets().length > 1) {
    try { ss.deleteSheet(hojaDefault); } catch (e) {}
  }

  Logger.log("Base de datos inicializada con éxito.");
}

/**
 * 2. CONTROLADOR GET (Consultas de lectura)
 * Permite leer una tabla específica o todas al mismo tiempo.
 */
function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = params.sheet;

    // Si pide 'all' o no especifica, retorna todo el sistema
    if (!sheetName || sheetName.toLowerCase() === 'all') {
      const db = {};
      Object.keys(ESQUEMA_TABLAS).forEach(name => {
        db[name.toLowerCase()] = obtenerRegistros(ss, name);
      });
      return respuestaJson({ success: true, data: db });
    }

    const registros = obtenerRegistros(ss, sheetName);
    return respuestaJson({ success: true, count: registros.length, data: registros });
  } catch (error) {
    return respuestaJson({ success: false, error: error.toString() });
  }
}

/**
 * 3. CONTROLADOR POST (Crear, Actualizar, Eliminar y Lote)
 */
function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action || 'create';
    const sheetName = contents.sheet;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (!sheetName) throw new Error("Parámetro 'sheet' requerido");

    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error(`La pestaña '${sheetName}' no existe`);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // ACCIÓN: CREAR REGISTRO
    if (action === 'create') {
      const data = contents.data || {};
      if (!data.id) data.id = Date.now();
      if (!data.createdAt) data.createdAt = new Date().toISOString();

      const newRow = headers.map(header => data[header] !== undefined ? data[header] : '');
      sheet.appendRow(newRow);

      return respuestaJson({ success: true, message: 'Creado exitosamente', data: data });
    }

    // ACCIÓN: ACTUALIZAR REGISTRO
    if (action === 'update') {
      const id = contents.id;
      const data = contents.data || {};
      const idColIdx = headers.indexOf('id') + 1;
      const dataRows = sheet.getLastRow();

      if (dataRows < 2) throw new Error("No hay registros");

      const ids = sheet.getRange(2, idColIdx, dataRows - 1, 1).getValues();
      let rowIndex = -1;
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(id)) {
          rowIndex = i + 2;
          break;
        }
      }

      if (rowIndex === -1) throw new Error(`Registro con ID ${id} no encontrado`);

      const currentRowValues = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
      const updatedRow = headers.map((header, idx) => {
        return data[header] !== undefined ? data[header] : currentRowValues[idx];
      });

      sheet.getRange(rowIndex, 1, 1, headers.length).setValues([updatedRow]);
      return respuestaJson({ success: true, message: 'Actualizado exitosamente', id: id });
    }

    // ACCIÓN: ELIMINAR REGISTRO
    if (action === 'delete') {
      const id = contents.id;
      const idColIdx = headers.indexOf('id') + 1;
      const dataRows = sheet.getLastRow();

      if (dataRows < 2) throw new Error("No hay registros para borrar");

      const ids = sheet.getRange(2, idColIdx, dataRows - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(id)) {
          sheet.deleteRow(i + 2);
          return respuestaJson({ success: true, message: 'Eliminado exitosamente', id: id });
        }
      }
      throw new Error(`ID ${id} no encontrado`);
    }

    // ACCIÓN: CARGA O SINCRONIZACIÓN EN LOTE (MIGRACIÓN INICIAL)
    if (action === 'batch_sync') {
      const items = contents.items || [];
      if (items.length > 0) {
        // Limpiar filas viejas dejando solo encabezados
        if (sheet.getLastRow() > 1) {
          sheet.deleteRows(2, sheet.getLastRow() - 1);
        }
        const rowsToAdd = items.map(item => {
          return headers.map(header => item[header] !== undefined ? item[header] : '');
        });
        sheet.getRange(2, 1, rowsToAdd.length, headers.length).setValues(rowsToAdd);
      }
      return respuestaJson({ success: true, message: `Sincronizados ${items.length} registros.` });
    }

    throw new Error(`Acción desconocida: ${action}`);
  } catch (error) {
    return respuestaJson({ success: false, error: error.toString() });
  }
}

/**
 * Funciones Auxiliares
 */
function obtenerRegistros(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) return [];

  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const rows = values.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function respuestaJson(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
