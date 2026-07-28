import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 bg-surface min-h-[300px] flex flex-col items-center justify-center text-center rounded-3xl border border-error/20 my-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-error-container/20 text-error flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">Something went wrong in this section</h3>
          <p className="text-on-surface-variant text-sm max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected error occurred while rendering component.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-full shadow-sm hover:opacity-90 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-surface-container text-on-surface font-bold text-xs rounded-full hover:bg-surface-container-high transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
