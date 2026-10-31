export class AuthService {
  constructor(sheetsRepository) {
    this.sheetsRepository = sheetsRepository;
  }

  async login(username, password) {
    const users = await this.sheetsRepository.getUsers();
    const user = users.find(u => u.username === username && String(u.password) === String(password));

    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    // Retorna usuario sin la contraseña sensible
    return {
      id: user.id,
      username: user.username,
      role: user.role, // 'superadmin' | 'operator' | 'client'
      clientId: user.clientId || '',
      name: user.name || user.username
    };
  }

  async createUser(userData, currentUser) {
    if (currentUser.role !== 'superadmin') {
      throw new Error('Solo el superusuario puede crear nuevos usuarios.');
    }

    if (!userData.username || !userData.password || !userData.role) {
      throw new Error('Usuario, contraseña y rol son requeridos.');
    }

    const validRoles = ['superadmin', 'operator', 'client'];
    if (!validRoles.includes(userData.role)) {
      throw new Error(`Rol inválido. Debe ser: ${validRoles.join(', ')}`);
    }

    if (userData.role === 'client' && !userData.clientId) {
      throw new Error('Los usuarios clientes deben estar asignados a un cliente específico.');
    }

    return await this.sheetsRepository.saveUser(userData);
  }

  async createClient(clientData, currentUser) {
    if (currentUser.role !== 'superadmin') {
      throw new Error('Solo el superusuario puede registrar nuevos clientes.');
    }

    if (!clientData.name) {
      throw new Error('El nombre del cliente es obligatorio.');
    }

    return await this.sheetsRepository.saveClient(clientData);
  }

  async getClients(currentUser) {
    const clients = await this.sheetsRepository.getClients();
    if (currentUser.role === 'client') {
      return clients.filter(c => String(c.id) === String(currentUser.clientId));
    }
    return clients;
  }

  async getUsers(currentUser) {
    if (currentUser.role !== 'superadmin') {
      throw new Error('No tienes permisos para ver la lista de usuarios.');
    }
    const users = await this.sheetsRepository.getUsers();
    return users.map(u => ({
      id: u.id,
      username: u.username,
      role: u.role,
      clientId: u.clientId,
      name: u.name
    }));
  }
}
