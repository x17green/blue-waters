import * as React from 'react'

import { ButtonProps, buttonVariants } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiChevronLeft, mdiChevronRight, mdiDotsHorizontal } from '@mdi/js'

/**
 * Pagination Component - Bayelsa Boat Club Design System
 * 
 * Glassmorphism-enhanced pagination with design token integration.
 * Uses migrated Button component variants for consistent styling.
 * Full WCAG AA compliance with keyboard navigation and screen reader support.
 * 
 * @accessibility
 * - nav element with role="navigation" and aria-label="pagination"
 * - aria-current="page" on active page
 * - aria-label on Previous/Next buttons
 * - Keyboard navigable (Tab, Enter)
 * - Screen reader friendly ellipsis indicators
 * 
 * @example
 * ```tsx
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious href="#" />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="#" isActive>1</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="#">2</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationNext href="#" />
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 * ```
 */

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size' | 'variant'> &
  React.ComponentProps<'a'>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  variant,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'primary' : variant ?? 'ghost',
        size,
      }),
      // Active state enhancements
      isActive && [
        'ring-2 ring-accent-400/30',
        'ring-offset-2 ring-offset-bg-950',
      ],
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    variant="glass"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <Icon path={mdiChevronLeft} size={0.6} aria-hidden={true} />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    variant="glass"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <Icon path={mdiChevronRight} size={0.6} aria-hidden={true} />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'flex h-9 w-9 items-center justify-center',
      'text-fg-muted',
      className,
    )}
    {...props}
  >
    <Icon path={mdiDotsHorizontal} size={0.6} aria-hidden={true} />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
