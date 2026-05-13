import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-void)]">
          <div className="text-center space-y-4 max-w-sm px-4">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-prime)]">Algo salió mal</h2>
            <p className="text-sm text-[var(--text-muted)]">Ocurrió un error inesperado. Por favor recarga la página.</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-bright)] text-[var(--text-muted)] hover:text-[var(--text-prime)] text-sm transition-all"
            >
              <RefreshCw size={14} />
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
