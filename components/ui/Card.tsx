import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg'
  variant?: 'border' | 'shadow'
}

export function Card({ padding = 'md', variant = 'shadow', className = '', children, ...props }: CardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const variants = {
    border: 'border border-slate-100',
    shadow: 'shadow-sm',
  }

  return (
    <div
      className={`rounded-2xl bg-white ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
