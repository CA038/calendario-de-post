import { Client, Contract, Payment, CalendarPost, ApiResponse } from '../types';

export const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_URL ||
  'https://script.google.com/macros/s/AKfycbxIk3Lxrre0_LxD-0LSiXt6OmRmYIMfSpvriXCDIBOS0N8aoZ9iRjaYBFuI4B7ZdbL1/exec';

// Normalizadores para compatibilidad bidireccional entre la hoja y la app
export function normalizeClient(raw: any): Client {
  return {
    id: raw.id || Date.now(),
    name: raw.name || 'Sin nombre',
    brandName: raw.brandName || raw.description || '',
    category: (raw.category || raw.clientType || 'active') as any,
    email: raw.email || raw.contactEmail || '',
    phone: raw.phone || raw.contactPhone || '',
    secondaryPhone: raw.secondaryPhone || '',
    websiteUrl: raw.websiteUrl || '',
    notes: raw.notes || '',
    brandColor: raw.brandColor || '#ff7a00',
    logoText: raw.logoText || 'AR',
    logoUrl: raw.logoUrl || '',
    planName: raw.planName || 'Plan Crecimiento',
    monthlyPostsLimit: Number(raw.monthlyPostsLimit || raw.targetPostsCount || 14),
    monthlyReelsLimit: Number(raw.monthlyReelsLimit || raw.targetReelsCount || 4),
    storiesCount: Number(raw.storiesCount || 12),
    currency: (raw.currency || 'HNL') as any,
    monthlyPrice: Number(raw.monthlyPrice || 8500),
    billingDay: Number(raw.billingDay || 15),
    isActive: raw.isActive === true || raw.isActive === 'true' || raw.isActive === 1 || raw.isActive === 'TRUE',
    accessToken: raw.accessToken || '',
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export function denormalizeClient(client: Partial<Client>): Record<string, any> {
  return {
    id: client.id,
    name: client.name,
    description: client.brandName || '',
    contactEmail: client.email || '',
    contactPhone: client.phone || '',
    secondaryPhone: client.secondaryPhone || '',
    websiteUrl: client.websiteUrl || '',
    clientType: client.category || 'active',
    isActive: client.isActive ?? true,
    brandColor: client.brandColor || '#ff7a00',
    logoText: client.logoText || 'AR',
    targetPostsCount: client.monthlyPostsLimit ?? 14,
    targetReelsCount: client.monthlyReelsLimit ?? 4,
    storiesCount: client.storiesCount ?? 12,
    monthlyPrice: client.monthlyPrice ?? 8500,
    billingDay: client.billingDay ?? 15,
    currency: client.currency || 'HNL',
    planName: client.planName || 'Plan Crecimiento',
    notes: client.notes || '',
    createdAt: client.createdAt || new Date().toISOString(),
  };
}

export function normalizeContract(raw: any): Contract {
  return {
    id: raw.id || Date.now(),
    clientId: raw.clientId ? Number(raw.clientId) : undefined,
    clientName: raw.clientName || '',
    brandName: raw.brandName || '',
    planName: raw.planName || 'Plan Crecimiento',
    postsCount: Number(raw.postsCount || 14),
    reelsCount: Number(raw.reelsCount || 4),
    storiesCount: Number(raw.storiesCount || 12),
    currency: (raw.currency || 'HNL') as any,
    price: Number(raw.price || 8500),
    startDate: raw.startDate || '',
    duration: raw.duration || '3 meses',
    firstMonthTerms: raw.firstMonthTerms || '50% de anticipo y 50% al finalizar',
    recurringDay: raw.recurringDay || 'cada día 15',
    revisions: raw.revisions || 'hasta 2 rondas de correcciones',
    customNotes: raw.customNotes || '',
    status: (raw.status || 'active') as any,
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export function normalizePayment(raw: any): Payment {
  return {
    id: raw.id || Date.now(),
    receiptFolio: raw.receiptFolio || `REC-${Date.now().toString().slice(-4)}`,
    clientId: raw.clientId ? Number(raw.clientId) : undefined,
    clientName: raw.clientName || '',
    brandName: raw.brandName || '',
    month: Number(raw.month || new Date().getMonth() + 1),
    year: Number(raw.year || new Date().getFullYear()),
    paidDate: raw.paidDate || new Date().toISOString().split('T')[0],
    currency: (raw.currency || 'HNL') as any,
    amount: Number(raw.amount || 0),
    method: raw.method || 'Transferencia',
    status: (raw.status || 'paid') as any,
    reference: raw.reference || '',
    description: raw.description || '',
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export function normalizePost(raw: any): CalendarPost {
  return {
    id: raw.id || Date.now(),
    clientId: raw.clientId ? Number(raw.clientId) : undefined,
    clientName: raw.clientName || 'Cliente',
    brandColor: raw.brandColor || '#ff7a00',
    title: raw.title || '',
    postType: (raw.postType || 'post') as any,
    status: (raw.status || 'idea') as any,
    scheduledDate: raw.scheduledDate || new Date().toISOString().split('T')[0],
    notes: raw.notes || '',
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export const GoogleSheetsService = {
  isConfigured(): boolean {
    return Boolean(GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.includes('/exec'));
  },

  async checkHealth(): Promise<boolean> {
    if (!this.isConfigured()) return false;
    try {
      const res = await fetch(`${GOOGLE_SHEETS_URL}?action=all`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) return false;
      const json = await res.json();
      return json && json.success === true;
    } catch {
      return false;
    }
  },

  async getAllData(): Promise<{
    clients: Client[];
    contracts: Contract[];
    payments: Payment[];
    posts: CalendarPost[];
  } | null> {
    if (!this.isConfigured()) return null;
    try {
      const res = await fetch(`${GOOGLE_SHEETS_URL}?action=all`, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      const json = await res.json();
      if (json && json.success && json.data) {
        const rawClientes = json.data.clientes || [];
        const rawContratos = json.data.contratos || [];
        const rawPagos = json.data.pagos || [];
        const rawPosts = json.data.calendario_posts || [];

        return {
          clients: rawClientes.map(normalizeClient),
          contracts: rawContratos.map(normalizeContract),
          payments: rawPagos.map(normalizePayment),
          posts: rawPosts.map(normalizePost),
        };
      }
      return null;
    } catch (e) {
      console.error('Error al consultar Google Sheets:', e);
      return null;
    }
  },

  async postAction(payload: Record<string, any>): Promise<ApiResponse<any>> {
    if (!this.isConfigured()) {
      return { success: false, message: 'Google Sheets no configurado' };
    }
    try {
      // Usar POST simple sin encabezado application/json para evitar CORS preflight con Google Apps Script
      const res = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000)
      });
      const data = await res.json();
      return {
        success: data.success ?? true,
        message: data.message || 'Operación completada en Google Sheets',
        data: data.data || data
      };
    } catch (err: any) {
      console.error('Error en postAction Google Sheets:', err);
      return {
        success: false,
        message: err.message || 'Error de conexión con Google Sheets'
      };
    }
  },

  // Operaciones específicas para Clientes
  async createClient(client: Partial<Client>): Promise<ApiResponse<Client>> {
    const data = denormalizeClient(client);
    const res = await this.postAction({ action: 'create', sheet: 'Clientes', data });
    return {
      success: res.success,
      message: res.message,
      data: res.data ? normalizeClient(res.data) : undefined
    };
  },

  async updateClient(id: number | string, client: Partial<Client>): Promise<ApiResponse<Client>> {
    const data = denormalizeClient(client);
    const res = await this.postAction({ action: 'update', sheet: 'Clientes', id, data });
    return {
      success: res.success,
      message: res.message,
      data: client as Client
    };
  },

  async deleteClient(id: number | string): Promise<boolean> {
    const res = await this.postAction({ action: 'delete', sheet: 'Clientes', id });
    return res.success;
  },

  // Operaciones específicas para Contratos
  async createContract(contract: Partial<Contract>): Promise<ApiResponse<Contract>> {
    const res = await this.postAction({ action: 'create', sheet: 'Contratos', data: contract });
    return {
      success: res.success,
      message: res.message,
      data: res.data ? normalizeContract(res.data) : undefined
    };
  },

  async updateContract(id: number | string, contract: Partial<Contract>): Promise<ApiResponse<Contract>> {
    const res = await this.postAction({ action: 'update', sheet: 'Contratos', id, data: contract });
    return {
      success: res.success,
      message: res.message,
      data: contract as Contract
    };
  },

  async deleteContract(id: number | string): Promise<boolean> {
    const res = await this.postAction({ action: 'delete', sheet: 'Contratos', id });
    return res.success;
  },

  // Operaciones específicas para Pagos
  async createPayment(payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    const res = await this.postAction({ action: 'create', sheet: 'Pagos', data: payment });
    return {
      success: res.success,
      message: res.message,
      data: res.data ? normalizePayment(res.data) : undefined
    };
  },

  async updatePayment(id: number | string, payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    const res = await this.postAction({ action: 'update', sheet: 'Pagos', id, data: payment });
    return {
      success: res.success,
      message: res.message,
      data: payment as Payment
    };
  },

  async deletePayment(id: number | string): Promise<boolean> {
    const res = await this.postAction({ action: 'delete', sheet: 'Pagos', id });
    return res.success;
  },

  // Operaciones específicas para Calendario
  async createPost(post: Partial<CalendarPost>): Promise<ApiResponse<CalendarPost>> {
    const res = await this.postAction({ action: 'create', sheet: 'Calendario_Posts', data: post });
    return {
      success: res.success,
      message: res.message,
      data: res.data ? normalizePost(res.data) : undefined
    };
  },

  async updatePost(id: number | string, post: Partial<CalendarPost>): Promise<ApiResponse<CalendarPost>> {
    const res = await this.postAction({ action: 'update', sheet: 'Calendario_Posts', id, data: post });
    return {
      success: res.success,
      message: res.message,
      data: post as CalendarPost
    };
  },

  async deletePost(id: number | string): Promise<boolean> {
    const res = await this.postAction({ action: 'delete', sheet: 'Calendario_Posts', id });
    return res.success;
  },

  // Sincronización masiva de subida a Google Sheets
  async syncAllToSheets(data: {
    clients: Client[];
    contracts: Contract[];
    payments: Payment[];
    posts: CalendarPost[];
  }): Promise<boolean> {
    try {
      const p1 = this.postAction({
        action: 'batch_sync',
        sheet: 'Clientes',
        items: data.clients.map(denormalizeClient)
      });
      const p2 = this.postAction({
        action: 'batch_sync',
        sheet: 'Contratos',
        items: data.contracts
      });
      const p3 = this.postAction({
        action: 'batch_sync',
        sheet: 'Pagos',
        items: data.payments
      });
      const p4 = this.postAction({
        action: 'batch_sync',
        sheet: 'Calendario_Posts',
        items: data.posts
      });

      const results = await Promise.all([p1, p2, p3, p4]);
      return results.every(r => r.success);
    } catch (e) {
      console.error('Error en syncAllToSheets:', e);
      return false;
    }
  }
};
