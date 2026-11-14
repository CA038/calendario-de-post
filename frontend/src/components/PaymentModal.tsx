import React, { useState, useEffect } from 'react';
import { Client, Payment } from '../types';
import { X, CheckCircle, FileText } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  clients: Client[];
  initialData?: Payment | null;
  onClose: () => void;
  onSave: (paymentData: Partial<Payment>, generatePdf: boolean) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  clients,
  initialData,
  onClose,
  onSave,
}) => {
  const [clientId, setClientId] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('');
  const [amount, setAmount] = useState<number>(8500);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year] = useState<number>(new Date().getFullYear());
  const [method, setMethod] = useState<string>('Transferencia');
  const [reference, setReference] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [generatePdf, setGeneratePdf] = useState<boolean>(true);

  useEffect(() => {
    if (initialData) {
      setClientId(initialData.clientId ? String(initialData.clientId) : '');
      setClientName(initialData.clientName || '');
      setBrandName(initialData.brandName || '');
      setAmount(initialData.amount || 8500);
      setMonth(initialData.month !== undefined ? Number(initialData.month) : new Date().getMonth());
      setMethod(initialData.method || 'Transferencia Bancaria');
      setReference(initialData.reference || '');
      setDescription(initialData.description || '');
      setGeneratePdf(false);
    } else {
      setClientId('');
      setClientName('');
      setBrandName('');
      setAmount(8500);
      setMonth(new Date().getMonth());
      setMethod('Transferencia');
      setReference('');
      setDescription('');
      setGeneratePdf(true);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleClientSelect = (id: string) => {
    setClientId(id);
    const client = clients.find((c) => String(c.id) === id);
    if (client) {
      setClientName(client.name);
      setBrandName(client.brandName || client.name);
      setAmount(client.monthlyPrice || 8500);
      setDescription(`Servicio Profesional de Marketing Digital & Creación de Contenido`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    await onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      ...(initialData?.receiptFolio ? { receiptFolio: initialData.receiptFolio } : {}),
      clientId: clientId ? Number(clientId) : null,
      clientName,
      brandName,
      amount,
      month,
      year,
      method,
      reference,
      description,
      status: 'paid',
      paidDate: initialData?.paidDate || new Date().toISOString().split('T')[0]
    }, generatePdf);

    onClose();
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? `Editar Registro de Pago (${initialData.receiptFolio || 'Comprobante'})` : 'Registrar Pago / Emitir Recibo Oficial'}
          </h3>
          <button onClick={onClose}><X size={18} color="#94a3b8" /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Seleccionar Cliente</label>
              <select
                className="form-select"
                value={clientId}
                onChange={(e) => handleClientSelect(e.target.value)}
              >
                <option value="">-- Selecciona un Cliente Registrado --</option>
                {clients.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name} {c.brandName ? `(${c.brandName})` : ''} - L. {(c.monthlyPrice ?? 0).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Marca o Negocio</label>
                <input
                  type="text"
                  className="form-input"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Monto Cancelado (HNL)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Periodo / Mes</label>
                <select
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {months.map((m, idx) => (
                    <option key={idx} value={idx}>{m} {year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Método de Pago</label>
                <select
                  className="form-select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta de Débito/Crédito">Tarjeta de Débito/Crédito</option>
                  <option value="Depósito en Cuenta">Depósito en Cuenta</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">No. de Referencia / Comprobante</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. TRANSF-88492"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción del Concepto</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Servicio Profesional de Marketing..."
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#cbd5e1' }}>
              <input
                type="checkbox"
                checked={generatePdf}
                onChange={(e) => setGeneratePdf(e.target.checked)}
              />
              <span>Descargar Recibo Oficial en PDF automáticamente al guardar</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">
              {generatePdf ? <FileText size={15} /> : <CheckCircle size={15} />}
              <span>
                {initialData
                  ? (generatePdf ? 'Guardar Cambios y Descargar PDF' : 'Guardar Cambios')
                  : (generatePdf ? 'Guardar y Generar Recibo PDF' : 'Guardar Pago')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
