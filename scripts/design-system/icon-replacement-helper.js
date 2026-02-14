/**
 * Icon Replacement Helper Script
 * Converts lucide-react icons to @mdi/react Icon components
 */

const iconMappings = {
  // Lucide → MDI mappings
  Clock: 'mdiClock',
  MapPin: 'mdiMapMarker',
  Star: 'mdiStar',
  Users: 'mdiAccountGroup',
  ArrowRight: 'mdiArrowRight',
  CheckCircle2: 'mdiCheckCircle',
  AlertCircle: 'mdiAlertCircle',
  Ship: 'mdiFerry',
  Calendar: 'mdiCalendar',
  Info: 'mdiInformation',
  ChevronLeft: 'mdiChevronLeft',
  Search: 'mdiMagnify',
  Ticket: 'mdiTicket',
  Download: 'mdiDownload',
  Share2: 'mdiShare',
  Phone: 'mdiPhone',
  Mail: 'mdiEmail',
  QrCode: 'mdiQrcode',
  Printer: 'mdiPrinter',
  Shield: 'mdiShield',
}

// Icon size mappings based on common patterns
const sizeMap = {
  'h-4 w-4': 0.67,  // 16px
  'h-5 w-5': 0.83,  // 20px
  'h-6 w-6': 1,     // 24px
  'h-8 w-8': 1.33,  // 32px
  'h-10 w-10': 1.67, // 40px
  'h-12 w-12': 2,   // 48px
  'h-16 w-16': 2.67, // 64px
}

console.log('Icon Mappings:', iconMappings)
console.log('\nUsage Pattern:')
console.log('FROM: <Clock className="h-4 w-4 text-muted-foreground" />')
console.log('TO:   <Icon path={mdiClock} size={0.67} className="text-muted-foreground" aria-hidden={true} />')
console.log('\nNote: Remove h-* w-* sizing classes, use size prop instead')
