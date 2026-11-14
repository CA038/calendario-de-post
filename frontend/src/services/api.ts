import { ApiResponse, Client, Contract, Payment, CalendarPost, AccountingSummary } from '../types';
import { GoogleSheetsService, normalizeClient, denormalizeClient, normalizeContract, normalizePayment, normalizePost } from './googleSheetsService';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5290/api';

// Estado de conexión
let isBackendOnline = false;
let isGoogleSheetsOnline = false;

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2000)
    });
    isBackendOnline = res.ok;
  } catch {
    isBackendOnline = false;
  }

  // Verificar también estado de Google Sheets
  try {
    isGoogleSheetsOnline = await GoogleSheetsService.checkHealth();
  } catch {
    isGoogleSheetsOnline = false;
  }

  return isBackendOnline;
};

export const getBackendStatus = () => isBackendOnline;
export const getGoogleSheetsStatus = () => isGoogleSheetsOnline;

// Helpers de almacenamiento local para caché instantáneo
const getStored = (key: string): any[] => {
  try {
    const item = localStorage.getItem(`local_adriancrea_${key}`);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

const saveStored = (key: string, items: any[]) => {
  try {
    localStorage.setItem(`local_adriancrea_${key}`, JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save limit reached:', e);
  }
};

// Cliente API universal: Backend C# -> Google Sheets Nube -> LocalStorage Cache
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  // 1. Intentar Backend C# si está en ejecución
  if (isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        signal: AbortSignal.timeout(10000)
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json) {
        return json as ApiResponse<T>;
      }
    } catch {
      isBackendOnline = false;
    }
  }

  // 2. Operaciones con Google Sheets / LocalStorage
  return handleSheetsAndLocal<T>(endpoint, options);
}

async function handleSheetsAndLocal<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : undefined;
  const parts = endpoint.split('?')[0].split('/').filter(Boolean);
  const resource = parts[0]; // clients, contracts, payments, calendarposts, accounting
  const id = parts[1];

  // Cálculo de Resumen Contable (Accounting Summary)
  if (resource === 'accounting') {
    const clients: Client[] = getStored('clients');
    const payments: Payment[] = getStored('payments');

    const totalProjected = clients
      .filter(c => c.isActive)
      .reduce((sum, c) => sum + (Number(c.monthlyPrice) || 0), 0);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const monthlyPayments = payments.filter(p => Number(p.month) === currentMonth && Number(p.year) === currentYear);
    const totalCollected = monthlyPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const pendingAmount = Math.max(0, totalProjected - totalCollected);

    const summary: AccountingSummary = {
      month: currentMonth,
      year: currentYear,
      totalProjected,
      totalCollected,
      pendingAmount,
      totalClientsActive: clients.filter(c => c.isActive).length,
      payments: monthlyPayments
    };

    return {
      success: true,
      message: 'Resumen contable calculado',
      data: summary as unknown as T
    };
  }

  // Map de recurso a pestaña de Google Sheets
  const sheetMap: Record<string, string> = {
    clients: 'Clientes',
    contracts: 'Contratos',
    payments: 'Pagos',
    calendarposts: 'Calendario_Posts'
  };
  const sheetName = sheetMap[resource];

  // ===================== GET =====================
  if (method === 'GET') {
    const cached = getStored(resource);

    // Intentar refrescar desde Google Sheets si está disponible
    if (sheetName && GoogleSheetsService.isConfigured()) {
      GoogleSheetsService.getAllData().then(data => {
        if (data) {
          isGoogleSheetsOnline = true;
          saveStored('clients', data.clients);
          saveStored('contracts', data.contracts);
          saveStored('payments', data.payments);
          saveStored('calendarposts', data.posts);
        }
      }).catch(() => {
        isGoogleSheetsOnline = false;
      });
    }

    return {
      success: true,
      message: 'Datos cargados',
      data: cached as unknown as T
    };
  }

  // ===================== POST =====================
  if (method === 'POST') {
    const items = getStored(resource);
    const newItem = {
      id: body?.id || Date.now(),
      ...body,
      createdAt: new Date().toISOString()
    };
    items.unshift(newItem);
    saveStored(resource, items);

    // Guardar en Google Sheets de fondo
    if (sheetName) {
      if (resource === 'clients') {
        GoogleSheetsService.createClient(newItem).catch(e => console.error(e));
      } else if (resource === 'contracts') {
        GoogleSheetsService.createContract(newItem).catch(e => console.error(e));
      } else if (resource === 'payments') {
        GoogleSheetsService.createPayment(newItem).catch(e => console.error(e));
      } else if (resource === 'calendarposts') {
        GoogleSheetsService.createPost(newItem).catch(e => console.error(e));
      }
    }

    return {
      success: true,
      message: 'Registro guardado exitosamente en Google Sheets y local',
      data: newItem as unknown as T
    };
  }

  // ===================== PUT =====================
  if (method === 'PUT') {
    const items = getStored(resource);
    const idx = items.findIndex((i: any) => String(i.id) === String(id));
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...body, updatedAt: new Date().toISOString() };
      saveStored(resource, items);

      if (sheetName) {
        if (resource === 'clients') {
          GoogleSheetsService.updateClient(id, items[idx]).catch(e => console.error(e));
        } else if (resource === 'contracts') {
          GoogleSheetsService.updateContract(id, items[idx]).catch(e => console.error(e));
        } else if (resource === 'payments') {
          GoogleSheetsService.updatePayment(id, items[idx]).catch(e => console.error(e));
        } else if (resource === 'calendarposts') {
          GoogleSheetsService.updatePost(id, items[idx]).catch(e => console.error(e));
        }
      }

      return {
        success: true,
        message: 'Registro actualizado en Google Sheets y local',
        data: items[idx] as unknown as T
      };
    }
    return { success: false, message: 'Elemento no encontrado' };
  }

  // ===================== DELETE =====================
  if (method === 'DELETE') {
    const items = getStored(resource);
    const filtered = items.filter((i: any) => String(i.id) !== String(id));
    saveStored(resource, filtered);

    if (sheetName) {
      if (resource === 'clients') {
        GoogleSheetsService.deleteClient(id).catch(e => console.error(e));
      } else if (resource === 'contracts') {
        GoogleSheetsService.deleteContract(id).catch(e => console.error(e));
      } else if (resource === 'payments') {
        GoogleSheetsService.deletePayment(id).catch(e => console.error(e));
      } else if (resource === 'calendarposts') {
        GoogleSheetsService.deletePost(id).catch(e => console.error(e));
      }
    }

    return {
      success: true,
      message: 'Registro eliminado en Google Sheets y local',
      data: true as unknown as T
    };
  }

  return { success: false, message: 'Operación no compatible' };
}
