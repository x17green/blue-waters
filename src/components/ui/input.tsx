import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'


import { cn } from '@/src/lib/utils'

/**
 * Blue Waters Input Component
 * 
 * Glassmorphism dark-first design with accessibility features.
 * Design Source: docs/design-architecture.md#8-component-system
 * Token Source: src/design-system/tokens.ts
 * 
 * Features:
 * - Glassmorphism effects with backdrop blur
 * - Dark matte theme with conservative palette
 * - Full keyboard navigation and focus management
 * - ARIA attributes for screen readers
 * - Validation states (default, success, error, warning)
 * - Icon support (startIcon, endIcon)
 * - Loading state
 * - Label and helper text support
 */

const inputVariants = cva(
  [
    // Base styles
    'group relative w-full flex items-center',
    'font-medium transition-all duration-normal',
    'rounded-md overflow-hidden',
    
    // Typography
    'text-sm leading-tight',
    
    // Focus management (WCAG 2.4.7)
    'focus-within:ring-2 focus-within:ring-accent-400',
    'focus-within:ring-offset-2 focus-within:ring-offset-bg-900',
    
    // Disabled state
    'has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50',
    
    // Icon sizing
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        // Primary: Solid dark with glass reflection
        primary: [
          'bg-bg-800 border border-border-default',
          'shadow-soft',
          
          // Glass overlay
          'before:absolute before:inset-0 before:pointer-events-none',
          'before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent',
          'before:opacity-100 before:transition-opacity',
          
          // Hover state
          'hover:bg-bg-700 hover:border-border-emphasis',
          'hover:shadow-medium hover:before:opacity-80',
          
          // Focus state
          'focus-within:bg-bg-700 focus-within:border-accent-400/50',
        ],
        
        // Glass: Semi-transparent with backdrop blur
        glass: [
          'bg-glass-02 backdrop-blur-subtle saturate-100',
          'border border-accent-800/30',
          'shadow-soft',
          
          // Glass overlay
          'before:absolute before:inset-0 before:pointer-events-none',
          'before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent',
          
          // Hover state
          'hover:bg-glass-03 hover:border-accent-700/40',
          'hover:shadow-medium',
          
          // Focus state
          'focus-within:bg-glass-03 focus-within:border-accent-400/60',
        ],
        
        // Bordered: Outline with subtle fill
        bordered: [
          'bg-bg-900/50 border-2 border-border-default',
          
          // Hover state
          'hover:bg-bg-800/50 hover:border-border-emphasis',
          
          // Focus state
          'focus-within:bg-bg-800/50 focus-within:border-accent-400',
        ],
        
        // Flat: Minimal with no border
        flat: [
          'bg-bg-800/30',
          'border border-transparent',
          
          // Hover state
          'hover:bg-bg-800/50',
          
          // Focus state
          'focus-within:bg-bg-800/70 focus-within:border-accent-400/30',
        ],
      },
      
      size: {
        sm: [
          'h-8',
          'px-2.5',
          'text-xs',
          'gap-1.5',
          '[&_svg]:size-3.5',
        ],
        md: [
          'h-10',
          'px-3',
          'text-sm',
          'gap-2',
          '[&_svg]:size-4',
        ],
        lg: [
          'h-12',
          'px-4',
          'text-base',
          'gap-2.5',
          '[&_svg]:size-5',
        ],
      },
      
      validation: {
        default: '',
        success: [
          'border-success-500/50',
          'focus-within:border-success-400',
          'focus-within:ring-success-400',
        ],
        error: [
          'border-error-500/50',
          'focus-within:border-error-400',
          'focus-within:ring-error-400',
        ],
        warning: [
          'border-warning-500/50',
          'focus-within:border-warning-400',
          'focus-within:ring-warning-400',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      validation: 'default',
    },
  },
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Icon to display before input
   */
  startIcon?: React.ReactNode
  
  /**
   * Icon to display after input
   */
  endIcon?: React.ReactNode
  
  /**
   * Loading state with spinner
   */
  isLoading?: boolean
  
  /**
   * Label for the input
   */
  label?: string
  
  /**
   * Helper text below input
   */
  helperText?: string
  
  /**
   * Error message (sets validation to error automatically)
   */
  errorMessage?: string
  
  /**
   * Success message (sets validation to success automatically)
   */
  successMessage?: string
  
  /**
   * Wrapper className for label + input + helper text container
   */
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      validation,
      startIcon,
      endIcon,
      isLoading = false,
      label,
      helperText,
      errorMessage,
      successMessage,
      wrapperClassName,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    // Auto-generate ID if label provided
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
    
    // Auto-set validation state based on messages
    const effectiveValidation = errorMessage ? 'error' : successMessage ? 'success' : validation
    
    // Combine disabled states
    const isDisabled = disabled || isLoading
    
    // Detect user's motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    const inputElement = (
      <div
        className={cn(
          inputVariants({
            variant,
            size,
            validation: effectiveValidation,
          }),
          className,
        )}
      >
        {/* Start icon */}
        {startIcon && !isLoading && (
          <span className="flex items-center justify-center text-fg-subtle" aria-hidden={true}>
            {startIcon}
          </span>
        )}
        
        {/* Loading spinner */}
        {isLoading && (
          <span
            className="flex items-center justify-center text-accent-400"
            aria-hidden={true}
          >
            <svg
              className={cn(
                'size-4 animate-spin',
                prefersReducedMotion && 'animate-none',
              )}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        
        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'flex-1 bg-transparent',
            'text-fg placeholder:text-fg-subtle',
            'outline-none',
            'disabled:cursor-not-allowed',
          )}
          disabled={isDisabled}
          aria-invalid={effectiveValidation === 'error'}
          aria-describedby={
            errorMessage || successMessage || helperText
              ? `${inputId}-message`
              : undefined
          }
          {...props}
        />
        
        {/* End icon */}
        {endIcon && !isLoading && (
          <span className="flex items-center justify-center text-fg-subtle" aria-hidden={true}>
            {endIcon}
          </span>
        )}
      </div>
    )
    
    // If no label/helper text, return just the input
    if (!label && !helperText && !errorMessage && !successMessage) {
      return inputElement
    }
    
    // Return full input group with label and helper text
    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-fg',
              isDisabled && 'opacity-50',
            )}
          >
            {label}
            {props.required && (
              <span className="ml-1 text-error-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        {/* Input */}
        {inputElement}
        
        {/* Helper text / Error message / Success message */}
        {(errorMessage || successMessage || helperText) && (
          <p
            id={`${inputId}-message`}
            className={cn(
              'text-xs',
              errorMessage && 'text-error-500',
              successMessage && 'text-success-500',
              !errorMessage && !successMessage && 'text-fg-muted',
            )}
            role={errorMessage ? 'alert' : undefined}
          >
            {errorMessage || successMessage || helperText}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input, inputVariants }

