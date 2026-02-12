// eslint-disable-next-line import/named
import { cva, VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Skeleton Variants using CVA
 * 
 * Glassmorphism loading skeletons with animation
 */
const skeletonVariants = cva(
  [
    'rounded-md',
    'animate-pulse',
    'transition-all duration-normal',
  ],
  {
    variants: {
      variant: {
        default: ['bg-bg-800/80'],
        glass: ['bg-glass-02', 'backdrop-blur-subtle'],
        shimmer: [
          'bg-gradient-to-r',
          'from-bg-800/50 via-bg-700/50 to-bg-800/50',
          'bg-[length:200%_100%]',
          'animate-shimmer',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  variant?: 'default' | 'glass' | 'shimmer'
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Skeleton }
