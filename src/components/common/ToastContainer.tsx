/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: Toast 提示容器
 */
import React, { useEffect } from 'react'
import { useUI } from '../../context/UIContext'

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUI()

  useEffect(() => {
    const timers = toasts.map((t) => setTimeout(() => removeToast(t.id), 4000))
    return () => {
      timers.forEach(clearTimeout)
    }
  }, [toasts, removeToast])

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={['toast', `toast-${t.type}`].join(' ')}>
          <span>{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
