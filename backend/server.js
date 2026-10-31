import { createApp } from './src/app.js';
import { config } from './src/config/index.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${config.port}`);
  console.log(`📅 Modo Google Sheets: ${config.googleScriptUrl ? 'Conectado a Apps Script' : 'Modo local en memoria (demo)'}`);
});
