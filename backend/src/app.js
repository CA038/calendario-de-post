import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { GoogleSheetsRepository } from './repositories/GoogleSheetsRepository.js';
import { PostService } from './services/PostService.js';
import { AuthService } from './services/AuthService.js';
import { PostController } from './controllers/PostController.js';
import { AuthController } from './controllers/AuthController.js';
import { createPostRoutes } from './routes/postRoutes.js';
import { createAuthRoutes } from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  // Middlewares
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-user-data', 'Authorization']
  }));
  app.use(express.json());

  // Inyección de Dependencias (SOLID)
  const sheetsRepository = new GoogleSheetsRepository();
  const postService = new PostService(sheetsRepository);
  const authService = new AuthService(sheetsRepository);
  const postController = new PostController(postService);
  const authController = new AuthController(authService);

  // Middleware simulado para adjuntar usuario de sesión si viene en cabecera
  app.use((req, res, next) => {
    const userHeader = req.headers['x-user-data'];
    if (userHeader) {
      try {
        req.user = JSON.parse(decodeURIComponent(userHeader));
      } catch (e) {
        req.user = { role: 'superadmin' };
      }
    } else {
      req.user = { role: 'superadmin' };
    }
    next();
  });

  // Rutas API
  app.use('/api/posts', createPostRoutes(postController));
  app.use('/api/auth', createAuthRoutes(authController));

  // Servir estáticos del frontend desde la carpeta public
  const publicPath = path.resolve(__dirname, '../../public');
  app.use(express.static(publicPath));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  return app;
}
