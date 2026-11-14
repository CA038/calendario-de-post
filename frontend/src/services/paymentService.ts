import { apiRequest } from './api';
import { Payment, AccountingSummary, ApiResponse } from '../types';

export const PaymentService = {
  async getAll(): Promise<Payment[]> {
    const res = await apiRequest<Payment[]>('/payments');
    return res.data || [];
  },

  async create(payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return await apiRequest<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment)
    });
  },

  async update(id: number | string, payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return await apiRequest<Payment>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payment)
    });
  },

  async delete(id: number | string): Promise<boolean> {
    const res = await apiRequest<boolean>(`/payments/${id}`, {
      method: 'DELETE'
    });
    return res.success;
  },

  async getAccountingSummary(month?: number, year?: number): Promise<AccountingSummary | null> {
    const m = month !== undefined ? `?month=${month}&year=${year || new Date().getFullYear()}` : '';
    const res = await apiRequest<AccountingSummary>(`/accounting/summary${m}`);
    return res.data || null;
  }
};
