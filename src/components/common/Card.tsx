/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 
 */
import React from 'react'

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={['card', className].filter(Boolean).join(' ')}>{children}</div>
}

export default Card
