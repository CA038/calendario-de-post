import React, { useState } from 'react';
import { Client, CalendarPost } from '../types';
import { ChevronLeft, ChevronRight, Video, Image, Sparkles, Plus, CheckCircle, Clock } from 'lucide-react';

interface CalendarViewProps {
  clients: Client[];
  posts: CalendarPost[];
  onNewPost: (initialDate?: string) => void;
  onEditPost: (post: CalendarPost) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  clients,
  posts,
  onNewPost,
  onEditPost,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Generar días del mes
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Filtrar publicaciones
  const currentMonthPosts = posts.filter((p) => {
    const dt = new Date(p.scheduledDate);
    const matchMonth = dt.getFullYear() === year && dt.getMonth() === month;
    if (!matchMonth) return false;
    if (selectedClientId !== 'all' && String(p.clientId) !== selectedClientId) return false;
    if (filterType !== 'all' && p.postType !== filterType) return false;
    return true;
  });

  // Métricas del mes
  const totalPostsCount = currentMonthPosts.filter(p => p.postType === 'post').length;
  const totalReelsCount = currentMonthPosts.filter(p => p.postType === 'reel').length;
  const totalStoriesCount = currentMonthPosts.filter(p => p.postType === 'story').length;
  const publishedCount = currentMonthPosts.filter(p => p.status === 'published').length;

  return (
    <div className="content-area">
      {/* Barra Superior de Control del Calendario */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
            <ChevronLeft size={16} />
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#f8fafc', minWidth: '180px', textAlign: 'center' }}>
            {monthNames[month]} {year}
          </h2>
          <button className="btn-secondary" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Filtro por Marca */}
          <select
            className="form-select"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">Todas las Marcas ({clients.length})</option>
            {clients.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.brandName || c.name}
              </option>
            ))}
          </select>

          {/* Filtro por Formato */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className={`btn-secondary ${filterType === 'all' ? 'active' : ''}`}
              style={{ fontSize: '12px', padding: '6px 10px' }}
              onClick={() => setFilterType('all')}
            >
              Todos
            </button>
            <button
              className={`btn-secondary ${filterType === 'post' ? 'active' : ''}`}
              style={{ fontSize: '12px', padding: '6px 10px', color: '#ff7a00' }}
              onClick={() => setFilterType('post')}
            >
              Posts
            </button>
            <button
              className={`btn-secondary ${filterType === 'reel' ? 'active' : ''}`}
              style={{ fontSize: '12px', padding: '6px 10px', color: '#38bdf8' }}
              onClick={() => setFilterType('reel')}
            >
              Reels
            </button>
          </div>

          <button className="btn-primary" onClick={() => onNewPost()}>
            <Plus size={15} />
            <span>Programar Publicación</span>
          </button>
        </div>
      </div>

      {/* Resumen de Métricas del Mes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <div className="kpi-card" style={{ padding: '12px 16px' }}>
          <div className="kpi-label" style={{ fontSize: '11px' }}>Posts Planificados</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#ff7a00', marginTop: '4px' }}>
            {totalPostsCount} posts
          </div>
        </div>
        <div className="kpi-card" style={{ padding: '12px 16px' }}>
          <div className="kpi-label" style={{ fontSize: '11px', color: '#38bdf8' }}>Reels / Videos</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
            {totalReelsCount} reels
          </div>
        </div>
        <div className="kpi-card" style={{ padding: '12px 16px' }}>
          <div className="kpi-label" style={{ fontSize: '11px', color: '#c084fc' }}>Historias</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#c084fc', marginTop: '4px' }}>
            {totalStoriesCount} historias
          </div>
        </div>
        <div className="kpi-card" style={{ padding: '12px 16px', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <div className="kpi-label" style={{ fontSize: '11px', color: '#4ade80' }}>Publicados</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#4ade80', marginTop: '4px' }}>
            {publishedCount} completados
          </div>
        </div>
      </div>

      {/* Grilla Mensual de Calendario */}
      <div className="table-card" style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
            <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#64748b', padding: '6px' }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', minHeight: '620px' }}>
          {/* Espacios vacíos antes del primer día */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} style={{ background: 'rgba(16, 23, 40, 0.4)', borderRadius: '8px', border: '1px dashed #182238' }} />
          ))}

          {/* Días del Mes */}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNumber = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            const dayPosts = currentMonthPosts.filter((p) => {
              const pDate = p.scheduledDate.split('T')[0];
              return pDate === dateStr;
            });

            const isToday =
              dayNumber === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={`day-${dayNumber}`}
                style={{
                  background: isToday ? 'rgba(255, 122, 0, 0.08)' : 'var(--bg-input)',
                  border: isToday ? '1.5px solid #ff7a00' : '1px solid #182238',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  minHeight: '110px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, border-color 0.2s ease'
                }}
                onClick={() => onNewPost(dateStr)}
                title={`Haz clic para programar un post el ${dayNumber} de ${monthNames[month]}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: isToday ? '#ff7a00' : '#94a3b8' }}>
                    {dayNumber}
                  </span>
                  {dayPosts.length > 0 && (
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#ea580c', background: 'rgba(255, 122, 0, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>
                      {dayPosts.length}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                  {dayPosts.map((p) => {
                    const isReel = p.postType === 'reel';
                    const isStory = p.postType === 'story';
                    return (
                      <div
                        key={p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPost(p);
                        }}
                        style={{
                          background: '#0d1322',
                          borderLeft: `3px solid ${p.brandColor || '#ff7a00'}`,
                          borderRadius: '4px',
                          padding: '5px 6px',
                          fontSize: '11px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          cursor: 'pointer'
                        }}
                        title={`${p.clientName} - ${p.title} (${p.status})`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#f8fafc' }}>
                          {isReel ? (
                            <Video size={11} color="#38bdf8" />
                          ) : isStory ? (
                            <Sparkles size={11} color="#c084fc" />
                          ) : (
                            <Image size={11} color="#ff7a00" />
                          )}
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.clientName}
                          </span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.title}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: p.status === 'published' ? '#4ade80' : p.status === 'ready' ? '#38bdf8' : p.status === 'design' ? '#fbbf24' : '#94a3b8'
                            }}
                          >
                            {p.status === 'published' ? 'Publicado' : p.status === 'ready' ? 'Listo' : p.status === 'design' ? 'En diseño' : 'Idea'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
