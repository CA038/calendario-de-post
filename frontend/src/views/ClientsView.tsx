import React, { useState } from 'react';
import { Client, ClientCategory } from '../types';
import { Search, Plus, Edit2, Trash2, FileText, Phone, Mail, Globe, MessageCircle } from 'lucide-react';

interface ClientsViewProps {
  clients: Client[];
  onNewClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: number | string) => Promise<void>;
  onCreateContractFor: (client: Client) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onNewClient,
  onEditClient,
  onDeleteClient,
  onCreateContractFor,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | ClientCategory>('all');

  const filtered = clients.filter((c) => {
    if (filter !== 'all' && c.category !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchBrand = (c.brandName || '').toLowerCase().includes(q);
      const matchPhone = (c.phone || '').toLowerCase().includes(q);
      return matchName || matchBrand || matchPhone;
    }
    return true;
  });

  return (
    <div className="content-area">
      {/* Barra de Filtros y Búsqueda */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `Todos (${clients.length})` },
            { id: 'social_media', label: 'Social Media' },
            { id: 'active', label: 'Activos' },
            { id: 'lead', label: 'Prospectos' },
            { id: 'inactive', label: 'Inactivos' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`btn-secondary ${filter === tab.id ? 'active' : ''}`}
              style={{
                fontSize: '12px',
                padding: '6px 14px',
                borderColor: filter === tab.id ? 'var(--accent-orange)' : 'var(--border-color)',
                color: filter === tab.id ? 'var(--accent-orange)' : 'var(--text-secondary)',
                background: filter === tab.id ? 'var(--accent-orange-subtle)' : 'var(--bg-card)'
              }}
              onClick={() => setFilter(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '34px', width: '100%' }}
              placeholder="Buscar cliente, marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={onNewClient}>
            <Plus size={15} />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Grid de Tarjetas de Clientes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {filtered.map((c) => {
          const rawPhone = c.phone ? c.phone.replace(/[^0-9]/g, '') : '';
          const waUrl = rawPhone
            ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(`Hola ${c.name}, te saluda Adrián Reyes Creativo. ¿Cómo estás?`)}`
            : null;

          return (
            <div
              key={c.id}
              className="kpi-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {c.logoUrl ? (
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: '#0d1322',
                          border: '1px solid #1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={c.logoUrl}
                          alt={c.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '3px'
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: c.brandColor || '#ff7a00',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '15px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                          flexShrink: 0
                        }}
                      >
                        {c.logoText || c.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>{c.name}</h3>
                      <p style={{ fontSize: '12px', color: '#ea580c', fontWeight: 600 }}>{c.brandName || 'Marca / Negocio'}</p>
                    </div>
                  </div>

                  <span className={`badge ${c.category === 'social_media' ? 'badge-orange' : (c.category === 'active' ? 'badge-paid' : 'badge-pending')}`}>
                    {c.category === 'social_media' ? 'Social Media' : c.category === 'active' ? 'Activo' : c.category === 'lead' ? 'Prospecto' : 'Inactivo'}
                  </span>
                </div>

                {/* Accesos de Comunicación Rápida */}
                <div style={{ display: 'flex', gap: '8px', margin: '12px 0 8px 0', flexWrap: 'wrap' }}>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)', textDecoration: 'none' }}
                      title="Enviar WhatsApp"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px', color: '#94a3b8', textDecoration: 'none' }}
                      title="Llamar"
                    >
                      <Phone size={13} />
                      <span>{c.phone}</span>
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px', color: '#94a3b8', textDecoration: 'none' }}
                      title="Enviar Correo"
                    >
                      <Mail size={13} />
                      <span>Email</span>
                    </a>
                  )}
                  {c.websiteUrl && (
                    <a
                      href={c.websiteUrl.startsWith('http') ? c.websiteUrl : `https://${c.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px', color: '#94a3b8', textDecoration: 'none' }}
                      title="Sitio Web"
                    >
                      <Globe size={13} />
                      <span>Web</span>
                    </a>
                  )}
                </div>

                {/* Bloque de Entregables */}
                <div style={{ background: '#101728', borderRadius: '8px', padding: '10px 12px', margin: '10px 0', border: '1px solid #182238' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                    <span>Plan: <strong style={{ color: '#f8fafc' }}>{c.planName}</strong></span>
                    <span>Día de cobro: <strong style={{ color: '#ea580c' }}>cada {c.billingDay}</strong></span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                    📦 {c.monthlyPostsLimit} Posts + {c.monthlyReelsLimit} Reels + {c.storiesCount} Historias
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#4ade80', marginTop: '6px' }}>
                    L. {(c.monthlyPrice ?? 0).toLocaleString()} {c.currency || 'HNL'}
                  </div>
                </div>
              </div>

              {/* Acciones Inferiores */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #182238', paddingTop: '12px', marginTop: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '6px 12px', color: '#ea580c', borderColor: 'rgba(234, 88, 12, 0.3)' }}
                  onClick={() => onCreateContractFor(c)}
                  title="Generar Acuerdo / Contrato para este cliente"
                >
                  <FileText size={13} />
                  <span>Generar Contrato</span>
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 8px' }}
                    onClick={() => onEditClient(c)}
                    title="Editar cliente"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 8px', color: '#f87171' }}
                    onClick={() => {
                      if (confirm(`¿Eliminar al cliente "${c.name}"?`)) {
                        onDeleteClient(c.id);
                      }
                    }}
                    title="Eliminar cliente"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#64748b' }}>
            No se encontraron clientes con el filtro seleccionado.
          </div>
        )}
      </div>
    </div>
  );
};
