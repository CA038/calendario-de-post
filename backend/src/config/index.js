import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  googleScriptUrl: process.env.GOOGLE_SCRIPT_WEBAPP_URL || ''
};
