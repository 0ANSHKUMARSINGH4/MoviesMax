import React from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-md w-full bg-[#0E1628] border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-400 mb-6">
              We encountered a display issue while rendering this content. You can reload or head back to browse normally.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                <RotateCcw size={16} /> Try Again
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all active:scale-95"
              >
                <Home size={16} /> Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
