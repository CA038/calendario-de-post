import { apiRequest } from './api';
import { Contract, ApiResponse } from '../types';

export const ContractService = {
  async getAll(): Promise<Contract[]> {
    const res = await apiRequest<Contract[]>('/contracts');
    return res.data || [];
  },

  async getById(id: number | string): Promise<Contract | null> {
    const res = await apiRequest<Contract>(`/contracts/${id}`);
    return res.data || null;
  },

  async create(contract: Partial<Contract>): Promise<ApiResponse<Contract>> {
    return await apiRequest<Contract>('/contracts', {
      method: 'POST',
      body: JSON.stringify(contract)
    });
  },

  async update(id: number | string, contract: Partial<Contract>): Promise<ApiResponse<Contract>> {
    return await apiRequest<Contract>(`/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contract)
    });
  },

  async delete(id: number | string): Promise<boolean> {
    const res = await apiRequest<boolean>(`/contracts/${id}`, {
      method: 'DELETE'
    });
    return res.success;
  }
};
