// Cliente API para comunicarse con el Backend
const isLocalCustomPort = window.location.hostname === 'localhost' && window.location.port !== '3001';
const API_BASE_URL = (window.location.protocol === 'file:' || isLocalCustomPort)
  ? 'http://localhost:3001'
  : '';

const API = {
  getUserHeader() {
    const user = Auth.getCurrentUser();
    return user ? { 'x-user-data': encodeURIComponent(JSON.stringify(user)) } : {};
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await res.json();
  },

  async getPosts(clientId = null) {
    const query = clientId ? `?clientId=${clientId}` : '';
    const res = await fetch(`${API_BASE_URL}/api/posts${query}`, {
      headers: { ...this.getUserHeader() }
    });
    return await res.json();
  },

  async createPost(postData) {
    const res = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getUserHeader()
      },
      body: JSON.stringify(postData)
    });
    return await res.json();
  },

  async updatePostStatus(postId, status, rejectionReason = '') {
    const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getUserHeader()
      },
      body: JSON.stringify({ status, rejectionReason })
    });
    return await res.json();
  },

  async getStats(clientId, yearMonth) {
    const res = await fetch(`${API_BASE_URL}/api/posts/stats?clientId=${clientId}&yearMonth=${yearMonth}`, {
      headers: { ...this.getUserHeader() }
    });
    return await res.json();
  },

  async updateMonthlyTarget(clientId, target) {
    const res = await fetch(`${API_BASE_URL}/api/posts/target/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getUserHeader()
      },
      body: JSON.stringify({ target })
    });
    return await res.json();
  },

  async getClients() {
    const res = await fetch(`${API_BASE_URL}/api/auth/clients`, {
      headers: { ...this.getUserHeader() }
    });
    return await res.json();
  },

  async createClient(clientData) {
    const res = await fetch(`${API_BASE_URL}/api/auth/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getUserHeader()
      },
      body: JSON.stringify(clientData)
    });
    return await res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
      headers: { ...this.getUserHeader() }
    });
    return await res.json();
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE_URL}/api/auth/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getUserHeader()
      },
      body: JSON.stringify(userData)
    });
    return await res.json();
  }
};
