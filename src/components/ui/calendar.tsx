'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { buttonVariants } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

/**
 * Calendar - Date picker component using react-day-picker.
 *
 * @description
 * A fully featured calendar/date picker component with month/year navigation.
 * Built on react-day-picker with glassmorphism design and Button component integration.
 *
 * Features:
 * - Single or range date selection
 * - Month and year navigation
 * - Keyboard accessible (Arrow keys, Enter, Space)
 * - Glassmorphism design tokens
 * - Disabled dates support
 * - Outside days display
 * - Custom day rendering
 *
 * @example
 * ```tsx
 * // Single date selection
 * const [date, setDate] = React.useState<Date | undefined>(new Date())
 *
 * <Calendar
 *   mode="single"
 *   selected={date}
 *   onSelect={setDate}
 *   className="rounded-md border border-glass"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Date range selection
 * const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
 *
 * <Calendar
 *   mode="range"
 *   selected={dateRange}
 *   onSelect={setDateRange}
 *   numberOfMonths={2}
 * />
 * ```
 *
 * @see {@link https://react-day-picker.js.org | react-day-picker Documentation}
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-fg-muted rounded-md w-9 font-normal text-xs',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent-900/20 [&:has([aria-selected])]:bg-accent-900/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-accent-500 text-white hover:bg-accent-600 hover:text-white focus:bg-accent-500 focus:text-white',
        day_today: 'bg-glass-02 text-fg-DEFAULT ring-2 ring-accent-400/30',
        day_outside:
          'day-outside text-fg-subtle aria-selected:bg-accent-900/20 aria-selected:text-fg-muted',
        day_disabled: 'text-fg-subtle opacity-50',
        day_range_middle:
          'aria-selected:bg-accent-900/20 aria-selected:text-fg-DEFAULT',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <Icon path={mdiChevronLeft} size={0.6} aria-hidden={true} />,
        IconRight: ({ ..._props }) => <Icon path={mdiChevronRight} size={0.6} aria-hidden={true} />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
