// Coordinador Principal de la Aplicación
let calendar;
let activeClient = null;
let currentSelectedPost = null;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  calendar = new CalendarView('calendarGrid', onPostClick);
  setupEventListeners();

  const user = Auth.getCurrentUser();
  if (user) {
    showAppScreen();
  } else {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appScreen').style.display = 'none';
  if (window.lucide) window.lucide.createIcons();
}

async function showAppScreen() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appScreen').style.display = 'flex';

  Auth.applyRolePermissions();
  await loadClients();
  await loadCalendarAndStats();
}

function switchManageTab(tabId) {
  openModal('manageModal');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  const targetPane = document.getElementById(tabId);
  if (targetBtn) targetBtn.classList.add('active');
  if (targetPane) targetPane.classList.add('active');
  loadManageData();
}

function setupEventListeners() {
  // Login Form
  document.getElementById('loginForm').addEventListener('submit', handleLogin);

  // Quick Demo Buttons
  document.querySelectorAll('.btn-demo').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('username').value = btn.dataset.user;
      document.getElementById('password').value = btn.dataset.pass;
      document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    });
  });

  // Logout desde Menú Lateral
  const sideLogoutBtn = document.getElementById('sideLogoutBtn');
  if (sideLogoutBtn) sideLogoutBtn.addEventListener('click', () => Auth.logout());

  // Navegación del Menú Lateral
  const sideNavCalendar = document.getElementById('sideNavCalendar');
  if (sideNavCalendar) {
    sideNavCalendar.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
      sideNavCalendar.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const sideNavNewPost = document.getElementById('sideNavNewPost');
  if (sideNavNewPost) {
    sideNavNewPost.addEventListener('click', () => openModal('postModal'));
  }

  const sideNavClients = document.getElementById('sideNavClients');
  if (sideNavClients) {
    sideNavClients.addEventListener('click', () => switchManageTab('clientsTab'));
  }

  const sideNavUsers = document.getElementById('sideNavUsers');
  if (sideNavUsers) {
    sideNavUsers.addEventListener('click', () => switchManageTab('usersTab'));
  }

  const sideNavAssignments = document.getElementById('sideNavAssignments');
  if (sideNavAssignments) {
    sideNavAssignments.addEventListener('click', () => switchManageTab('assignmentsTab'));
  }

  // Navegación de Mes
  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    const { year, month } = calendar.getCurrentMonthYear();
    calendar.setDate(year, month - 1);
    loadCalendarAndStats();
  });

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    const { year, month } = calendar.getCurrentMonthYear();
    calendar.setDate(year, month + 1);
    loadCalendarAndStats();
  });

  // Selector de Cliente
  document.getElementById('clientSelect').addEventListener('change', (e) => {
    activeClient = e.target.value;
    loadCalendarAndStats();
  });

  // Botón Nuevo Post en Topbar
  const newPostBtn = document.getElementById('newPostBtn');
  if (newPostBtn) {
    newPostBtn.addEventListener('click', () => openModal('postModal'));
  }

  document.getElementById('postForm').addEventListener('submit', handleCreatePost);

  // Pestañas internas de Administración
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  document.getElementById('newClientForm').addEventListener('submit', handleCreateClient);
  document.getElementById('newUserForm').addEventListener('submit', handleCreateUser);

  // Edición rápida de meta mensual
  const editTargetBtn = document.getElementById('editTargetBtn');
  if (editTargetBtn) {
    editTargetBtn.addEventListener('click', handleEditTarget);
  }

  // Acciones en Detalle de Post (Aprobar / Rechazar)
  document.getElementById('approvePostBtn').addEventListener('click', () => handleUpdateStatus('approved'));
  document.getElementById('openRejectBtn').addEventListener('click', () => {
    document.getElementById('rejectionInputSection').style.display = 'block';
  });
  document.getElementById('cancelRejectBtn').addEventListener('click', () => {
    document.getElementById('rejectionInputSection').style.display = 'none';
  });
  document.getElementById('confirmRejectBtn').addEventListener('click', () => {
    const reason = document.getElementById('rejectionReasonInput').value.trim();
    if (!reason) {
      alert('Por favor especifica el motivo del rechazo.');
      return;
    }
    handleUpdateStatus('rejected', reason);
  });

  // Cerrar modales con botones de clase data-close
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
}

async function handleLogin(e) {
  e.preventDefault();
  const errorBanner = document.getElementById('loginError');
  errorBanner.style.display = 'none';

  const userVal = document.getElementById('username').value.trim();
  const passVal = document.getElementById('password').value.trim();

  try {
    const res = await API.login(userVal, passVal);
    if (res.success && res.data) {
      Auth.setCurrentUser(res.data);
      showAppScreen();
    } else {
      errorBanner.textContent = res.message || 'Usuario o contraseña incorrectos';
      errorBanner.style.display = 'block';
    }
  } catch (err) {
    errorBanner.textContent = 'Error de conexión con el servidor.';
    errorBanner.style.display = 'block';
  }
}

async function loadClients() {
  const res = await API.getClients();
  if (!res.success) return;

  const clients = res.data || [];
  const clientSelect = document.getElementById('clientSelect');
  const postClientSelect = document.getElementById('postClient');
  const userClientSelect = document.getElementById('newUserClientSelect');

  clientSelect.innerHTML = '';
  postClientSelect.innerHTML = '';
  userClientSelect.innerHTML = '<option value="">Sin cliente asignado (para admin/operario)</option>';

  const user = Auth.getCurrentUser();

  clients.forEach(client => {
    const opt = document.createElement('option');
    opt.value = client.id;
    opt.textContent = client.name;
    clientSelect.appendChild(opt);

    const postOpt = opt.cloneNode(true);
    postClientSelect.appendChild(postOpt);

    const userOpt = opt.cloneNode(true);
    userClientSelect.appendChild(userOpt);
  });

  if (user && user.role === 'client' && user.clientId) {
    activeClient = user.clientId;
  } else if (clients.length > 0) {
    activeClient = clients[0].id;
    clientSelect.value = activeClient;
  }
}

async function loadCalendarAndStats() {
  document.getElementById('currentMonthLabel').textContent = calendar.getMonthLabel();
  const { yearMonth } = calendar.getCurrentMonthYear();

  // Cargar Posts
  const postsRes = await API.getPosts(activeClient);
  const posts = postsRes.success ? postsRes.data : [];
  calendar.render(posts);

  // Cargar Métricas y Faltantes
  if (activeClient) {
    const statsRes = await API.getStats(activeClient, yearMonth);
    if (statsRes.success) {
      const s = statsRes.data;
      document.getElementById('kpiTargetVal').textContent = s.monthlyTarget;
      document.getElementById('kpiRemainingVal').textContent = s.remainingPosts;
      document.getElementById('kpiApprovedVal').textContent = s.approvedCount;
      document.getElementById('kpiScheduledVal').textContent = s.totalScheduled;
      document.getElementById('kpiRejectedVal').textContent = s.rejectedCount;
    }
  }
}

function onPostClick(post) {
  currentSelectedPost = post;
  
  document.getElementById('detailTitle').textContent = post.title;
  document.getElementById('detailCaption').textContent = post.caption || '(Sin copy especificado)';
  document.getElementById('detailDate').textContent = post.scheduledDate ? post.scheduledDate.replace('T', ' ') : '';
  
  // Badge de Estado
  const badge = document.getElementById('detailStatusBadge');
  badge.className = `status-badge ${post.status}`;
  badge.textContent = post.status === 'approved' ? 'Aprobado' : (post.status === 'rejected' ? 'Rechazado' : 'Pendiente');

  // Media Preview
  const mediaContainer = document.getElementById('detailMediaContainer');
  mediaContainer.innerHTML = '';
  if (post.mediaUrls && post.mediaUrls.length > 0) {
    post.mediaUrls.forEach(url => {
      if (post.mediaType === 'video') {
        const vid = document.createElement('video');
        vid.className = 'detail-media-video';
        vid.src = url;
        vid.controls = true;
        mediaContainer.appendChild(vid);
      } else {
        const img = document.createElement('img');
        img.className = 'detail-media-img';
        img.src = url;
        img.alt = post.title;
        mediaContainer.appendChild(img);
      }
    });
  } else {
    mediaContainer.innerHTML = '<span style="font-size: 0.85rem; color: #a1a1aa;">Sin vista previa de archivo multimedia.</span>';
  }

  // Retroalimentación de rechazo si existe
  const rejBox = document.getElementById('detailRejectionBox');
  const rejText = document.getElementById('detailRejectionText');
  if (post.status === 'rejected' && post.rejectionReason) {
    rejBox.style.display = 'block';
    rejText.textContent = `"${post.rejectionReason}"`;
  } else {
    rejBox.style.display = 'none';
  }

  // Reset sección de rechazo
  document.getElementById('rejectionInputSection').style.display = 'none';
  document.getElementById('rejectionReasonInput').value = '';

  openModal('detailModal');
}

async function handleUpdateStatus(status, rejectionReason = '') {
  if (!currentSelectedPost) return;

  const res = await API.updatePostStatus(currentSelectedPost.id, status, rejectionReason);
  if (res.success) {
    closeModal('detailModal');
    await loadCalendarAndStats();
  } else {
    alert(res.message || 'Error al actualizar estado.');
  }
}

async function handleCreatePost(e) {
  e.preventDefault();
  const rawUrls = document.getElementById('postMediaUrls').value.trim();
  const urls = rawUrls ? rawUrls.split(',').map(u => u.trim()) : [];

  const postData = {
    clientId: document.getElementById('postClient').value,
    title: document.getElementById('postTitle').value.trim(),
    caption: document.getElementById('postCaption').value.trim(),
    mediaType: document.getElementById('postMediaType').value,
    scheduledDate: document.getElementById('postDate').value,
    mediaUrls: urls
  };

  const res = await API.createPost(postData);
  if (res.success) {
    closeModal('postModal');
    document.getElementById('postForm').reset();
    await loadCalendarAndStats();
  } else {
    alert(res.message || 'Error al crear post.');
  }
}

async function handleEditTarget() {
  const current = document.getElementById('kpiTargetVal').textContent;
  const newTarget = prompt('Ingresa la meta mensual de posts para este cliente:', current);
  if (newTarget !== null && !isNaN(newTarget)) {
    const res = await API.updateMonthlyTarget(activeClient, Number(newTarget));
    if (res.success) {
      await loadCalendarAndStats();
    } else {
      alert(res.message || 'Error al actualizar meta.');
    }
  }
}

async function loadManageData() {
  const clientsRes = await API.getClients();
  const usersRes = await API.getUsers();

  const cTbody = document.getElementById('clientsTableBody');
  cTbody.innerHTML = '';
  const clientsMap = {};
  if (clientsRes.success) {
    clientsRes.data.forEach(c => {
      clientsMap[c.id] = c.name;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.name}</strong></td>
        <td>${c.monthlyTarget} posts</td>
        <td><button class="btn btn-secondary btn-sm" onclick="editSpecificTarget('${c.id}', ${c.monthlyTarget})">Modificar Meta</button></td>
      `;
      cTbody.appendChild(tr);
    });
  }

  const uTbody = document.getElementById('usersTableBody');
  const aTbody = document.getElementById('assignmentsTableBody');
  uTbody.innerHTML = '';
  if (aTbody) aTbody.innerHTML = '';

  if (usersRes.success) {
    usersRes.data.forEach(u => {
      const clientName = u.clientId ? (clientsMap[u.clientId] || u.clientId) : 'Todos / Sin restringir';

      // Tabla de usuarios
      const trUser = document.createElement('tr');
      trUser.innerHTML = `
        <td>${u.name || u.username}</td>
        <td><code>${u.username}</code></td>
        <td><span class="user-role-badge">${u.role}</span></td>
        <td>${clientName}</td>
      `;
      uTbody.appendChild(trUser);

      // Tabla de asignaciones (Operarios y Clientes)
      if (aTbody) {
        const trAssign = document.createElement('tr');
        trAssign.innerHTML = `
          <td><strong>${u.name || u.username}</strong> (<code>${u.username}</code>)</td>
          <td><span class="user-role-badge">${u.role}</span></td>
          <td>${u.role === 'superadmin' ? 'Acceso global' : clientName}</td>
        `;
        aTbody.appendChild(trAssign);
      }
    });
  }
  if (window.lucide) window.lucide.createIcons();
}

window.editSpecificTarget = async (clientId, current) => {
  const val = prompt('Nueva meta mensual de posts:', current);
  if (val !== null && !isNaN(val)) {
    await API.updateMonthlyTarget(clientId, Number(val));
    loadManageData();
    loadCalendarAndStats();
  }
};

async function handleCreateClient(e) {
  e.preventDefault();
  const name = document.getElementById('newClientName').value.trim();
  const target = document.getElementById('newClientTarget').value;

  const res = await API.createClient({ name, monthlyTarget: target });
  if (res.success) {
    document.getElementById('newClientForm').reset();
    await loadClients();
    await loadManageData();
  } else {
    alert(res.message || 'Error al registrar cliente.');
  }
}

async function handleCreateUser(e) {
  e.preventDefault();
  const userData = {
    name: document.getElementById('newUserName').value.trim(),
    username: document.getElementById('newUserUsername').value.trim(),
    password: document.getElementById('newUserPassword').value.trim(),
    role: document.getElementById('newUserRole').value,
    clientId: document.getElementById('newUserClientSelect').value
  };

  const res = await API.createUser(userData);
  if (res.success) {
    document.getElementById('newUserForm').reset();
    await loadManageData();
  } else {
    alert(res.message || 'Error al registrar usuario.');
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}
