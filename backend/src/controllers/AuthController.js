export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await this.authService.login(username, password);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  };

  getClients = async (req, res) => {
    try {
      const user = req.user || { role: 'superadmin' };
      const clients = await this.authService.getClients(user);
      res.json({ success: true, data: clients });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  createClient = async (req, res) => {
    try {
      const user = req.user || { role: 'superadmin' };
      const result = await this.authService.createClient(req.body, user);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getUsers = async (req, res) => {
    try {
      const user = req.user || { role: 'superadmin' };
      const users = await this.authService.getUsers(user);
      res.json({ success: true, data: users });
    } catch (err) {
      res.status(403).json({ success: false, message: err.message });
    }
  };

  createUser = async (req, res) => {
    try {
      const user = req.user || { role: 'superadmin' };
      const result = await this.authService.createUser(req.body, user);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
