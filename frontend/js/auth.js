// Manejo de Autenticación y Permisos por Rol
const Auth = {
  STORAGE_KEY: 'adrian_crea_auth_user',

  getCurrentUser() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.location.reload();
  },

  isSuperAdmin() {
    const u = this.getCurrentUser();
    return u && u.role === 'superadmin';
  },

  isOperator() {
    const u = this.getCurrentUser();
    return u && (u.role === 'operator' || u.role === 'superadmin');
  },

  isClient() {
    const u = this.getCurrentUser();
    return u && u.role === 'client';
  },

  applyRolePermissions() {
    const user = this.getCurrentUser();
    if (!user) return;

    // Actualizar datos del usuario en el menú lateral
    const sideUserName = document.getElementById('sideUserName');
    const sideUserRole = document.getElementById('sideUserRole');
    const sideUserAvatar = document.getElementById('sideUserAvatar');

    if (sideUserName) sideUserName.textContent = user.name || user.username;
    if (sideUserRole) {
      sideUserRole.textContent = 
        user.role === 'superadmin' ? 'Superusuario' : 
        user.role === 'operator' ? 'Operario' : 'Cliente';
    }
    if (sideUserAvatar) {
      sideUserAvatar.textContent = (user.name || user.username).charAt(0).toUpperCase();
    }

    const clientSelectorWrap = document.getElementById('clientSelectorWrap');
    const editTargetBtn = document.getElementById('editTargetBtn');
    const adminActions = document.querySelectorAll('.admin-action');

    if (user.role === 'client') {
      // Cliente: solo ve su calendario y botones de aprobar/rechazar
      adminActions.forEach(el => el.style.display = 'none');
      if (clientSelectorWrap) clientSelectorWrap.style.display = 'none';
      if (editTargetBtn) editTargetBtn.style.display = 'none';
    } else if (user.role === 'operator') {
      // Operario: puede crear posts y ver clientes, pero no crear clientes ni usuarios
      adminActions.forEach(el => el.style.display = 'none');
      const newPostBtn = document.getElementById('newPostBtn');
      const sideNavNewPost = document.getElementById('sideNavNewPost');
      if (newPostBtn) newPostBtn.style.display = 'inline-flex';
      if (sideNavNewPost) sideNavNewPost.style.display = 'flex';
      if (clientSelectorWrap) clientSelectorWrap.style.display = 'flex';
      if (editTargetBtn) editTargetBtn.style.display = 'none';
    } else {
      // Superadmin: acceso completo
      adminActions.forEach(el => el.style.display = '');
      if (clientSelectorWrap) clientSelectorWrap.style.display = 'flex';
      if (editTargetBtn) editTargetBtn.style.display = 'inline-flex';
    }
  }
};
