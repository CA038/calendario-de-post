import { Router } from 'express';

export function createPostRoutes(postController) {
  const router = Router();

  router.get('/', postController.getPosts);
  router.post('/', postController.createPost);
  router.get('/stats', postController.getStats);
  router.patch('/:id/status', postController.updateStatus);
  router.put('/target/:clientId', postController.updateTarget);

  return router;
}
