'use client'

import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiClose } from '@mdi/js'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

/**
 * Toast Variants using CVA
 * 
 * Glassmorphism toasts with semantic color variants
 */
const toastVariants = cva(
  [
    'group pointer-events-auto relative',
    'flex w-full items-center justify-between space-x-4',
    'overflow-hidden rounded-md p-6 pr-8',
    'shadow-large',
    'transition-all duration-normal',
    // Swipe and state animations
    'data-[swipe=cancel]:translate-x-0',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=move]:transition-none',
    'data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[swipe=end]:animate-out',
    'data-[state=closed]:fade-out-80',
    'data-[state=closed]:slide-out-to-right-full',
    'data-[state=open]:slide-in-from-top-full',
    'data-[state=open]:sm:slide-in-from-bottom-full',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-bg-800',
          'border border-border-default',
          'text-fg',
        ],
        glass: [
          'bg-glass-02',
          'backdrop-blur-base',
          'border border-border-subtle',
          'text-fg',
        ],
        success: [
          'bg-success-900/50',
          'border border-success-700/50',
          'text-success-300',
          'backdrop-blur-subtle',
        ],
        warning: [
          'bg-warning-900/50',
          'border border-warning-700/50',
          'text-warning-300',
          'backdrop-blur-subtle',
        ],
        error: [
          'bg-error-900/50',
          'border border-error-700/50',
          'text-error-300',
          'backdrop-blur-subtle',
        ],
        info: [
          'bg-info-900/50',
          'border border-info-700/50',
          'text-info-300',
          'backdrop-blur-subtle',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0',
      'items-center justify-center',
      'rounded-md px-3',
      // Glassmorphism
      'bg-glass-01',
      'border border-border-subtle',
      'backdrop-blur-subtle',
      // Text
      'text-sm font-medium',
      // Transitions
      'transition-colors',
      'hover:bg-glass-02',
      // Focus ring
      'focus:outline-none',
      'focus:ring-2 focus:ring-accent-400/30',
      'focus:ring-offset-2 focus:ring-offset-bg-800',
      // States
      'disabled:pointer-events-none disabled:opacity-50',
      // Semantic group variants
      'group-[.success]:border-success-700/30',
      'group-[.success]:hover:bg-success-900/30',
      'group-[.warning]:border-warning-700/30',
      'group-[.warning]:hover:bg-warning-900/30',
      'group-[.error]:border-error-700/30',
      'group-[.error]:hover:bg-error-900/30',
      'group-[.info]:border-info-700/30',
      'group-[.info]:hover:bg-info-900/30',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2',
      'rounded-md p-1',
      // Colors
      'text-fg-muted opacity-0',
      // Transitions
      'transition-opacity',
      'hover:text-fg',
      // Focus
      'focus:opacity-100',
      'focus:outline-none',
      'focus:ring-2 focus:ring-accent-400/30',
      // Group hover
      'group-hover:opacity-100',
      // Semantic variants
      'group-[.error]:text-error-300',
      'group-[.error]:hover:text-error-100',
      'group-[.error]:focus:ring-error-400',
      className,
    )}
    toast-close=""
    aria-label="Close"
    {...props}
  >
    <Icon path={mdiClose} size={0.6} aria-hidden={true} />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
