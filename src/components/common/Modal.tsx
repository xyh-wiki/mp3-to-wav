/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 模态框组件
 */
import React from 'react'
import Button from './Button'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<Props> = ({ open, title, onClose, children }) => {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content">{children}</div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            关闭
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Modal
