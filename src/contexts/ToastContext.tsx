import React, { createContext, useCallback, useState } from 'react'

export interface Toast {
  id: string
  message: string
  type?: 'info' | 'success' | 'error' | 'warning'
  timeoutMs?: number
}

interface ToastContextType {
  toasts: Toast[]
  push: (msg: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
  clear: () => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    const full: Toast = { timeoutMs: 4000, type: 'info', ...toast, id }
    setToasts(t => [...t, full])
    if (full.timeoutMs) {
      setTimeout(() => dismiss(id), full.timeoutMs)
    }
  }, [dismiss])

  const clear = useCallback(() => setToasts([]), [])

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss, clear }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`px-3 py-2 rounded shadow text-sm bg-white border flex items-start gap-2 max-w-sm ${t.type === 'error' ? 'border-red-400' : t.type === 'success' ? 'border-green-400' : t.type === 'warning' ? 'border-yellow-400' : 'border-gray-300'}`}>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Hook moved to useToast.ts to satisfy fast refresh lint rule.
