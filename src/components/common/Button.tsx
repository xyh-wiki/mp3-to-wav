/**
 * @Author:XYH
 * @Date:2025-11-19
 * @Description: 
 */
import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

const Button: React.FC<Props> = ({ variant = 'primary', loading, children, className, ...rest }) => {
  const cls = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ')
  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button
