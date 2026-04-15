'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(/*error*/) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--color-secundary)',
          background: 'var(--blue-five)'
        }}>
          <h2 style={{ 
            fontFamily: 'Bold', 
            fontSize: 'var(--font-2xl)',
            marginBottom: '1rem',
            color: 'var(--gold-four)'
          }}>
            Algo salió mal
          </h2>
          <p style={{ 
            marginBottom: '2rem',
            color: 'var(--grey-three)',
            maxWidth: '500px'
          }}>
            Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.
          </p>
          <button
            onClick={this.handleReset}
            className="general-button"
            style={{
              padding: '0.75rem 1.5rem',
              cursor: 'pointer'
            }}
          >
            Intentar de nuevo
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginTop: '2rem', 
              textAlign: 'left',
              maxWidth: '800px',
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '4px'
            }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                Detalles del error (solo en desarrollo)
              </summary>
              <pre style={{ 
                fontSize: '0.8rem', 
                overflow: 'auto',
                color: 'var(--grey-three)'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

