/**
 * Google Apps Script - Base de datos para Calendario de Post
 * Adrian Reyes Creativo
 */

const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

// Inicializa las hojas necesarias con sus encabezados si no existen
function setupSheets() {
  const schemas = {
    'Posts': ['id', 'clientId', 'title', 'caption', 'mediaType', 'mediaUrls', 'scheduledDate', 'status', 'rejectionReason', 'createdAt'],
    'Users': ['id', 'username', 'password', 'role', 'clientId', 'name'],
    'Clients': ['id', 'name', 'monthlyTarget', 'active'],
    'Settings': ['key', 'value']
  };

  for (const sheetName in schemas) {
    let sheet = SPREADSHEET.getSheetByName(sheetName);
    if (!sheet) {
      sheet = SPREADSHEET.insertSheet(sheetName);
      sheet.appendRow(schemas[sheetName]);

      // Datos semilla iniciales si la hoja es nueva
      if (sheetName === 'Users') {
        sheet.appendRow(['usr_admin', 'admin', '123', 'superadmin', '', 'Adrian Reyes']);
        sheet.appendRow(['usr_op', 'operario1', '123', 'operator', '', 'Operario Creativo']);
        sheet.appendRow(['usr_cli', 'cliente1', '123', 'client', 'cli_1', 'Cliente Demo']);
      }
      if (sheetName === 'Clients') {
        sheet.appendRow(['cli_1', 'Adrian Reyes Creativo', 15, true]);
      }
    }
  }
}

// Endpoint HTTP GET
function doGet(e) {
  setupSheets();
  const action = e.parameter.action;
  let result = { success: false, message: 'Acción no válida' };

  try {
    switch (action) {
      case 'getPosts':
        result = { success: true, data: getRowsAsObjects('Posts', e.parameter.clientId) };
        break;
      case 'getClients':
        result = { success: true, data: getRowsAsObjects('Clients') };
        break;
      case 'getUsers':
        result = { success: true, data: getRowsAsObjects('Users') };
        break;
      default:
        result = { success: true, message: 'API Calendario de Post activa' };
    }
  } catch (error) {
    result = { success: false, error: error.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Endpoint HTTP POST
function doPost(e) {
  setupSheets();
  let result = { success: false, message: 'Sin datos' };

  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    switch (action) {
      case 'savePost':
        result = savePost(payload.data);
        break;
      case 'updateStatus':
        result = updatePostStatus(payload.data.id, payload.data.status, payload.data.rejectionReason);
        break;
      case 'saveClient':
        result = saveClient(payload.data);
        break;
      case 'saveUser':
        result = saveUser(payload.data);
        break;
      case 'updateTarget':
        result = updateClientTarget(payload.data.clientId, payload.data.monthlyTarget);
        break;
      default:
        result = { success: false, message: 'Acción POST desconocida' };
    }
  } catch (error) {
    result = { success: false, error: error.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Funciones Auxiliares
function getRowsAsObjects(sheetName, filterClientId = null) {
  const sheet = SPREADSHEET.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((header, colIdx) => {
      row[header] = data[i][colIdx];
    });

    if (filterClientId && row.clientId && String(row.clientId) !== String(filterClientId)) {
      continue;
    }
    rows.push(row);
  }
  return rows;
}

function savePost(post) {
  const sheet = SPREADSHEET.getSheetByName('Posts');
  const id = post.id || Utilities.getUuid();
  const createdAt = post.createdAt || new Date().toISOString();
  
  sheet.appendRow([
    id,
    post.clientId || '',
    post.title || '',
    post.caption || '',
    post.mediaType || 'image',
    JSON.stringify(post.mediaUrls || []),
    post.scheduledDate || '',
    post.status || 'pending', // pending, approved, rejected
    post.rejectionReason || '',
    createdAt
  ]);

  return { success: true, id: id };
}

function updatePostStatus(postId, status, reason = '') {
  const sheet = SPREADSHEET.getSheetByName('Posts');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(postId)) {
      sheet.getRange(i + 1, 8).setValue(status); // Columna 8: status
      sheet.getRange(i + 1, 9).setValue(reason || ''); // Columna 9: rejectionReason
      return { success: true, message: 'Estado actualizado' };
    }
  }
  return { success: false, message: 'Post no encontrado' };
}

function updateClientTarget(clientId, target) {
  const sheet = SPREADSHEET.getSheetByName('Clients');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(clientId)) {
      sheet.getRange(i + 1, 3).setValue(Number(target));
      return { success: true, message: 'Meta actualizada' };
    }
  }
  return { success: false, message: 'Cliente no encontrado' };
}

function saveClient(client) {
  const sheet = SPREADSHEET.getSheetByName('Clients');
  const id = client.id || Utilities.getUuid();
  sheet.appendRow([id, client.name, Number(client.monthlyTarget || 0), true]);
  return { success: true, id: id };
}

function saveUser(user) {
  const sheet = SPREADSHEET.getSheetByName('Users');
  const id = user.id || Utilities.getUuid();
  sheet.appendRow([id, user.username, user.password, user.role, user.clientId || '', user.name || '']);
  return { success: true, id: id };
}
