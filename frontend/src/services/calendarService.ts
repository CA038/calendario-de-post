import { apiRequest } from './api';
import { CalendarPost, ApiResponse } from '../types';

const STORAGE_KEY = 'adriancrea_calendar_posts';

export const CalendarService = {
  async getAll(): Promise<CalendarPost[]> {
    try {
      const res = await apiRequest<CalendarPost[]>('/calendarposts');
      if (res.success && res.data && res.data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
        return res.data;
      }
    } catch {
      // Backend offline
    }

    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : [];
  },

  async getByMonth(year: number, month: number): Promise<CalendarPost[]> {
    try {
      const res = await apiRequest<CalendarPost[]>(`/calendarposts/month?year=${year}&month=${month}`);
      if (res.success && res.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    const all = await this.getAll();
    return all.filter((p) => {
      const dt = new Date(p.scheduledDate);
      return dt.getFullYear() === year && (dt.getMonth() + 1) === month;
    });
  },

  async create(post: Partial<CalendarPost>): Promise<ApiResponse<CalendarPost>> {
    try {
      const res = await apiRequest<CalendarPost>('/calendarposts', {
        method: 'POST',
        body: JSON.stringify(post)
      });
      if (res.success && res.data) {
        const all = await this.getAll();
        all.push(res.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        return res;
      }
    } catch {
      // Local fallback
    }

    const newPost: CalendarPost = {
      id: Date.now(),
      clientId: post.clientId,
      clientName: post.clientName || 'Cliente',
      brandColor: post.brandColor || '#ff7a00',
      title: post.title || 'Nueva Publicación',
      postType: post.postType || 'post',
      status: post.status || 'idea',
      scheduledDate: post.scheduledDate || new Date().toISOString().split('T')[0],
      notes: post.notes,
      createdAt: new Date().toISOString()
    };

    const all = await this.getAll();
    all.push(newPost);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    return {
      success: true,
      message: 'Publicación guardada localmente',
      data: newPost
    };
  },

  async update(id: number | string, post: Partial<CalendarPost>): Promise<ApiResponse<CalendarPost>> {
    try {
      const res = await apiRequest<CalendarPost>(`/calendarposts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(post)
      });
      if (res.success && res.data) {
        const all = (await this.getAll()).map((p) => (String(p.id) === String(id) ? res.data! : p));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        return res;
      }
    } catch {
      // Local fallback
    }

    const all = await this.getAll();
    const idx = all.findIndex((p) => String(p.id) === String(id));
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...post };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return { success: true, message: 'Publicación actualizada', data: all[idx] };
    }

    return { success: false, message: 'Publicación no encontrada' };
  },

  async delete(id: number | string): Promise<boolean> {
    try {
      const res = await apiRequest<boolean>(`/calendarposts/${id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        const all = (await this.getAll()).filter((p) => String(p.id) !== String(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        return true;
      }
    } catch {
      // Local fallback
    }

    const all = (await this.getAll()).filter((p) => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  }
};
