/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 全局 UI 状态（Toast）
 */
import React, { createContext, useContext, useState, useCallback } from 'react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface UIValue {
  toasts: ToastMessage[]
  addToast: (t: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

const UIContext = createContext<UIValue | null>(null)

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((t: Omit<ToastMessage, 'id'>) => {
    const id = Date.now() + Math.random().toString(16)
    setToasts((prev) => [...prev, { ...t, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id != id))
  }, [])

  return (
    <UIContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used in UIProvider')
  return ctx
}
