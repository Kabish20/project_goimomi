import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-red-50 rounded-[2.5rem] border-2 border-red-100 m-8 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6 shadow-xl shadow-red-500/10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Something went wrong</h1>
          <p className="text-gray-500 text-sm font-medium mb-8 max-w-md mx-auto">
            The page you are trying to view has encountered an unexpected error. This usually happens when data is missing or malformed.
          </p>
          <div className="bg-white/50 backdrop-blur-sm border border-red-100 rounded-2xl p-4 mb-8 text-left max-w-2xl w-full overflow-auto max-h-[300px]">
            <p className="text-red-600 font-mono text-[10px] whitespace-pre-wrap leading-relaxed">
              {this.state.error && this.state.error.toString()}
            </p>
            {this.state.errorInfo && (
              <p className="text-gray-400 font-mono text-[9px] mt-2 whitespace-pre-wrap border-t border-red-50 pt-2">
                {this.state.errorInfo.componentStack}
              </p>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#14532d] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-green-900/20 hover:scale-105 active:scale-95 transition-all"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
