import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface Toast {
  id: string
  title?: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

function Toaster() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start space-x-3 p-4 rounded-lg border shadow-lg max-w-sm",
            "bg-[var(--color-surface)] border-[var(--color-border)]",
            "animate-fade-in"
          )}
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' && <span className="text-green-500">✓</span>}
            {toast.type === 'error' && <span className="text-red-500">✕</span>}
            {toast.type === 'warning' && <span className="text-yellow-500">⚠</span>}
            {toast.type === 'info' && <span className="text-blue-500">ℹ</span>}
            {!toast.type && <span className="text-[var(--color-primary)]">ℹ</span>}
          </div>
          
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="text-sm font-medium text-[var(--color-text)]">
                {toast.title}
              </p>
            )}
            {toast.description && (
              <p className="text-sm text-[var(--color-muted)]">
                {toast.description}
              </p>
            )}
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}