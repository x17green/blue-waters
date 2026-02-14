/**
 * Carousel - Embla Carousel integration with navigation
 * 
 * Built on Embla Carousel with glassmorphism design system.
 * Responsive image/content carousel with arrow navigation and keyboard support.
 * Integrates with migrated Button component for navigation arrows.
 * 
 * @example
 * ```tsx
 * import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
 * 
 * function ImageCarousel() {
 *   return (
 *     <Carousel className="w-full max-w-xs">
 *       <CarouselContent>
 *         <CarouselItem>
 *           <div className="p-1">
 *             <img src="/image1.jpg" alt="Slide 1" className="rounded-lg" />
 *           </div>
 *         </CarouselItem>
 *         <CarouselItem>
 *           <div className="p-1">
 *             <img src="/image2.jpg" alt="Slide 2" className="rounded-lg" />
 *           </div>
 *         </CarouselItem>
 *         <CarouselItem>
 *           <div className="p-1">
 *             <img src="/image3.jpg" alt="Slide 3" className="rounded-lg" />
 *           </div>
 *         </CarouselItem>
 *       </CarouselContent>
 *       <CarouselPrevious />
 *       <CarouselNext />
 *     </Carousel>
 *   )
 * }
 * 
 * // With custom options
 * function AutoplayCarousel() {
 *   return (
 *     <Carousel
 *       opts={{
 *         align: 'start',
 *         loop: true,
 *       }}
 *       className="w-full max-w-sm"
 *     >
 *       <CarouselContent>
 *         {Array.from({ length: 5 }).map((_, index) => (
 *           <CarouselItem key={index}>
 *             <Card>
 *               <CardContent className="flex aspect-square items-center justify-center p-6">
 *                 <span className="text-4xl font-semibold">{index + 1}</span>
 *               </CardContent>
 *             </Card>
 *           </CarouselItem>
 *         ))}
 *       </CarouselContent>
 *       <CarouselPrevious />
 *       <CarouselNext />
 *     </Carousel>
 *   )
 * }
 * ```
 * 
 * @features
 * - Smooth horizontal/vertical scrolling with Embla
 * - Arrow navigation buttons (Previous/Next)
 * - Keyboard navigation (ArrowLeft/ArrowRight)
 * - Responsive and mobile-friendly
 * - Loop and autoplay support via options
 * - Touch/swipe gestures on mobile
 * - Custom slide alignment
 * - API access for programmatic control
 * 
 * @accessibility
 * - ARIA carousel landmark
 * - ARIA slide role on each item
 * - Screen reader announcements
 * - Keyboard navigation support
 * - Disabled state for navigation buttons
 * 
 * @components
 * - Carousel: Container with context provider
 * - CarouselContent: Viewport for slides
 * - CarouselItem: Individual slide wrapper
 * - CarouselPrevious: Previous slide button (uses Button outline variant)
 * - CarouselNext: Next slide button (uses Button outline variant)
 */
'use client'

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react'
import * as React from 'react'

import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'
import { Icon } from '@/src/components/ui/icon'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext],
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on('reInit', onSelect)
      api.on('select', onSelect)

      return () => {
        api?.off('select', onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  },
)
Carousel.displayName = 'Carousel'

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className,
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute  h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-left-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <Icon path={mdiChevronLeft} size={0.6} aria-hidden={true} />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-8 w-8 rounded-full',
        orientation === 'horizontal'
          ? '-right-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <Icon path={mdiChevronRight} size={0.6} aria-hidden={true} />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = 'CarouselNext'

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
