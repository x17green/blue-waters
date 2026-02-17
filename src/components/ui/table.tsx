import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'

/**
 * Table Component - Bayelsa Boat Club Design System
 * 
 * Glassmorphism-enhanced data table with design token integration.
 * Supports multiple variants, semantic states, and full WCAG AA compliance.
 * 
 * @accessibility
 * - Semantic table structure (table, thead, tbody, tfoot)
 * - Caption support for table descriptions
 * - Keyboard navigable rows
 * - aria-sort support for sortable columns
 * - Screen reader friendly column headers
 * - Zebra striping for readability
 * 
 * @example
 * ```tsx
 * <Table variant="glass">
 *   <TableCaption>User accounts</TableCaption>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Email</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John Doe</TableCell>
 *       <TableCell>john@example.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */

const tableVariants = cva(
  [
    'w-full',
    'caption-bottom',
    'text-sm',
    'text-fg-DEFAULT',
  ],
  {
    variants: {
      variant: {
        default: '',
        glass: [
          'backdrop-blur-base',
          'bg-glass-02',
          'border border-border-subtle',
          'rounded-lg',
          'overflow-hidden',
        ],
        bordered: [
          'border border-border-default',
          'rounded-lg',
        ],
        striped: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(tableVariants({ variant }), className)}
        {...props}
      />
    </div>
  ),
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      'border-b border-border-default',
      '[&_tr]:border-b',
      className,
    )} 
    {...props} 
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      '[&_tr:last-child]:border-0',
      // Zebra striping for better readability
      '[&_tr:nth-child(even)]:bg-glass-01',
      className,
    )}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-border-default',
      'bg-glass-02',
      'font-medium',
      '[&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const tableRowVariants = cva(
  [
    'border-b border-border-subtle',
    'transition-colors duration-200',
    'motion-reduce:transition-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'hover:bg-glass-01',
          'data-[state=selected]:bg-accent-900/20',
          'data-[state=selected]:border-accent-600/30',
        ],
        glass: [
          'hover:bg-glass-02',
          'data-[state=selected]:bg-glass-03',
          'data-[state=selected]:border-accent-400/40',
        ],
        interactive: [
          'cursor-pointer',
          'hover:bg-glass-02',
          'hover:border-accent-600/30',
          'active:bg-glass-03',
          'focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-accent-400/30',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-bg-950',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(tableRowVariants({ variant }), className)}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4',
      'text-left align-middle',
      'font-semibold',
      'text-fg-muted',
      'bg-glass-01',
      '[&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle',
      'text-fg-DEFAULT',
      '[&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      'mt-4',
      'text-sm',
      'text-fg-muted',
      className,
    )}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
  tableRowVariants,
}
