'use client'

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'

/**
 * AspectRatio - Container that maintains a specific aspect ratio.
 *
 * @description
 * A wrapper component that ensures its content maintains a consistent aspect ratio.
 * Useful for responsive images, videos, and embedded content.
 *
 * @example
 * ```tsx
 * // 16:9 video container
 * <AspectRatio ratio={16 / 9} className="bg-glass-01 rounded-lg overflow-hidden">
 *   <img
 *     src="/thumbnail.jpg"
 *     alt="Video thumbnail"
 *     className="object-cover w-full h-full"
 *   />
 * </AspectRatio>
 * ```
 *
 * @example
 * ```tsx
 * // Square profile image (1:1)
 * <AspectRatio ratio={1} className="rounded-full overflow-hidden">
 *   <Avatar src="/profile.jpg" />
 * </AspectRatio>
 * ```
 *
 * @example
 * ```tsx
 * // Cinematic 21:9 banner
 * <AspectRatio ratio={21 / 9}>
 *   <video src="/hero.mp4" autoPlay loop muted className="object-cover" />
 * </AspectRatio>
 * ```
 *
 * @see {@link https://www.radix-ui.com/docs/primitives/components/aspect-ratio | Radix UI AspectRatio}
 */
const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
