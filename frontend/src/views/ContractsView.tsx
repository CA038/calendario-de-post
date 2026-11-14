import React, { useState, useRef } from 'react';
import { Client, Contract } from '../types';
import { PdfService } from '../services/pdfService';
import { FileDown, Printer, Save, Check, Sparkles } from 'lucide-react';

interface ContractsViewProps {
  clients: Client[];
  contracts: Contract[];
  onSaveContract: (contract: Partial<Contract>) => Promise<void>;
  preselectedClient?: Client | null;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  clients,
  contracts,
  onSaveContract,
  preselectedClient,
}) => {
  const [subview, setSubview] = useState<'editor' | 'catalog'>('editor');
  const paperRef = useRef<HTMLDivElement>(null);

  // Form State
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [clientName, setClientName] = useState(preselectedClient?.name || '');
  const [brandName, setBrandName] = useState(preselectedClient?.brandName || preselectedClient?.name || '');
  const [planName, setPlanName] = useState(preselectedClient?.planName || 'Plan Crecimiento');
  const [postsCount, setPostsCount] = useState(preselectedClient?.monthlyPostsLimit || 14);
  const [reelsCount, setReelsCount] = useState(preselectedClient?.monthlyReelsLimit || 4);
  const [storiesCount, setStoriesCount] = useState(preselectedClient?.storiesCount || 12);
  const [currency, setCurrency] = useState<'HNL' | 'USD'>('HNL');
  const [price, setPrice] = useState(preselectedClient?.monthlyPrice || 8500);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('3 meses');
  const [firstMonthTerms, setFirstMonthTerms] = useState('50% de anticipo y el 50% restante 15 días después');
  const [recurringDay, setRecurringDay] = useState('cada día 15');
  const [revisions, setRevisions] = useState('hasta 2 rondas de correcciones menores');
  const [customNotes, setCustomNotes] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Auto-llenar desde el selector de clientes
  const handleClientSelect = (id: string) => {
    const found = clients.find((c) => String(c.id) === id);
    if (found) {
      setClientName(found.name);
      setBrandName(found.brandName || found.name);
      setPlanName(found.planName || 'Plan Crecimiento');
      setPostsCount(found.monthlyPostsLimit || 14);
      setReelsCount(found.monthlyReelsLimit || 4);
      setStoriesCount(found.storiesCount || 12);
      setPrice(found.monthlyPrice || 8500);
    }
  };

  const handleEditSavedContract = (ct: Contract) => {
    setEditingId(ct.id);
    setClientName(ct.clientName);
    setBrandName(ct.brandName || '');
    setPlanName(ct.planName);
    setPostsCount(ct.postsCount);
    setReelsCount(ct.reelsCount);
    setStoriesCount(ct.storiesCount);
    setCurrency(ct.currency);
    setPrice(ct.price);
    setStartDate(ct.startDate || '');
    setDuration(ct.duration);
    setFirstMonthTerms(ct.firstMonthTerms);
    setRecurringDay(ct.recurringDay);
    setRevisions(ct.revisions);
    setCustomNotes(ct.customNotes || '');
    setSubview('editor');
  };

  const handleSave = async () => {
    if (!clientName.trim()) return;
    await onSaveContract({
      id: editingId || undefined,
      clientName,
      brandName,
      planName,
      postsCount,
      reelsCount,
      storiesCount,
      currency,
      price,
      startDate,
      duration,
      firstMonthTerms,
      recurringDay,
      revisions,
      customNotes,
      status: 'active'
    });
  };

  const handleDownloadPdf = async () => {
    if (!paperRef.current) return;
    setIsExporting(true);
    await PdfService.exportContractPdf(paperRef.current, clientName || 'Cliente');
    setIsExporting(false);
  };

  const plans = [
    { id: 'plan-esencial', name: 'Plan Esencial', posts: 8, reels: 2, stories: 8, price: 5500 },
    { id: 'plan-crecimiento', name: 'Plan Crecimiento', posts: 14, reels: 4, stories: 12, price: 8500 },
    { id: 'plan-pro', name: 'Plan Pro', posts: 20, reels: 6, stories: 16, price: 12000 },
    { id: 'plan-personalizado', name: 'Plan Personalizado', posts: postsCount, reels: reelsCount, stories: storiesCount, price: price },
  ];

  return (
    <div className="content-area">
      {/* Botones de Navegación de la Vista */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn-secondary ${subview === 'editor' ? 'active' : ''}`}
            onClick={() => setSubview('editor')}
          >
            ✏️ Redactor & Vista Previa Oficial
          </button>
          <button
            className={`btn-secondary ${subview === 'catalog' ? 'active' : ''}`}
            onClick={() => setSubview('catalog')}
          >
            📋 Catálogo de Acuerdos ({contracts.length})
          </button>
        </div>

        {subview === 'editor' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => window.print()} title="Imprimir contrato">
              <Printer size={15} />
              <span>Imprimir</span>
            </button>
            <button className="btn-secondary" onClick={handleSave} title="Guardar acuerdo en la nube">
              <Save size={15} />
              <span>Guardar Acuerdo</span>
            </button>
            <button className="btn-primary" onClick={handleDownloadPdf} disabled={isExporting}>
              <FileDown size={15} />
              <span>{isExporting ? 'Generando PDF...' : 'Descargar Contrato en PDF'}</span>
            </button>
          </div>
        )}
      </div>

      {subview === 'editor' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 460px) 1fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Panel Izquierdo: Formulario de Configuración del Contrato */}
          <div className="table-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>
              Parámetros del Acuerdo
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Autocompletar Cliente</label>
                <select className="form-select" onChange={(e) => handleClientSelect(e.target.value)}>
                  <option value="">-- Seleccionar cliente existente --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name} ({c.brandName || 'Marca'})</option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Nombre del Cliente *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Marca o Negocio</label>
                  <input
                    type="text"
                    className="form-input"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Nombre comercial"
                  />
                </div>
              </div>

              {/* Selector de Plan */}
              <div className="form-group">
                <label className="form-label">Plan Contratado</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {plans.map((p) => {
                    const isSelected = planName === p.name;
                    return (
                      <div
                        key={p.id}
                        style={{
                          background: isSelected ? 'rgba(255, 122, 0, 0.15)' : 'var(--bg-input)',
                          border: isSelected ? '1.5px solid #ff7a00' : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                        onClick={() => {
                          setPlanName(p.name);
                          if (p.id !== 'plan-personalizado') {
                            setPostsCount(p.posts);
                            setReelsCount(p.reels);
                            setStoriesCount(p.stories);
                            setPrice(p.price);
                          }
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? '#ff7a00' : '#f8fafc' }}>{p.name}</div>
                          <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                            {p.id === 'plan-personalizado' ? `${postsCount}P + ${reelsCount}R` : `${p.posts}P + ${p.reels}R`}
                          </div>
                        </div>
                        {isSelected && <Check size={14} color="#ff7a00" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Casillas de Entregables Dinámicos */}
              <div className="form-grid-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="form-group">
                  <label className="form-label">Posts Mensuales</label>
                  <input
                    type="number"
                    className="form-input"
                    value={postsCount}
                    onChange={(e) => {
                      setPostsCount(Number(e.target.value));
                      setPlanName('Plan Personalizado');
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reels / Videos</label>
                  <input
                    type="number"
                    className="form-input"
                    value={reelsCount}
                    onChange={(e) => {
                      setReelsCount(Number(e.target.value));
                      setPlanName('Plan Personalizado');
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Historias</label>
                  <input
                    type="number"
                    className="form-input"
                    value={storiesCount}
                    onChange={(e) => {
                      setStoriesCount(Number(e.target.value));
                      setPlanName('Plan Personalizado');
                    }}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Mensualidad ({currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={price === 0 ? '' : price}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setPrice(isNaN(val) ? 0 : val);
                      setPlanName('Plan Personalizado');
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Vigencia del Acuerdo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Día de Pago Recurrente</label>
                  <input
                    type="text"
                    className="form-input"
                    value={recurringDay}
                    onChange={(e) => setRecurringDay(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Observaciones Especiales (Cláusula 8)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Condiciones acordadas con el cliente..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Panel Derecho: Hoja Oficial de Contrato con Cláusulas en Vivo */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="contract-paper-document" ref={paperRef}>
              {/* Cabecera Oficial */}
              <div className="contract-header">
                <div className="contract-header-title">
                  <h1>ACUERDO DE SERVICIOS PROFESIONALES</h1>
                  <h2>ADRIÁN REYES CREATIVO</h2>
                </div>
                <img src="/assets/logo.png" style={{ height: '48px', objectFit: 'contain' }} alt="Logo" />
              </div>

              {/* Metadatos */}
              <div className="contract-meta-box">
                <div><strong>Cliente:</strong> {clientName || '__________________________'}</div>
                <div><strong>Negocio:</strong> {brandName || '__________________________'}</div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Plan Contratado:</strong> <span style={{ color: '#ea580c', fontWeight: 800 }}>☒ {planName}</span>
                </div>
                <div style={{ gridColumn: '1 / -1', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '4px', padding: '8px 12px' }}>
                  <strong style={{ color: '#0f172a' }}>📦 Entregables Acordados:</strong>{' '}
                  <span style={{ fontWeight: 800, color: '#ea580c' }}>
                    {postsCount} Posts / Carruseles + {reelsCount} Reels / Videos + {storiesCount} Historias mensuales
                  </span>
                </div>
                <div><strong>Mensualidad:</strong> <span style={{ fontWeight: 900, color: '#0f172a' }}>L. {(price ?? 0).toLocaleString()} {currency}</span></div>
                <div><strong>Inicio del Servicio:</strong> {startDate || '____ / ____ / ______'}</div>
              </div>

              {/* Cláusulas */}
              <div className="contract-clause">
                <div className="contract-clause-title">1. DURACIÓN</div>
                <div className="contract-clause-body">
                  <p>El servicio se contrata por un período mínimo de <strong>{duration}</strong>. Finalizado este período, podrá renovarse por acuerdo de ambas partes.</p>
                  <p>El contrato <strong>no podrá darse por terminado anticipadamente de forma unilateral</strong>, salvo incumplimiento de alguna de las partes o acuerdo escrito entre ambas.</p>
                </div>
              </div>

              <div className="contract-clause">
                <div className="contract-clause-title">2. FORMA DE PAGO</div>
                <div className="contract-clause-body">
                  <p>Para iniciar el servicio, el cliente deberá realizar un <strong>{firstMonthTerms}</strong>.</p>
                  <p>Esta modalidad aplica <strong>únicamente durante el primer mes</strong>.</p>
                  <p>A partir del <strong>segundo mes</strong>, la mensualidad deberá pagarse <strong>completa {recurringDay}</strong>, manteniendo esta misma fecha de pago durante toda la vigencia del contrato.</p>
                  <p>El servicio correspondiente al siguiente período estará sujeto a que el pago mensual se encuentre al día.</p>
                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '6px 8px', borderRadius: '4px', marginTop: '4px', fontSize: '10.5px' }}>
                    <strong>Cuentas Bancarias Autorizadas:</strong> BAC Credomatic, Banco Ficohsa o Banco Atlántida a nombre de Adrián Reyes.
                  </div>
                </div>
              </div>

              <div className="contract-clause">
                <div className="contract-clause-title">3. LÍNEA DE DISEÑO Y PRODUCCIÓN</div>
                <div className="contract-clause-body">
                  <p>Al comenzar se realizará <strong>1 propuesta demo</strong> para definir y aprobar la línea visual de la marca, incluyendo colores, tipografías y estilo gráfico.</p>
                  <p>Una vez aprobada, esta línea se mantendrá durante un mínimo de <strong>1 mes y medio</strong>, evitando cambios constantes de estilo.</p>
                </div>
              </div>

              <div className="contract-clause">
                <div className="contract-clause-title">4. CONTENIDO, ENTREGABLES Y CORRECCIONES</div>
                <div className="contract-clause-body">
                  <p>
                    Las publicaciones se realizarán según el cronograma mensual acordado, incluyendo un total de{' '}
                    <strong>{postsCount} publicaciones estáticas / carruseles, {reelsCount} producciones de video vertical / reels y {storiesCount} historias</strong> durante cada mes de servicio.
                  </p>
                  <p>El cliente deberá proporcionar promociones, precios, información y demás material necesario con tiempo suficiente.</p>
                  <p>Cada entregable incluye <strong>{revisions}</strong>. Cambios de concepto, trabajos nuevos o solicitudes fuera del plan contratado se cotizarán por separado.</p>
                </div>
              </div>

              <div className="contract-clause">
                <div className="contract-clause-title">5. FOTOGRAFÍA Y VIDEO</div>
                <div className="contract-clause-body">
                  <p>Cuando el servicio requiera toma de fotografías o grabación de videos, deberá <strong>programarse con mínimo una semana de anticipación</strong>, sujeto a disponibilidad de agenda.</p>
                </div>
              </div>

              {/* Recuadro Destacado IMPORTANTE */}
              <div className="contract-disclaimer-box">
                <div style={{ fontWeight: 900, color: '#ea580c', fontSize: '11px', marginBottom: '4px' }}>
                  ⚠️ IMPORTANTE — ENTREGA DE MATERIAL
                </div>
                <div style={{ fontSize: '11px', color: '#9a3412', lineHeight: '1.45', fontWeight: 600 }}>
                  TODO MATERIAL FOTOGRÁFICO O AUDIOVISUAL REALIZADO POR ADRIÁN REYES CREATIVO SE ENTREGARÁ ÚNICAMENTE COMO PRODUCTO FINAL APROBADO.<br /><br />
                  NO SE ENTREGARÁN ARCHIVOS EDITABLES, PROYECTOS, MATERIAL EN BRUTO, FOTOGRAFÍAS ORIGINALES NI VIDEOS SIN EDITAR REALIZADOS DURANTE LAS PRODUCCIONES.
                </div>
              </div>

              <div className="contract-clause">
                <div className="contract-clause-title">6. ALCANCE DEL PLAN</div>
                <div className="contract-clause-body">
                  <p>El cliente recibirá únicamente los servicios y cantidades establecidos en el plan contratado (<strong>{postsCount} posts, {reelsCount} reels y {storiesCount} historias mensuales</strong>).</p>
                  <p>Los entregables no utilizados durante el período correspondiente <strong>no son acumulables</strong> para meses posteriores.</p>
                  <p>Cualquier trabajo adicional, solicitud urgente o servicio fuera del plan tendrá un costo adicional previamente informado.</p>
                </div>
              </div>

              <div className="contract-clause">
                <div className="contract-clause-title">7. RESULTADOS</div>
                <div className="contract-clause-body">
                  <p>Adrián Reyes Creativo se compromete a brindar contenido y gestión profesional de alta calidad, pero no garantiza una cantidad específica de ventas, seguidores, alcance o interacciones.</p>
                </div>
              </div>

              {customNotes && (
                <div className="contract-clause">
                  <div className="contract-clause-title">8. CONDICIONES ESPECIALES ACORDADAS</div>
                  <div className="contract-clause-body">
                    <p>{customNotes}</p>
                  </div>
                </div>
              )}

              <div className="contract-clause">
                <div className="contract-clause-title">{customNotes ? '9' : '8'}. ACEPTACIÓN</div>
                <div className="contract-clause-body">
                  <p>La firma de este documento confirma que el cliente conoce y acepta las condiciones, servicios y límites de su plan contratado.</p>
                </div>
              </div>

              {/* Firmas Oficiales */}
              <div className="contract-signatures-grid">
                <div>
                  <div className="signature-line" />
                  <div className="signature-name">{clientName || 'Cliente: ____________________'}</div>
                  <div className="signature-role">Firma de Aceptación</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '3px' }}>Fecha: ____ / ____ / ________</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="signature-line" />
                  <div className="signature-name">ADRIÁN REYES CREATIVO</div>
                  <div className="signature-role">Dirección Creativa & Estrategia</div>
                  <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '3px' }}>Firma y Sello Profesional</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Vista de Catálogo de Contratos Guardados */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {contracts.map((ct) => (
            <div key={ct.id} className="kpi-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>{ct.clientName}</h3>
                    <p style={{ fontSize: '12px', color: '#ea580c', fontWeight: 600 }}>{ct.brandName || 'Marca / Negocio'}</p>
                  </div>
                  <span className="badge badge-orange">{ct.planName}</span>
                </div>

                <div style={{ background: '#101728', borderRadius: '8px', padding: '10px', margin: '12px 0', fontSize: '12px', border: '1px solid #182238' }}>
                  <div>📦 <strong>{ct.postsCount} Posts + {ct.reelsCount} Reels + {ct.storiesCount || 12} Historias</strong></div>
                  <div style={{ marginTop: '4px' }}>⏱️ Vigencia: <strong>{ct.duration}</strong></div>
                  <div style={{ marginTop: '4px', color: '#4ade80', fontWeight: 900, fontSize: '14px' }}>L. {(ct.price ?? 0).toLocaleString()} {ct.currency}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #182238', paddingTop: '12px' }}>
                <button className="btn-secondary" style={{ fontSize: '11px', padding: '6px 12px' }} onClick={() => handleEditSavedContract(ct)}>
                  Ver / Editar Contrato
                </button>
                <button
                  className="btn-primary"
                  style={{ fontSize: '11px', padding: '6px 12px' }}
                  onClick={() => {
                    handleEditSavedContract(ct);
                    setTimeout(() => handleDownloadPdf(), 200);
                  }}
                >
                  <FileDown size={13} />
                  <span>Descargar PDF</span>
                </button>
              </div>
            </div>
          ))}

          {contracts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#64748b' }}>
              No hay acuerdos guardados aún. Ve a "Redactor & Vista Previa Oficial" para crear el primero.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
