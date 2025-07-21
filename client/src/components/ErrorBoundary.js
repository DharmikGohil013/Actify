import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Filter out ResizeObserver errors
    if (error.message?.includes('ResizeObserver loop completed with undelivered notifications')) {
      return { hasError: false };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Filter out ResizeObserver errors
    if (error.message?.includes('ResizeObserver loop completed with undelivered notifications')) {
      return;
    }
    
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 50%, #667eea 100%)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(40px)",
            borderRadius: 24,
            padding: "40px 60px",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 16px 60px rgba(0, 0, 0, 0.1)",
            maxWidth: 500
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
            <h2 style={{ 
              color: "#1d1d1f", 
              fontSize: 24, 
              fontWeight: 600, 
              marginBottom: 16,
              letterSpacing: "-0.3px"
            }}>
              Something went wrong
            </h2>
            <p style={{ 
              color: "#424245", 
              fontSize: 16, 
              marginBottom: 24,
              lineHeight: 1.5
            }}>
              We encountered an unexpected error. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "linear-gradient(135deg, #007AFF 0%, #34C759 100%)",
                color: "white",
                border: "none",
                borderRadius: 16,
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 20px rgba(0, 122, 255, 0.3)"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 12px 30px rgba(0, 122, 255, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 8px 20px rgba(0, 122, 255, 0.3)";
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
