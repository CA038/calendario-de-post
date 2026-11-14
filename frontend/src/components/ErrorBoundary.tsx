import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error no controlado:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080c15',
          color: '#f8fafc',
          padding: '24px',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          <div style={{
            maxWidth: '480px',
            background: '#101728',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertCircle size={28} />
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
              Se detectó una observación visual
            </h2>

            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
              El sistema protegió tus datos para evitar pérdidas. Puedes reiniciar la vista con el botón inferior.
            </p>

            <button
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={15} />
              <span>Restablecer Vista</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
