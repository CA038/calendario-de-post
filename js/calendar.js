// Renderizador y Lógica del Calendario
class CalendarView {
  constructor(gridElementId, onPostClick) {
    this.grid = document.getElementById(gridElementId);
    this.onPostClick = onPostClick;
    this.currentDate = new Date();
  }

  setDate(year, month) {
    this.currentDate = new Date(year, month, 1);
  }

  getCurrentMonthYear() {
    return {
      year: this.currentDate.getFullYear(),
      month: this.currentDate.getMonth(), // 0 - 11
      yearMonth: `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}`
    };
  }

  getMonthLabel() {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  render(posts = []) {
    this.grid.innerHTML = '';
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Ajustar a semana iniciando en Lunes (0: Lun, 6: Dom)
    const startingDay = (firstDayIndex + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // Días del mes anterior para rellenar
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const cell = this.createDayCell(prevDay, true);
      this.grid.appendChild(cell);
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && today.getDate() === day;
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Filtrar posts de este día
      const dayPosts = posts.filter(p => {
        if (!p.scheduledDate) return false;
        return p.scheduledDate.startsWith(dayStr);
      });

      const cell = this.createDayCell(day, false, isToday, dayPosts);
      this.grid.appendChild(cell);
    }

    // Días del mes siguiente para completar la cuadrícula (múltiplo de 7)
    const totalCells = startingDay + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let day = 1; day <= remainingCells; day++) {
      const cell = this.createDayCell(day, true);
      this.grid.appendChild(cell);
    }

    // Refrescar iconos de Lucide
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  createDayCell(dayNum, isOtherMonth = false, isToday = false, posts = []) {
    const cell = document.createElement('div');
    cell.className = `calendar-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;

    const header = document.createElement('div');
    header.className = 'day-header';
    header.innerHTML = `<span class="day-number">${dayNum}</span>`;
    cell.appendChild(header);

    const postsList = document.createElement('div');
    postsList.className = 'day-posts-list';

    posts.forEach(post => {
      const postCard = document.createElement('div');
      postCard.className = `post-mini-card ${post.status || 'pending'}`;
      
      const mediaIcon = post.mediaType === 'video' ? 'video' : (post.mediaType === 'gallery' ? 'images' : 'image');
      const time = post.scheduledDate ? post.scheduledDate.slice(11, 16) : '';

      postCard.innerHTML = `
        <div class="mini-card-top">
          <span class="mini-media-badge"><i data-lucide="${mediaIcon}"></i> ${time}</span>
        </div>
        <div class="mini-post-title" title="${post.title}">${post.title}</div>
      `;

      postCard.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onPostClick(post);
      });

      postsList.appendChild(postCard);
    });

    cell.appendChild(postsList);
    return cell;
  }
}
