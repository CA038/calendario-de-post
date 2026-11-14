import React, { useState, useEffect } from 'react';
import { Client, CalendarPost, PostContentType, PostStatusType } from '../types';
import { X, Save, Trash2, Video, Image, Sparkles } from 'lucide-react';

interface CalendarPostModalProps {
  isOpen: boolean;
  clients: Client[];
  editingPost: CalendarPost | null;
  initialDate?: string;
  onClose: () => void;
  onSave: (post: Partial<CalendarPost>) => Promise<void>;
  onDelete?: (id: number | string) => Promise<void>;
}

export const CalendarPostModal: React.FC<CalendarPostModalProps> = ({
  isOpen,
  clients,
  editingPost,
  initialDate,
  onClose,
  onSave,
  onDelete
}) => {
  const [clientId, setClientId] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [brandColor, setBrandColor] = useState<string>('#ff7a00');
  const [title, setTitle] = useState<string>('');
  const [postType, setPostType] = useState<PostContentType>('post');
  const [status, setStatus] = useState<PostStatusType>('idea');
  const [scheduledDate, setScheduledDate] = useState<string>(initialDate || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (editingPost) {
      setClientId(editingPost.clientId ? String(editingPost.clientId) : '');
      setClientName(editingPost.clientName);
      setBrandColor(editingPost.brandColor || '#ff7a00');
      setTitle(editingPost.title);
      setPostType(editingPost.postType);
      setStatus(editingPost.status);
      setScheduledDate(editingPost.scheduledDate.split('T')[0]);
      setNotes(editingPost.notes || '');
    } else {
      const defaultClient = clients[0];
      setClientId(defaultClient ? String(defaultClient.id) : '');
      setClientName(defaultClient ? (defaultClient.brandName || defaultClient.name) : '');
      setBrandColor(defaultClient?.brandColor || '#ff7a00');
      setTitle('');
      setPostType('post');
      setStatus('idea');
      setScheduledDate(initialDate || new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [editingPost, initialDate, isOpen, clients]);

  if (!isOpen) return null;

  const handleClientChange = (val: string) => {
    setClientId(val);
    const found = clients.find(c => String(c.id) === val);
    if (found) {
      setClientName(found.brandName || found.name);
      setBrandColor(found.brandColor || '#ff7a00');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSave({
      id: editingPost?.id,
      clientId: clientId ? Number(clientId) : null,
      clientName: clientName || 'Marca',
      brandColor,
      title: title.trim(),
      postType,
      status,
      scheduledDate,
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingPost ? 'Editar Publicación del Calendario' : 'Programar Nueva Publicación'}
          </h3>
          <button onClick={onClose}>
            <X size={18} color="#94a3b8" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Seleccionar Marca */}
            <div className="form-group">
              <label className="form-label">Cliente / Marca *</label>
              <select
                className="form-select"
                value={clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                required
              >
                <option value="">-- Seleccionar Marca --</option>
                {clients.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name} {c.brandName ? `(${c.brandName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Título / Concepto */}
            <div className="form-group">
              <label className="form-label">Título / Concepto del Entregable *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej. Promoción de Verano 2x1 en tratamientos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Tipo de Formato */}
            <div className="form-group">
              <label className="form-label">Formato del Contenido</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn-secondary ${postType === 'post' ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderColor: postType === 'post' ? 'var(--accent-orange)' : 'var(--border-color)',
                    background: postType === 'post' ? 'rgba(255, 122, 0, 0.15)' : 'var(--bg-input)'
                  }}
                  onClick={() => setPostType('post')}
                >
                  <Image size={14} color="#ff7a00" />
                  <span>Post / Carrusel</span>
                </button>

                <button
                  type="button"
                  className={`btn-secondary ${postType === 'reel' ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderColor: postType === 'reel' ? '#38bdf8' : 'var(--border-color)',
                    background: postType === 'reel' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-input)'
                  }}
                  onClick={() => setPostType('reel')}
                >
                  <Video size={14} color="#38bdf8" />
                  <span>Reel / Video</span>
                </button>

                <button
                  type="button"
                  className={`btn-secondary ${postType === 'story' ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderColor: postType === 'story' ? '#c084fc' : 'var(--border-color)',
                    background: postType === 'story' ? 'rgba(192, 132, 252, 0.15)' : 'var(--bg-input)'
                  }}
                  onClick={() => setPostType('story')}
                >
                  <Sparkles size={14} color="#c084fc" />
                  <span>Historia</span>
                </button>
              </div>
            </div>

            {/* Fecha y Estado */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Fecha Programada *</label>
                <input
                  type="date"
                  className="form-input"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado de Producción</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PostStatusType)}
                >
                  <option value="idea">💡 Idea / Propuesta</option>
                  <option value="design">🎨 En Diseño / Grabación</option>
                  <option value="ready">✅ Listo / Aprobado</option>
                  <option value="published">🚀 Publicado</option>
                </select>
              </div>
            </div>

            {/* Notas Adicionales */}
            <div className="form-group">
              <label className="form-label">Notas, Copy o Requerimientos</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Detalles del diseño, llamado a la acción, hashtags o enlaces de referencia..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {editingPost && onDelete ? (
              <button
                type="button"
                className="btn-secondary"
                style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={async () => {
                  if (confirm(`¿Eliminar la publicación "${title}"?`)) {
                    await onDelete(editingPost.id);
                    onClose();
                  }
                }}
              >
                <Trash2 size={14} />
                <span>Eliminar</span>
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                <Save size={15} />
                <span>Guardar Publicación</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
