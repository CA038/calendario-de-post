import React from 'react';
import { Client, Payment, AccountingSummary } from '../types';
import { DollarSign, Users, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';

interface DashboardViewProps {
  clients: Client[];
  payments: Payment[];
  accounting: AccountingSummary | null;
  onNavigate: (view: any) => void;
  onNewPayment: () => void;
  onNewClient: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clients,
  payments,
  accounting,
  onNavigate,
  onNewPayment,
  onNewClient,
}) => {
  const activeClients = clients.filter((c) => c.isActive && c.category !== 'inactive' && c.category !== 'lead');
  const totalProjected = accounting?.totalProjected ?? activeClients.reduce((acc, c) => acc + (c.monthlyPrice || 0), 0);
  const totalCollected = accounting?.totalCollected ?? payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + (p.amount || 0), 0);
  const pendingAmount = Math.max(0, totalProjected - totalCollected);

  return (
    <div className="content-area">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Proyección Mensual</div>
          <div className="kpi-value" style={{ color: '#f8fafc' }}>
            L. {totalProjected.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            Facturación esperada ({activeClients.length} cuentas activas)
          </div>
        </div>

        <div className="kpi-card" style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <div className="kpi-label" style={{ color: '#4ade80' }}>Total Recaudado</div>
          <div className="kpi-value" style={{ color: '#4ade80' }}>
            L. {totalCollected.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            Pagos conciliados y cancelados
          </div>
        </div>

        <div className="kpi-card" style={{ borderColor: pendingAmount > 0 ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-color)' }}>
          <div className="kpi-label" style={{ color: '#f59e0b' }}>Pendiente por Cobrar</div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>
            L. {pendingAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            {pendingAmount === 0 ? '¡Al día! Todo recaudado' : 'Cobranzas en proceso'}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Cuentas Activas</div>
          <div className="kpi-value" style={{ color: '#ff7a00' }}>
            {activeClients.length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            Total en cartera: {clients.length} contactos
          </div>
        </div>
      </div>

      {/* Grid de Tablas Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Pagos Recientes */}
        <div className="table-card">
          <div className="table-header-bar">
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>Últimos Pagos Registrados</h3>
            <button className="btn-secondary" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => onNavigate('accounting')}>
              Ver Todos
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Folio</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, color: '#f8fafc' }}>{p.clientName}</td>
                  <td>{p.paidDate}</td>
                  <td style={{ fontWeight: 800, color: '#4ade80' }}>L. {(p.amount ?? 0).toLocaleString()}</td>
                  <td style={{ color: '#ea580c', fontWeight: 600 }}>{p.receiptFolio}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No hay pagos registrados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Resumen de Clientes */}
        <div className="table-card">
          <div className="table-header-bar">
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>Clientes con Entregables Activos</h3>
            <button className="btn-secondary" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => onNavigate('clients')}>
              Directorio Completo
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Plan</th>
                <th>Entregables</th>
                <th>Mensualidad</th>
              </tr>
            </thead>
            <tbody>
              {activeClients.slice(0, 5).map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {c.logoUrl ? (
                        <img
                          src={c.logoUrl}
                          alt=""
                          style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'contain', background: '#1e293b', border: '1px solid #334155' }}
                        />
                      ) : (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.brandColor || '#ff7a00' }} />
                      )}
                      <span>{c.brandName || c.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-orange">{c.planName}</span></td>
                  <td>{c.monthlyPostsLimit}P + {c.monthlyReelsLimit}R</td>
                  <td style={{ fontWeight: 800 }}>L. {(c.monthlyPrice ?? 0).toLocaleString()}</td>
                </tr>
              ))}
              {activeClients.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No hay clientes activos en cartera.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
