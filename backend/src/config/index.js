import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  googleScriptUrl: process.env.GOOGLE_SCRIPT_WEBAPP_URL || 'https://script.google.com/macros/s/AKfycbwjKjGmIjotD8-4InY5FSukanqPXx58B_FZbF7jMz59WgKRr0sORq9I9-kYQ2ieXQiF/exec'
};
