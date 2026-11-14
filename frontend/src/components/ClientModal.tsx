import React, { useState, useEffect, useRef } from 'react';
import { Client, ClientCategory } from '../types';
import { X, Save, Upload, Link2, Trash2, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Partial<Client>) => Promise<boolean>;
  editingClient?: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingClient,
}) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    brandName: '',
    category: 'active',
    email: '',
    phone: '',
    planName: 'Plan Crecimiento',
    monthlyPostsLimit: 14,
    monthlyReelsLimit: 4,
    storiesCount: 12,
    currency: 'HNL',
    monthlyPrice: 8500,
    billingDay: 15,
    brandColor: '#ff7a00',
    logoUrl: '',
    notes: '',
  });

  const [logoMode, setLogoMode] = useState<'file' | 'url'>('file');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name || '',
        brandName: editingClient.brandName || '',
        category: editingClient.category || 'active',
        email: editingClient.email || '',
        phone: editingClient.phone || '',
        planName: editingClient.planName || 'Plan Crecimiento',
        monthlyPostsLimit: editingClient.monthlyPostsLimit ?? 14,
        monthlyReelsLimit: editingClient.monthlyReelsLimit ?? 4,
        storiesCount: editingClient.storiesCount ?? 12,
        currency: editingClient.currency || 'HNL',
        monthlyPrice: editingClient.monthlyPrice ?? 8500,
        billingDay: editingClient.billingDay ?? 15,
        brandColor: editingClient.brandColor || '#ff7a00',
        logoUrl: editingClient.logoUrl || '',
        notes: editingClient.notes || '',
      });
      if (editingClient.logoUrl?.startsWith('http')) {
        setLogoMode('url');
      } else {
        setLogoMode('file');
      }
    } else {
      setFormData({
        name: '',
        brandName: '',
        category: 'active',
        email: '',
        phone: '',
        planName: 'Plan Crecimiento',
        monthlyPostsLimit: 14,
        monthlyReelsLimit: 4,
        storiesCount: 12,
        currency: 'HNL',
        monthlyPrice: 8500,
        billingDay: 15,
        brandColor: '#ff7a00',
        logoUrl: '',
        notes: '',
      });
      setLogoMode('file');
    }
    setErrorMessage(null);
    setIsSubmitting(false);
  }, [editingClient, isOpen]);

  if (!isOpen) return null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Redimensionar automáticamente a un máximo de 400x400 para que sea liviano
        const maxDim = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setFormData((prev) => ({ ...prev, logoUrl: canvas.toDataURL('image/png') }));
        } else {
          setFormData((prev) => ({ ...prev, logoUrl: src }));
        }
        setErrorMessage(null);
      };
      img.onerror = () => {
        setFormData((prev) => ({ ...prev, logoUrl: src }));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Evitar que presionar Enter dentro de un input de texto envíe el formulario por accidente
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const clientName = formData.name?.trim();
    if (!clientName) {
      setErrorMessage('El nombre del cliente es obligatorio.');
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanData: Partial<Client> = {
        name: clientName,
        brandName: formData.brandName?.trim() || clientName,
        category: formData.category || 'active',
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || '',
        planName: formData.planName || 'Plan Crecimiento',
        monthlyPostsLimit: Math.max(0, Number(formData.monthlyPostsLimit) || 0),
        monthlyReelsLimit: Math.max(0, Number(formData.monthlyReelsLimit) || 0),
        storiesCount: Math.max(0, Number(formData.storiesCount) || 12),
        currency: formData.currency || 'HNL',
        monthlyPrice: Math.max(0, Number(formData.monthlyPrice) || 0),
        billingDay: Math.min(31, Math.max(1, parseInt(String(formData.billingDay), 10) || 15)),
        brandColor: formData.brandColor || '#ff7a00',
        logoUrl: formData.logoUrl?.trim() || '',
        notes: formData.notes?.trim() || '',
      };

      const success = await onSave(cleanData);
      if (success) {
        onClose();
      } else {
        setErrorMessage('No se pudo guardar el cliente en el servidor. Revisa los datos e intenta nuevamente.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error inesperado al intentar guardar el cliente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* NO cerramos al hacer clic en el fondo overlay para evitar perder datos por clics accidentales */
    <div className="modal-overlay">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingClient ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
          </h3>
          <button type="button" onClick={onClose} title="Cerrar ventana">
            <X size={18} color="#94a3b8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
          <div className="modal-body">
            {/* Mensaje de Error si falla la validación o guardado */}
            {errorMessage && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fca5a5',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, color: '#f87171' }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ej. Sofía Martínez"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Marca o Negocio</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Glow Studio"
                  value={formData.brandName || ''}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                />
              </div>
            </div>

            {/* SECCIÓN DE LOGO: FOTO O ENLACE */}
            <div className="form-group" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} color="#ff7a00" />
                  <span>Logo de la Marca (Foto o Enlace)</span>
                </label>

                {/* Alternador de método: Archivo / Link */}
                <div style={{ display: 'flex', background: '#1e293b', borderRadius: '6px', padding: '2px', gap: '2px' }}>
                  <button
                    type="button"
                    onClick={() => setLogoMode('file')}
                    style={{
                      border: 'none',
                      background: logoMode === 'file' ? 'var(--accent-orange)' : 'transparent',
                      color: logoMode === 'file' ? '#ffffff' : '#94a3b8',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Upload size={12} />
                    <span>Subir Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoMode('url')}
                    style={{
                      border: 'none',
                      background: logoMode === 'url' ? 'var(--accent-orange)' : 'transparent',
                      color: logoMode === 'url' ? '#ffffff' : '#94a3b8',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Link2 size={12} />
                    <span>Pegar Link</span>
                  </button>
                </div>
              </div>

              {formData.logoUrl ? (
                /* Vista previa cuando ya hay un logo asignado */
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b1120', border: '1px solid rgba(255,122,0,0.3)', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img
                        src={formData.logoUrl}
                        alt="Preview Logo"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
                        onError={() => {
                          setFormData({ ...formData, logoUrl: '' });
                          setErrorMessage('No se pudo cargar la imagen del logo. Verifica el link o sube otra foto.');
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>Logo asignado</div>
                      <div style={{ fontSize: '11px', color: '#4ade80' }}>✓ Listo para mostrarse en el CRM y calendario</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {logoMode === 'file' && (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '5px 10px' }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Cambiar foto
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '5px 8px', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      title="Quitar logo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Controles cuando todavía no se ha agregado un logo */
                <div>
                  {logoMode === 'file' ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        style={{ display: 'none' }}
                        onChange={handleImageFile}
                      />
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          padding: '16px',
                          border: '1.5px dashed #334155',
                          borderRadius: '8px',
                          background: 'rgba(15, 23, 42, 0.6)',
                          gap: '8px'
                        }}
                      >
                        <Upload size={16} color="#ff7a00" />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>Haz clic para seleccionar foto de tu Mac (PNG, JPG o WebP)</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://ejemplo.com/logo.png"
                        value={formData.logoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      />
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        Pega la dirección URL directa de la imagen del logo en internet.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Categoría / Estado</label>
                <select
                  className="form-select"
                  value={formData.category || 'active'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ClientCategory })}
                >
                  <option value="active">Activo General</option>
                  <option value="social_media">Social Media Mensual</option>
                  <option value="lead">Prospecto / Lead</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Color de Etiqueta (Opcional)</label>
                <input
                  type="color"
                  className="form-input"
                  style={{ height: '42px', padding: '4px' }}
                  value={formData.brandColor || '#ff7a00'}
                  onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+504 9999-9999"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="cliente@ejemplo.hn"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="form-group">
                <label className="form-label">Posts Mensuales</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.monthlyPostsLimit ?? 14}
                  onChange={(e) => setFormData({ ...formData, monthlyPostsLimit: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reels / Videos</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.monthlyReelsLimit ?? 4}
                  onChange={(e) => setFormData({ ...formData, monthlyReelsLimit: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Historias</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.storiesCount ?? 12}
                  onChange={(e) => setFormData({ ...formData, storiesCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Mensualidad Acordada (HNL)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.monthlyPrice ?? 8500}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    setFormData({ ...formData, monthlyPrice: isNaN(val) ? 0 : val });
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Día de Cobro Mensual (1 al 31)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="31"
                  value={formData.billingDay ?? 15}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFormData({ ...formData, billingDay: isNaN(val) ? 15 : val });
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notas Adicionales</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Observaciones de la cuenta o requerimientos..."
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Guardar Cliente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
