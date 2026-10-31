import { Router } from 'express';

export function createAuthRoutes(authController) {
  const router = Router();

  router.post('/login', authController.login);
  router.get('/clients', authController.getClients);
  router.post('/clients', authController.createClient);
  router.get('/users', authController.getUsers);
  router.post('/users', authController.createUser);

  return router;
}
