import React from 'react';
import { ViewType } from '../types';
import { LayoutDashboard, Users, Calendar, FileText, CreditCard } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Panel de Control', icon: LayoutDashboard },
    { id: 'clients' as ViewType, label: 'Directorio Clientes', icon: Users },
    { id: 'calendar' as ViewType, label: 'Planificador de Posts', icon: Calendar },
    { id: 'contracts' as ViewType, label: 'Contratos Oficiales', icon: FileText },
    { id: 'accounting' as ViewType, label: 'Control Financiero', icon: CreditCard },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/assets/logo.png" alt="Adrián Reyes Creativo" className="sidebar-logo" />
        <div className="sidebar-brand-text">
          <span className="brand-title">ADRIÁN REYES</span>
          <span className="brand-subtitle">SISTEMA EMPRESARIAL</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <a
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectView(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
};
