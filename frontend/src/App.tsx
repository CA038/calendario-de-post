import React, { useState, useEffect } from 'react';
import { ViewType, Client, Contract, Payment, AccountingSummary, CalendarPost, ToastNotification } from './types';
import { ClientService } from './services/clientService';
import { ContractService } from './services/contractService';
import { PaymentService } from './services/paymentService';
import { CalendarService } from './services/calendarService';
import { PdfService } from './services/pdfService';
import { checkBackendHealth, getGoogleSheetsStatus } from './services/api';
import { GoogleSheetsService } from './services/googleSheetsService';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Toast } from './components/Toast';
import { ClientModal } from './components/ClientModal';
import { PaymentModal } from './components/PaymentModal';
import { CalendarPostModal } from './components/CalendarPostModal';
import { DashboardView } from './views/DashboardView';
import { ClientsView } from './views/ClientsView';
import { CalendarView } from './views/CalendarView';
import { ContractsView } from './views/ContractsView';
import { AccountingView } from './views/AccountingView';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [accounting, setAccounting] = useState<AccountingSummary | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [isSheetsOnline, setIsSheetsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modales state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CalendarPost | null>(null);
  const [initialPostDate, setInitialPostDate] = useState<string | undefined>();
  const [preselectedContractClient, setPreselectedContractClient] = useState<Client | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const loadData = async () => {
    try {
      const online = await checkBackendHealth();
      setIsBackendOnline(online);
      const sheetsOk = getGoogleSheetsStatus() || GoogleSheetsService.isConfigured();
      setIsSheetsOnline(sheetsOk);

      // Si Google Sheets está conectado y el backend local no está online, cargar directamente de Sheets
      if (!online && GoogleSheetsService.isConfigured()) {
        const sheetsData = await GoogleSheetsService.getAllData();
        if (sheetsData) {
          setClients(sheetsData.clients);
          setContracts(sheetsData.contracts);
          setPayments(sheetsData.payments);
          setPosts(sheetsData.posts);
          const acc = await PaymentService.getAccountingSummary();
          setAccounting(acc);
          setIsSheetsOnline(true);
          return;
        }
      }

      const [cls, cts, pms, pts, acc] = await Promise.all([
        ClientService.getAll(),
        ContractService.getAll(),
        PaymentService.getAll(),
        CalendarService.getAll(),
        PaymentService.getAccountingSummary()
      ]);

      setClients(cls);
      setContracts(cts);
      setPayments(pms);
      setPosts(pts);
      setAccounting(acc);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      showToast('Error al sincronizar con el servidor', 'error');
    }
  };

  const handleSyncSheets = async () => {
    setIsSyncing(true);
    try {
      const sheetsData = await GoogleSheetsService.getAllData();
      if (sheetsData) {
        setClients(sheetsData.clients);
        setContracts(sheetsData.contracts);
        setPayments(sheetsData.payments);
        setPosts(sheetsData.posts);
        const acc = await PaymentService.getAccountingSummary();
        setAccounting(acc);
        setIsSheetsOnline(true);
        showToast('¡Datos sincronizados con Google Sheets! ☁️', 'success');
      } else {
        showToast('No se pudo conectar con Google Sheets', 'error');
      }
    } catch (e: any) {
      showToast(`Error de sincronización: ${e.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handlers para Clientes
  const handleSaveClient = async (clientData: Partial<Client>): Promise<boolean> => {
    try {
      if (editingClient) {
        const res = await ClientService.update(editingClient.id, clientData);
        if (res.success) {
          showToast('Cliente actualizado exitosamente', 'success');
          await loadData();
          setEditingClient(null);
          setIsClientModalOpen(false);
          return true;
        } else {
          showToast(res.message || 'Error al actualizar el cliente', 'error');
          return false;
        }
      } else {
        const res = await ClientService.create(clientData);
        if (res.success) {
          showToast('Cliente registrado exitosamente', 'success');
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
          await loadData();
          setIsClientModalOpen(false);
          return true;
        } else {
          showToast(res.message || 'Error al registrar el cliente', 'error');
          return false;
        }
      }
    } catch (e: any) {
      showToast(`Error al guardar cliente: ${e.message}`, 'error');
      return false;
    }
  };

  const handleDeleteClient = async (id: number | string) => {
    try {
      const ok = await ClientService.delete(id);
      if (ok) {
        showToast('Cliente eliminado', 'info');
        await loadData();
      }
    } catch (e: any) {
      showToast(`Error al eliminar: ${e.message}`, 'error');
    }
  };

  // Handlers para Pagos
  const handleSavePayment = async (paymentData: Partial<Payment>, generatePdf: boolean) => {
    try {
      if (editingPayment) {
        const res = await PaymentService.update(editingPayment.id, paymentData);
        if (res.success) {
          showToast('¡Pago actualizado exitosamente!', 'success');
          if (generatePdf && res.data) {
            const client = clients.find(c => String(c.id) === String(res.data?.clientId));
            await PdfService.generatePaymentReceipt(res.data, client);
          }
          await loadData();
          setEditingPayment(null);
          setIsPaymentModalOpen(false);
        } else {
          showToast(res.message || 'Error al actualizar pago', 'error');
        }
      } else {
        const res = await PaymentService.create(paymentData);
        if (res.success) {
          showToast('¡Pago registrado con éxito en Google Sheets!', 'success');
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });

          if (generatePdf && res.data) {
            const client = clients.find(c => String(c.id) === String(res.data?.clientId));
            await PdfService.generatePaymentReceipt(res.data, client);
          }
          await loadData();
          setIsPaymentModalOpen(false);
        } else {
          showToast(res.message || 'Error al registrar pago', 'error');
        }
      }
    } catch (e: any) {
      showToast(`Error al procesar pago: ${e.message}`, 'error');
    }
  };

  const handleDeletePayment = async (id: number | string) => {
    try {
      const ok = await PaymentService.delete(id);
      if (ok) {
        showToast('Pago eliminado de Google Sheets y del registro', 'info');
        await loadData();
      } else {
        showToast('No se pudo eliminar el pago', 'error');
      }
    } catch (e: any) {
      showToast(`Error al eliminar pago: ${e.message}`, 'error');
    }
  };

  // Handlers para Contratos
  const handleSaveContract = async (contractData: Partial<Contract>) => {
    try {
      const res = await ContractService.create(contractData);
      if (res.success) {
        showToast('¡Acuerdo guardado exitosamente!', 'success');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.75 } });
        await loadData();
      }
    } catch (e: any) {
      showToast(`Error al guardar contrato: ${e.message}`, 'error');
    }
  };

  // Handlers para Publicaciones del Calendario
  const handleOpenNewPost = (date?: string) => {
    setEditingPost(null);
    setInitialPostDate(date);
    setIsPostModalOpen(true);
  };

  const handleOpenEditPost = (post: CalendarPost) => {
    setEditingPost(post);
    setIsPostModalOpen(true);
  };

  const handleSavePost = async (postData: Partial<CalendarPost>) => {
    try {
      if (editingPost) {
        const res = await CalendarService.update(editingPost.id, postData);
        if (res.success) {
          showToast('Publicación actualizada en calendario', 'success');
        }
      } else {
        const res = await CalendarService.create(postData);
        if (res.success) {
          showToast('¡Publicación programada exitosamente!', 'success');
        }
      }
      await loadData();
      setIsPostModalOpen(false);
      setEditingPost(null);
    } catch (e: any) {
      showToast(`Error al guardar publicación: ${e.message}`, 'error');
    }
  };

  const handleDeletePost = async (id: number | string) => {
    try {
      await CalendarService.delete(id);
      showToast('Publicación eliminada del calendario', 'info');
      await loadData();
      setIsPostModalOpen(false);
      setEditingPost(null);
    } catch (e: any) {
      showToast(`Error al eliminar: ${e.message}`, 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Barra Lateral Izquierda */}
      <Sidebar currentView={currentView} onSelectView={setCurrentView} />

      {/* Área Principal */}
      <div className="main-wrapper">
        {/* Barra Superior */}
        <Topbar
          currentView={currentView}
          isBackendOnline={isBackendOnline}
          isSheetsOnline={isSheetsOnline}
          isSyncing={isSyncing}
          onSyncSheets={handleSyncSheets}
          onNewClient={() => { setEditingClient(null); setIsClientModalOpen(true); }}
          onNewPayment={() => { setEditingPayment(null); setIsPaymentModalOpen(true); }}
        />

        {/* Vistas Dinámicas */}
        {currentView === 'dashboard' && (
          <DashboardView
            clients={clients}
            payments={payments}
            accounting={accounting}
            onNavigate={setCurrentView}
            onNewClient={() => { setEditingClient(null); setIsClientModalOpen(true); }}
            onNewPayment={() => { setEditingPayment(null); setIsPaymentModalOpen(true); }}
          />
        )}

        {currentView === 'clients' && (
          <ClientsView
            clients={clients}
            onNewClient={() => { setEditingClient(null); setIsClientModalOpen(true); }}
            onEditClient={(client) => { setEditingClient(client); setIsClientModalOpen(true); }}
            onDeleteClient={handleDeleteClient}
            onCreateContractFor={(client) => {
              setPreselectedContractClient(client);
              setCurrentView('contracts');
            }}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            clients={clients}
            posts={posts}
            onNewPost={handleOpenNewPost}
            onEditPost={handleOpenEditPost}
          />
        )}

        {currentView === 'contracts' && (
          <ContractsView
            clients={clients}
            contracts={contracts}
            onSaveContract={handleSaveContract}
            preselectedClient={preselectedContractClient}
          />
        )}

        {currentView === 'accounting' && (
          <AccountingView
            clients={clients}
            payments={payments}
            accounting={accounting}
            onNewPayment={() => { setEditingPayment(null); setIsPaymentModalOpen(true); }}
            onEditPayment={(payment) => { setEditingPayment(payment); setIsPaymentModalOpen(true); }}
            onDeletePayment={handleDeletePayment}
          />
        )}
      </div>

      {/* Modales */}
      <ClientModal
        isOpen={isClientModalOpen}
        editingClient={editingClient}
        onClose={() => { setIsClientModalOpen(false); setEditingClient(null); }}
        onSave={handleSaveClient}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        clients={clients}
        initialData={editingPayment}
        onClose={() => { setIsPaymentModalOpen(false); setEditingPayment(null); }}
        onSave={handleSavePayment}
      />

      <CalendarPostModal
        isOpen={isPostModalOpen}
        clients={clients}
        editingPost={editingPost}
        initialDate={initialPostDate}
        onClose={() => { setIsPostModalOpen(false); setEditingPost(null); }}
        onSave={handleSavePost}
        onDelete={handleDeletePost}
      />

      {/* Notificaciones Toast */}
      <Toast toasts={toasts} />
    </div>
  );
};

export default App;
