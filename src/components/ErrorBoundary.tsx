import React, { Component, type ErrorInfo, type ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────
//  FILE 1: src/components/ErrorBoundary.tsx
// ─────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidMount() {
    (window as unknown as { __ERROR_BOUNDARY_MOUNTED__: boolean }).__ERROR_BOUNDARY_MOUNTED__ = true;
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[CarbonSense ErrorBoundary] Uncaught error:', error);
    console.error('[CarbonSense ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  handleReset = (): void => {
    try {
      localStorage.clear();
    } catch {
      // Ignore storage errors in sandboxed environments
    }
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-950 p-6 overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-900/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-emerald-900/15 rounded-full blur-3xl" />
          </div>

          <div
            role="alert"
            aria-live="assertive"
            className="relative z-10 w-full max-w-md var-bg-card backdrop-blur-md border border-card rounded-2xl p-8 shadow-2xl shadow-black/60 text-center"
          >
            {/* Leaf icon */}
            <div
              className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-4xl"
              aria-hidden="true"
            >
              🍃
            </div>

            {/* Heading */}
            <h1
              className="text-2xl font-bold text-primary mb-3 font-display"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Something went wrong
            </h1>

            <p className="text-secondary text-sm mb-6 leading-relaxed">
              CarbonSense encountered an unexpected error. Resetting the app will
              clear local data and reload the page.
            </p>

            {/* Error code block */}
            {this.state.error && (
              <div className="mb-6 text-left">
                <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">
                  Error Details
                </p>
                <pre className="p-4 bg-gray-900/80 border border-white/8 rounded-xl overflow-auto max-h-40 text-xs text-rose-300 font-mono whitespace-pre-wrap break-all">
                  <code>{this.state.error.message}</code>
                </pre>
              </div>
            )}

            {/* Reset button */}
            <button
              type="button"
              onClick={this.handleReset}
              className={[
                'w-full px-6 py-3 rounded-xl font-display font-semibold text-sm',
                'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700',
                'text-primary border border-emerald-500/40',
                'shadow-lg shadow-emerald-900/40',
                'transition-all duration-200 active:scale-[0.97]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
              ].join(' ')}
              aria-label="Reset application and clear stored data"
            >
              🔄 Reset Application
            </button>

            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className={[
                'mt-3 w-full px-6 py-3 rounded-xl font-medium text-sm',
                'var-bg-card hover:bg-white/10 active:bg-white/15',
                'text-secondary hover:text-primary',
                'border border-card',
                'transition-all duration-200 active:scale-[0.97]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
              ].join(' ')}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
