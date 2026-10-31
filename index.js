import { createApp } from './backend/src/app.js';
import { config } from './backend/src/config/index.js';

const app = createApp();

if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${config.port}`);
    console.log(`📅 Modo Google Sheets: ${config.googleScriptUrl ? 'Conectado a Apps Script' : 'Modo local en memoria'}`);
  });
}

export default app;
