import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Breadcrumb Component - Blue Waters Design System
 * 
 * Glassmorphism-enhanced breadcrumb navigation with design token integration.
 * Provides hierarchical navigation with semantic HTML and full WCAG AA compliance.
 * 
 * @accessibility
 * - nav element with aria-label="breadcrumb"
 * - Proper semantic list structure (ol > li)
 * - aria-current="page" on current page
 * - Screen reader friendly separators (aria-hidden)
 * - Keyboard navigable links
 * 
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current Page</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = 'Breadcrumb'

const breadcrumbListVariants = cva([
  'flex flex-wrap items-center',
  'gap-1.5 sm:gap-2.5',
  'break-words',
  'text-sm',
  'text-fg-muted',
])

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(breadcrumbListVariants(), className)}
    {...props}
  />
))
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
))
BreadcrumbItem.displayName = 'BreadcrumbItem'

const breadcrumbLinkVariants = cva([
  'transition-colors duration-200',
  'text-fg-muted',
  'hover:text-accent-400',
  'focus-visible:outline-none',
  'focus-visible:text-accent-300',
  'focus-visible:underline',
  'focus-visible:decoration-accent-400',
  'focus-visible:decoration-2',
  'focus-visible:underline-offset-4',
  'motion-reduce:transition-none',
])

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      ref={ref}
      className={cn(breadcrumbLinkVariants(), className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

const breadcrumbPageVariants = cva([
  'font-medium',
  'text-fg-DEFAULT',
])

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn(breadcrumbPageVariants(), className)}
    {...props}
  />
))
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(
      'text-fg-subtle',
      '[&>svg]:w-3.5 [&>svg]:h-3.5',
      className
    )}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      'flex h-9 w-9 items-center justify-center',
      'text-fg-subtle',
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  breadcrumbListVariants,
  breadcrumbLinkVariants,
  breadcrumbPageVariants,
}
