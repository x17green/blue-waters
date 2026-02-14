// eslint-disable-next-line import/named
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Badge Variants using CVA
 * 
 * Glassmorphism dark-first design for status indicators
 */
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1',
    'rounded-full',
    'font-medium',
    'transition-all duration-normal',
    'border',
  ],
  {
    variants: {
      variant: {
        // Primary - solid accent
        primary: [
          'bg-accent-600 text-fg',
          'border-accent-500/30',
          'shadow-soft',
          'before:absolute before:inset-0',
          'before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent',
          'before:rounded-full before:pointer-events-none',
        ],
        
        // Secondary - muted accent
        secondary: [
          'bg-accent-900/60 text-accent-200',
          'border-accent-800/50',
          'shadow-soft',
        ],
        
        // Glass - glassmorphism effect
        glass: [
          'bg-glass-02 text-fg',
          'backdrop-blur-subtle',
          'border-border-subtle',
          'shadow-glass',
        ],
        
        // Outline - border only
        outline: [
          'bg-transparent text-fg',
          'border-border-default',
        ],
        
        // Success - positive status
        success: [
          'bg-success-600/80 text-fg',
          'border-success-500/30',
          'shadow-soft',
        ],
        
        // Warning - caution status
        warning: [
          'bg-warning-600/80 text-fg',
          'border-warning-500/30',
          'shadow-soft',
        ],
        
        // Error - negative status
        error: [
          'bg-error-600/80 text-fg',
          'border-error-500/30',
          'shadow-soft',
        ],
        
        // Info - informational status
        info: [
          'bg-info-600/80 text-fg',
          'border-info-500/30',
          'shadow-soft',
        ],
        
        // Soft variants (muted backgrounds)
        'success-soft': [
          'bg-success-900/60 text-success-200',
          'border-success-800/50',
        ],
        
        'warning-soft': [
          'bg-warning-900/60 text-warning-200',
          'border-warning-800/50',
        ],
        
        'error-soft': [
          'bg-error-900/60 text-error-200',
          'border-error-800/50',
        ],
        
        'info-soft': [
          'bg-info-900/60 text-info-200',
          'border-info-800/50',
        ],
        
        // Legacy compatibility
        default: [
          'bg-accent-600 text-fg',
          'border-accent-500/30',
          'shadow-soft',
        ],
        destructive: [
          'bg-error-600/80 text-fg',
          'border-error-500/30',
          'shadow-soft',
        ],
      },
      
      size: {
        sm: ['px-2 py-0.5 text-xs'],
        md: ['px-2.5 py-1 text-xs'],
        lg: ['px-3 py-1.5 text-sm'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Visual variant
   * @default 'primary'
   */
  variant?: 
    | 'primary'
    | 'secondary'
    | 'glass'
    | 'outline'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'success-soft'
    | 'warning-soft'
    | 'error-soft'
    | 'info-soft'
    | 'default'
    | 'destructive'
  
  /**
   * Size of the badge
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  
  /**
   * Optional icon/element to show before text
   */
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="shrink-0" aria-hidden={true}>{icon}</span>}
      {children && <span>{children}</span>}
    </div>
  )
}

export { Badge, badgeVariants }
