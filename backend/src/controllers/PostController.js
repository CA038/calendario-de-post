export class PostController {
  constructor(postService) {
    this.postService = postService;
  }

  getPosts = async (req, res) => {
    try {
      const user = req.user || { role: 'superadmin' };
      const { clientId } = req.query;
      const posts = await this.postService.getPostsForUser(user, clientId);
      res.json({ success: true, data: posts });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  createPost = async (req, res) => {
    try {
      const user = req.user || { role: 'superadmin' };
      const result = await this.postService.createPost(req.body, user);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, rejectionReason } = req.body;
      const user = req.user || { role: 'client' };
      const result = await this.postService.updateStatus(id, status, rejectionReason, user);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getStats = async (req, res) => {
    try {
      const { clientId, yearMonth } = req.query;
      if (!clientId) {
        return res.status(400).json({ success: false, message: 'clientId es requerido' });
      }
      const ym = yearMonth || new Date().toISOString().slice(0, 7);
      const stats = await this.postService.getMonthlyStats(clientId, ym);
      res.json({ success: true, data: stats });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  updateTarget = async (req, res) => {
    try {
      const { clientId } = req.params;
      const { target } = req.body;
      const user = req.user || { role: 'superadmin' };
      const result = await this.postService.updateMonthlyTarget(clientId, target, user);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
