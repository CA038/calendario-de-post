export class PostService {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async getPostsForUser(user, clientIdFilter = null) {
    // Si el usuario es un cliente, sólo puede ver sus propios posts
    const effectiveClientId = user.role === 'client' ? user.clientId : clientIdFilter;
    const posts = await this.postRepository.getPosts(effectiveClientId);

    return posts.map(post => {
      let parsedMedia = [];
      try {
        parsedMedia = typeof post.mediaUrls === 'string' ? JSON.parse(post.mediaUrls) : (post.mediaUrls || []);
      } catch (e) {
        parsedMedia = post.mediaUrls ? [post.mediaUrls] : [];
      }
      return {
        ...post,
        mediaUrls: parsedMedia
      };
    });
  }

  async createPost(postData, user) {
    if (user.role === 'client') {
      throw new Error('Los clientes no tienen permiso para programar posts.');
    }
    if (!postData.title || !postData.clientId || !postData.scheduledDate) {
      throw new Error('Título, cliente y fecha programada son obligatorios.');
    }

    return await this.postRepository.savePost(postData);
  }

  async updateStatus(postId, status, rejectionReason, user) {
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Estado no válido. Opciones: ${validStatuses.join(', ')}`);
    }

    if (status === 'rejected' && (!rejectionReason || rejectionReason.trim() === '')) {
      throw new Error('Debes indicar un motivo de rechazo para retroalimentar al equipo.');
    }

    return await this.postRepository.updatePostStatus(postId, status, rejectionReason || '');
  }

  async getMonthlyStats(clientId, yearMonth) {
    const clients = await this.postRepository.getClients();
    const client = clients.find(c => String(c.id) === String(clientId));
    const target = client ? Number(client.monthlyTarget || 0) : 0;

    const posts = await this.postRepository.getPosts(clientId);
    
    // Filtrar posts por el mes especificado (YYYY-MM)
    const monthPosts = posts.filter(p => {
      if (!p.scheduledDate) return false;
      return p.scheduledDate.startsWith(yearMonth);
    });

    const approvedCount = monthPosts.filter(p => p.status === 'approved').length;
    const pendingCount = monthPosts.filter(p => p.status === 'pending').length;
    const rejectedCount = monthPosts.filter(p => p.status === 'rejected').length;
    const totalScheduled = monthPosts.length;
    const remaining = Math.max(0, target - totalScheduled);

    return {
      monthlyTarget: target,
      totalScheduled,
      approvedCount,
      pendingCount,
      rejectedCount,
      remainingPosts: remaining
    };
  }

  async updateMonthlyTarget(clientId, target, user) {
    if (user.role !== 'superadmin') {
      throw new Error('Solo el superusuario puede modificar la meta de posts.');
    }
    return await this.postRepository.updateClientTarget(clientId, target);
  }
}
