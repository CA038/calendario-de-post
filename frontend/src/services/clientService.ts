import { apiRequest } from './api';
import { Client, ApiResponse } from '../types';

export const ClientService = {
  async getAll(): Promise<Client[]> {
    const res = await apiRequest<Client[]>('/clients');
    return res.data || [];
  },

  async getById(id: number | string): Promise<Client | null> {
    const res = await apiRequest<Client>(`/clients/${id}`);
    return res.data || null;
  },

  async create(client: Partial<Client>): Promise<ApiResponse<Client>> {
    return await apiRequest<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client)
    });
  },

  async update(id: number | string, client: Partial<Client>): Promise<ApiResponse<Client>> {
    return await apiRequest<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client)
    });
  },

  async delete(id: number | string): Promise<boolean> {
    const res = await apiRequest<boolean>(`/clients/${id}`, {
      method: 'DELETE'
    });
    return res.success;
  }
};
