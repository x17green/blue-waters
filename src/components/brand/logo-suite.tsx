/**
 * Bayelsa Boat Club Brand Logo Component Suite
 * 
 * Partnership Branding: AstroMANIA Enterprises x Bayelsa State Government
 * 
 * Usage Guidelines:
 * - Bayelsa Coat of Arms: Homepage header (left), official documents
 * - Ministry Blue Economy Seal: Homepage header (right), footer
 * - Bayelsa Boat Club Wordmark: Center branding with official SVG emblem
 * 
 * Legal:
 * - Government seals remain property of Bayelsa State Government
 * - Used for partnership identification per co-branding agreement
 * 
 * @see docs/branding.md
 */

import Image from 'next/image';
import { cn } from '@/src/lib/utils';

/* ============================================================================
   SIZE CONFIGURATIONS
   ============================================================================ */
const LOGO_SIZES = {
  xs: { width: 40, height: 40 },
  sm: { width: 60, height: 60 },
  md: { width: 80, height: 80 },
  lg: { width: 120, height: 120 },
  xl: { width: 150, height: 150 },
} as const;

type LogoSize = keyof typeof LOGO_SIZES;

interface LogoProps {
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

/* ============================================================================
   BAYELSA STATE GOVERNMENT COAT OF ARMS
   ============================================================================ */
/**
 * Bayelsa State Government Official Coat of Arms
 * 
 * Features: Leopard, Oil Rig, Palm Tree, Dolphin, Rainbow
 * Motto: "Truth, Justice and Service"
 * 
 * @example
 * <BayelsaCoatOfArms size="lg" />
 * 
 * Placement:
 * - Homepage header (left position)
 * - Official documents
 * - Partnership materials
 */
export function BayelsaCoatOfArms({ 
  size = 'md', 
  className,
  priority = false 
}: LogoProps) {
  const dimensions = LOGO_SIZES[size];
  
  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <Image
        src="/assets/logos/bayelsa-coat-of-arms.png"
        alt="Bayelsa State Government Coat of Arms"
        width={dimensions.width}
        height={dimensions.height}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}

/* ============================================================================
   MINISTRY OF MARINE AND BLUE ECONOMY SEAL
   ============================================================================ */
/**
 * Ministry of Marine and Blue Economy Official Seal
 * 
 * Features: Boat, Waves, "BLUE ECONOMY. BAYELSA'S FUTURE" text
 * Represents: State's Blue Economy initiative and marine heritage
 * 
 * @example
 * <MinistryBlueSeal size="md" />
 * 
 * Placement:
 * - Homepage header (right position)
 * - Footer
 * - About section
 * - Ministry partnership pages
 */
export function MinistryBlueSeal({ 
  size = 'md', 
  className,
  priority = false 
}: LogoProps) {
  const dimensions = LOGO_SIZES[size];
  
  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      <Image
        src="/assets/logos/ministry-blue-economy-seal.png"
        alt="Ministry of Marine and Blue Economy"
        width={dimensions.width}
        height={dimensions.height}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}

/* ============================================================================
  Bayelsa Boat Club WORDMARK
   ============================================================================ */
/**
 * Bayelsa Boat Club Brand Wordmark
 * 
 * Features: Official SVG emblem with boat, waves, and circular design
 * Design: Simple, clean emblem that scales well at all sizes
 * 
 * @example
 * <BlueWatersWordmark />
 * <BlueWatersWordmark size="sm" showText={false} />
 * 
 * Placement:
 * - Homepage hero (center)
 * - Mobile app splash screen
 * - Brand materials
 * - Navigation headers
 */
export function BlueWatersWordmark({ 
  size = 'lg', 
  className,
  showText = true,
  priority = false,
  subTextClassName,
}: Omit<LogoProps, 'priority'> & { showText?: boolean; priority?: boolean; subTextClassName?: string }) {
  const dimensions = LOGO_SIZES[size];
  
  return (
    <div 
      className={cn(
        "relative flex items-center gap-3",
        showText ? "flex-row" : "justify-center",
        className
      )}
    >
      {/* Bayelsa Boat Club SVG Emblem */}
      <div 
        className="relative flex-shrink-0"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <Image
          src="/assets/logos/blue-waters-symbol.svg"
          alt="Bayelsa Boat Club Emblem"
          width={dimensions.width}
          height={dimensions.height}
          priority={priority}
          className="object-contain"
        />
      </div>
      
      {/* Wordmark Text (optional) */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={cn(
              "font-extrabold text-fg tracking-tight",
              size === 'xs' && "text-sm",
              size === 'sm' && "text-base",
              size === 'md' && "text-xl",
              size === 'lg' && "text-2xl",
              size === 'xl' && "text-3xl",
              className // <-- forward parent className here
            )}
          >
            Bayelsa Boat Club
          </span>
          <span 
            className={cn(
              "text-fg-muted font-marketing tracking-wide",
              size === 'xs' && "text-xs",
              size === 'sm' && "text-xs",
              (size === 'md' || size === 'lg' || size === 'xl') && "text-sm",
              subTextClassName // <-- forward parent subTextClassName here
            )}
          >
            Ministry of Marine and Blue Economy
          </span>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   PARTNERSHIP HEADER LOGO SUITE
   ============================================================================ */
/**
 * Complete Partnership Logo Header
 * 
 * Displays all three institutional logos in brand-specified configuration:
 * [Bayelsa Coat] --- [Bayelsa Boat Club Wordmark] --- [Ministry Seal]
 * 
 * @example
 * <PartnershipLogoHeader />
 * 
 * Usage:
 * - Homepage header
 * - Official landing pages
 * - Press materials
 */
interface PartnershipLogoHeaderProps {
  className?: string;
  logoSize?: LogoSize;
  layout?: 'horizontal' | 'stacked';
}

export function PartnershipLogoHeader({ 
  className,
  logoSize = 'md',
  layout = 'horizontal'
}: PartnershipLogoHeaderProps) {
  if (layout === 'stacked') {
    return (
      <div className={cn("flex flex-col items-center gap-6", className)}>
        <BlueWatersWordmark size={logoSize} />
        <div className="flex items-center gap-8">
          <BayelsaCoatOfArms size={logoSize} priority />
          <MinistryBlueSeal size={logoSize} priority />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between gap-8 w-full max-w-7xl mx-auto px-6", className)}>
      <BayelsaCoatOfArms size={logoSize} priority />
      <BlueWatersWordmark size={logoSize} />
      <MinistryBlueSeal size={logoSize} priority />
    </div>
  );
}

/* ============================================================================
   FOOTER LOGO SUITE
   ============================================================================ */
/**
 * Footer Logo Configuration
 * 
 * Displays Ministry seal with partnership caption
 * 
 * @example
 * <FooterLogoSuite />
 */
interface FooterLogoSuiteProps {
  className?: string;
}

export function FooterLogoSuite({ className }: FooterLogoSuiteProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <MinistryBlueSeal size="sm" />
      <p className="text-xs text-fg-muted text-center max-w-xs">
        The Bayelsa Boat Club is a division of the < br /> Ministry of Marine and Blue Economy <br /> Bayelsa State - Nigeria.
      </p>
    </div>
  );
}
