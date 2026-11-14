import React, { useState } from 'react';
import { Client, Payment, AccountingSummary } from '../types';
import { PdfService, MONTH_NAMES } from '../services/pdfService';
import { Plus, FileDown, Search, Filter, Pencil, Trash2 } from 'lucide-react';

interface AccountingViewProps {
  clients: Client[];
  payments: Payment[];
  accounting: AccountingSummary | null;
  onNewPayment: () => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (id: number | string) => Promise<void>;
}

export const AccountingView: React.FC<AccountingViewProps> = ({
  clients,
  payments,
  accounting,
  onNewPayment,
  onEditPayment,
  onDeletePayment,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [search, setSearch] = useState<string>('');

  const activeClients = clients.filter(c => c.isActive && c.category !== 'inactive' && c.category !== 'lead');
  let projected = activeClients.reduce((acc, c) => acc + (c.monthlyPrice || 0), 0);

  const filteredPayments = payments.filter((p) => {
    const matchMonth = Number(p.month) === selectedMonth && Number(p.year) === selectedYear;
    if (!matchMonth) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.clientName.toLowerCase().includes(q) || (p.brandName || '').toLowerCase().includes(q) || p.receiptFolio.toLowerCase().includes(q);
    }
    return true;
  });

  const collected = filteredPayments.filter(p => p.status === 'paid').reduce((acc, p) => acc + (p.amount || 0), 0);
  const pending = Math.max(0, projected - collected);
  const collectionRate = projected > 0 ? Math.round((collected / projected) * 100) : 100;

  return (
    <div className="content-area">
      {/* Controles del Periodo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{ width: '160px' }}
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={idx} value={idx}>{m}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ width: '100px' }}
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', width: '100%' }}
              placeholder="Buscar pago, folio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={onNewPayment}>
            <Plus size={15} />
            <span>Registrar Pago</span>
          </button>
        </div>
      </div>

      {/* KPI Cards de Finanzas */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Proyectado de {MONTH_NAMES[selectedMonth]}</div>
          <div className="kpi-value">L. {projected.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>{activeClients.length} cuentas activas</div>
        </div>

        <div className="kpi-card" style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <div className="kpi-label" style={{ color: '#4ade80' }}>Total Recaudado</div>
          <div className="kpi-value" style={{ color: '#4ade80' }}>L. {collected.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Tasa de cobranza: {collectionRate}%</div>
        </div>

        <div className="kpi-card" style={{ borderColor: pending > 0 ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-color)' }}>
          <div className="kpi-label" style={{ color: '#f59e0b' }}>Pendiente por Cobrar</div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>L. {pending.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            {pending === 0 ? '¡100% Cobrado!' : 'Cuentas con saldo pendiente'}
          </div>
        </div>
      </div>

      {/* Tabla de Pagos */}
      <div className="table-card">
        <div className="table-header-bar">
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
            Transacciones Registradas de {MONTH_NAMES[selectedMonth]} {selectedYear}
          </h3>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            {filteredPayments.length} comprobantes emitidos
          </span>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Cliente / Negocio</th>
              <th>Fecha de Pago</th>
              <th>Método</th>
              <th>Folio Recibo</th>
              <th>Monto Cancelado</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => {
              const client = clients.find(c => String(c.id) === String(p.clientId));
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#f8fafc' }}>{p.clientName}</div>
                    <div style={{ fontSize: '11px', color: '#ea580c' }}>{p.brandName || client?.brandName || '-'}</div>
                  </td>
                  <td>{p.paidDate}</td>
                  <td>{p.method}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#ea580c', background: 'rgba(255, 122, 0, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                      {p.receiptFolio}
                    </span>
                  </td>
                  <td style={{ fontWeight: 900, color: '#4ade80', fontSize: '13.5px' }}>
                    {p.currency === 'USD' ? '$' : 'L. '}{(p.amount ?? 0).toLocaleString()}
                  </td>
                  <td>
                    <span className="badge badge-paid">PAGADO</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '5px 10px', color: '#ff7a00', borderColor: 'rgba(255, 122, 0, 0.3)' }}
                        onClick={() => PdfService.generatePaymentReceipt(p, client)}
                        title="Descargar Comprobante Oficial en PDF"
                      >
                        <FileDown size={13} />
                        <span>Recibo PDF</span>
                      </button>

                      <button
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '5px 9px', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
                        onClick={() => onEditPayment(p)}
                        title="Editar registro de pago"
                      >
                        <Pencil size={13} />
                        <span>Editar</span>
                      </button>

                      <button
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '5px 9px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        onClick={() => {
                          if (window.confirm(`¿Estás seguro de eliminar el comprobante ${p.receiptFolio} de ${p.clientName}? Se borrará también de Google Sheets.`)) {
                            onDeletePayment(p.id);
                          }
                        }}
                        title="Eliminar este comprobante"
                      >
                        <Trash2 size={13} />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No se registran pagos en {MONTH_NAMES[selectedMonth]} {selectedYear}. Haz clic en "Registrar Pago" para añadir uno.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
