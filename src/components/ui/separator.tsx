'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Separator Variants using CVA
 * 
 * Glassmorphism dividers with semantic variants
 */
const separatorVariants = cva(
  ['shrink-0', 'transition-colors'],
  {
    variants: {
      variant: {
        default: ['bg-border-default'],
        subtle: ['bg-border-subtle'],
        emphasis: ['bg-border-emphasis'],
        glass: ['bg-glass-02', 'backdrop-blur-subtle'],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {
  variant?: 'default' | 'subtle' | 'emphasis' | 'glass'
  thickness?: 'thin' | 'medium' | 'thick'
  orientation?: 'horizontal' | 'vertical'
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative = true,
      variant = 'default',
      thickness = 'thin',
      ...props
    },
    ref,
  ) => {
    // Calculate thickness based on orientation and thickness prop
    const thicknessClasses = {
      horizontal: {
        thin: 'h-px w-full',
        medium: 'h-0.5 w-full',
        thick: 'h-1 w-full',
      },
      vertical: {
        thin: 'h-full w-px',
        medium: 'h-full w-0.5',
        thick: 'h-full w-1',
      },
    }

    const thicknessClass = thicknessClasses[orientation][thickness]

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          separatorVariants({ variant }),
          thicknessClass,
          className,
        )}
        {...props}
      />
    )
  },
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
