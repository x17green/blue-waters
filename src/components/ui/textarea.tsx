'use client'

// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Textarea Variants using CVA
 * 
 * Glassmorphism dark-first design matching Input component
 */
const textareaVariants = cva(
  [
    // Base styles
    'relative w-full flex min-h-[80px]',
    'font-medium transition-all duration-normal',
    'rounded-md',
    'resize-y',
    
    // Focus styles
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-accent-400/30',
    'focus-visible:ring-offset-4',
    'focus-visible:ring-offset-bg-950',
    
    // Disabled styles
    'disabled:cursor-not-allowed disabled:opacity-50',
    
    // Placeholder
    'placeholder:text-fg-subtle',
    
    // Text color
    'text-fg',
    
    // Scrollbar styling
    '[&::-webkit-scrollbar]:w-2',
    '[&::-webkit-scrollbar-track]:bg-bg-900',
    '[&::-webkit-scrollbar-thumb]:bg-bg-700',
    '[&::-webkit-scrollbar-thumb]:rounded-full',
    '[&::-webkit-scrollbar-thumb]:hover:bg-bg-600',
  ],
  {
    variants: {
      variant: {
        // Primary - solid background with glass overlay
        primary: [
          'bg-bg-800',
          'border border-border-default',
          'shadow-soft',
          'px-3 py-2.5',
          
          'hover:border-border-emphasis',
          
          'focus-visible:border-accent-400/50',
          'focus-visible:shadow-medium',
        ],
        
        // Glass - full glassmorphism effect
        glass: [
          'bg-glass-02',
          'backdrop-blur-subtle',
          'border border-border-subtle',
          'shadow-glass',
          'px-3 py-2.5',
          
          'hover:bg-glass-03',
          'hover:border-border-default',
          
          'focus-visible:bg-glass-03',
          'focus-visible:border-accent-400/30',
          'focus-visible:shadow-glass-emphasis',
        ],
        
        // Bordered - outline style
        bordered: [
          'bg-bg-900/50',
          'border-2 border-border-default',
          'px-3 py-2.5',
          
          'hover:border-accent-400/30',
          'hover:bg-bg-800/60',
          
          'focus-visible:border-accent-400',
          'focus-visible:bg-bg-800/80',
        ],
        
        // Flat - minimal style
        flat: [
          'bg-bg-800/30',
          'border border-transparent',
          'px-3 py-2.5',
          
          'hover:bg-bg-800/50',
          'hover:border-border-subtle',
          
          'focus-visible:bg-bg-800/70',
          'focus-visible:border-accent-400/30',
        ],
      },
      
      validation: {
        default: '',
        
        success: [
          'border-success-500/50',
          'focus-visible:border-success-400',
          'focus-visible:ring-success-400/20',
        ],
        
        error: [
          'border-error-500/50',
          'focus-visible:border-error-400',
          'focus-visible:ring-error-400/20',
        ],
        
        warning: [
          'border-warning-500/50',
          'focus-visible:border-warning-400',
          'focus-visible:ring-warning-400/20',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
      validation: 'default',
    },
  },
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  /**
   * Visual variant of the textarea
   * @default 'primary'
   */
  variant?: 'primary' | 'glass' | 'bordered' | 'flat'
  
  /**
   * Validation state
   * @default 'default'
   */
  validation?: 'default' | 'success' | 'error' | 'warning'
  
  /**
   * Label text (auto-generates htmlFor/id)
   */
  label?: string
  
  /**
   * Helper text shown below the textarea
   */
  helperText?: string
  
  /**
   * Error message (overrides helperText, sets validation='error')
   */
  errorMessage?: string
  
  /**
   * Success message (overrides helperText, sets validation='success')
   */
  successMessage?: string
  
  /**
   * Custom class for the wrapper div
   */
  wrapperClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = 'primary',
      validation = 'default',
      label,
      helperText,
      errorMessage,
      successMessage,
      wrapperClassName,
      id,
      required,
      ...props
    },
    ref,
  ) => {
    // Auto-generate ID from label if not provided
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
    
    // Determine actual validation state
    const actualValidation = errorMessage
      ? 'error'
      : successMessage
        ? 'success'
        : validation
    
    // Helper/error/success text ID for aria-describedby
    const messageId = `${textareaId}-message`
    const hasMessage = errorMessage || successMessage || helperText
    
    return (
      <div className={cn('w-full space-y-1.5', wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-fg"
            aria-label={required ? `${label} (required)` : label}
          >
            {label}
            {required && <span className="ml-1 text-error-500" aria-hidden={true}>*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            textareaVariants({ variant, validation: actualValidation }),
            className,
          )}
          aria-invalid={actualValidation === 'error'}
          aria-describedby={hasMessage ? messageId : undefined}
          required={required}
          {...props}
        />
        
        {/* Helper / Error / Success Message */}
        {hasMessage && (
          <p
            id={messageId}
            className={cn(
              'text-xs',
              actualValidation === 'error' && 'text-error-500',
              actualValidation === 'success' && 'text-success-500',
              actualValidation !== 'error' && actualValidation !== 'success' && 'text-fg-muted',
            )}
            role={actualValidation === 'error' ? 'alert' : undefined}
          >
            {errorMessage || successMessage || helperText}
          </p>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
