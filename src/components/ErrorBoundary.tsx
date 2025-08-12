import React from 'react';

interface State { hasError: boolean; message?: string }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, message: error.message }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('UI ErrorBoundary caught', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-6 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
          <h2 className="font-semibold mb-2">Something went wrong.</h2>
          <p className="text-sm break-all">{this.state.message}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
