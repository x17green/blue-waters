'use client'

// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Card Variants using CVA
 * 
 * Glassmorphism dark-first design with layered depth
 */
const cardVariants = cva(
  [
    // Base styles - all variants
    'group relative',
    'rounded-lg overflow-hidden',
    'transition-all duration-normal',
    'font-medium',
  ],
  {
    variants: {
      variant: {
        // Primary - solid background with subtle glass overlay
        primary: [
          'bg-bg-800',
          'border border-border-default',
          'shadow-soft',
          'before:absolute before:inset-0',
          'before:bg-glass-01',
          'before:pointer-events-none',
          'hover:shadow-medium',
          'hover:border-border-emphasis',
          'hover:before:bg-glass-02',
        ],
        
        // Glass - full glassmorphism effect
        glass: [
          'bg-glass-02',
          'backdrop-blur-subtle',
          'motion-reduce:backdrop-blur-none',
          'border border-border-subtle',
          'shadow-glass',
          'hover:bg-glass-03',
          'hover:border-border-default',
          'hover:shadow-glass-emphasis',
        ],
        
        // Bordered - outline style with minimal background
        bordered: [
          'bg-bg-900/50',
          'border-2 border-border-default',
          'hover:border-accent-400',
          'hover:bg-bg-800/60',
          'hover:shadow-soft',
        ],
        
        // Flat - minimal style with subtle background
        flat: [
          'bg-bg-800/30',
          'border border-transparent',
          'hover:bg-bg-800/50',
          'hover:border-border-subtle',
        ],
        
        // Elevated - raised card with stronger shadow
        elevated: [
          'bg-bg-800',
          'border border-border-subtle',
          'shadow-medium',
          'before:absolute before:inset-0',
          'before:bg-glass-01',
          'before:pointer-events-none',
          'hover:shadow-large',
          'hover:-translate-y-0.5',
          'hover:before:bg-glass-02',
        ],
        
        // Interactive - for clickable cards
        interactive: [
          'bg-bg-800',
          'border border-border-default',
          'shadow-soft',
          'cursor-pointer',
          'before:absolute before:inset-0',
          'before:bg-glass-01',
          'before:pointer-events-none',
          'hover:shadow-medium',
          'hover:border-accent-400/50',
          'hover:before:bg-accent-900/10',
          'active:scale-[0.98]',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-accent-400/30',
          'focus-visible:ring-offset-4',
          'focus-visible:ring-offset-bg-950',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Visual variant of the card
   * @default 'primary'
   */
  variant?: 'primary' | 'glass' | 'bordered' | 'flat' | 'elevated' | 'interactive'
  
  /**
   * Whether card is clickable (enables interactive styles + keyboard nav)
   */
  isClickable?: boolean
  
  /**
   * Click handler for interactive cards
   */
  onPress?: () => void
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'primary', isClickable, onPress, ...props }, ref) => {
    // Use interactive variant if card is clickable
    const computedVariant = isClickable ? 'interactive' : variant
    
    const handleClick = React.useCallback(() => {
      if (isClickable && onPress) {
        onPress()
      }
    }, [isClickable, onPress])
    
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleClick()
        }
      },
      [isClickable, handleClick],
    )
    
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant: computedVariant }), className)}
        onClick={isClickable ? handleClick : undefined}
        onKeyDown={isClickable ? handleKeyDown : undefined}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'

/**
 * Card Header - contains title and description
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative z-10 flex flex-col space-y-1.5 p-6',
      'text-fg',
      className,
    )}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

/**
 * Card Title - main heading for the card
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      'text-fg',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

/**
 * Card Description - subheading or description text
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-fg-muted', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

/**
 * Card Content - main content area
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative z-10 p-6 pt-0 text-fg-muted', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

/**
 * Card Footer - actions or metadata
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative z-10 flex items-center p-6 pt-0',
      'text-fg-muted',
      className,
    )}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }

