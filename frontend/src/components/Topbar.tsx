import React from 'react';
import { ViewType } from '../types';
import { Plus, Server, Database, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface TopbarProps {
  currentView: ViewType;
  isBackendOnline: boolean;
  isSheetsOnline: boolean;
  isSyncing?: boolean;
  onSyncSheets?: () => void;
  onNewClient: () => void;
  onNewPayment: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentView,
  isBackendOnline,
  isSheetsOnline,
  isSyncing,
  onSyncSheets,
  onNewClient,
  onNewPayment,
}) => {
  const titles: Record<ViewType, string> = {
    dashboard: 'Panel General & KPIs',
    clients: 'Directorio de Clientes & Marcas',
    calendar: 'Calendario Mensual de Entregables',
    contracts: 'Acuerdos de Servicios & Contratos',
    accounting: 'Control Financiero & Cobranzas',
    settings: 'Configuración del Sistema',
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="view-title">{titles[currentView]}</h1>
      </div>

      <div className="topbar-right">
        {/* Indicador de Google Sheets */}
        <div
          className={`status-pill ${isSheetsOnline ? 'online' : ''}`}
          title={isSheetsOnline ? 'Google Sheets Conectado en la Nube' : 'Google Sheets Desconectado'}
        >
          <FileSpreadsheet size={14} color={isSheetsOnline ? '#4ade80' : '#94a3b8'} />
          <span>Google Sheets {isSheetsOnline ? '🟢' : '⚪'}</span>
        </div>

        {/* Indicador de Backend C# */}
        <div className={`status-pill ${isBackendOnline ? 'online' : ''}`}>
          {isBackendOnline ? (
            <>
              <Server size={14} color="#4ade80" />
              <span>Backend C# 🟢</span>
            </>
          ) : (
            <>
              <Database size={14} color="#38bdf8" />
              <span>Caché Local 💾</span>
            </>
          )}
        </div>

        {/* Botón Sincronizar Nube */}
        {onSyncSheets && (
          <button
            className="btn-secondary sync-btn"
            onClick={onSyncSheets}
            disabled={isSyncing}
            title="Sincronizar datos con Google Sheets"
          >
            <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>
        )}

        <button className="btn-secondary" onClick={onNewPayment}>
          <Plus size={15} />
          <span>Registrar Pago</span>
        </button>

        <button className="btn-primary" onClick={onNewClient}>
          <Plus size={15} />
          <span>Nuevo Cliente</span>
        </button>
      </div>
    </header>
  );
};

