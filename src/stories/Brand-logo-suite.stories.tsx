/**
 * Bayelsa Boat Club Brand Logo Components
 * 
 * Official partnership branding between AstroMANIA Enterprises and
 * Bayelsa State Government / Ministry of Marine and Blue Economy
 * 
 * @see docs/branding.md
 */

import type { Meta, StoryObj } from '@storybook/react';
import {
  BayelsaCoatOfArms,
  MinistryBlueSeal,
  BlueWatersWordmark,
  PartnershipLogoHeader,
  FooterLogoSuite,
} from '@/src/components/brand/logo-suite';

const meta = {
  title: 'Brand/Logo Suite',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Partnership Branding

Bayelsa Boat Club represents the official digital platform developed by **AstroMANIA Enterprises** 
in partnership with the **Bayelsa State Government** and the **Ministry of Marine and Blue Economy**.

### Logo Usage

- **Bayelsa Coat of Arms**: Homepage header (left), official documents
- **Ministry Blue Economy Seal**: Homepage header (right), footer sections  
- **Bayelsa Boat Club Wordmark**: Center branding with official SVG emblem

### Bayelsa Boat Club Emblem

The Bayelsa Boat Club wordmark features a clean, professional SVG emblem with:

- **Circular design** with Deep Ocean Blue background
- **Boat silhouette** representing marine transportation
- **Wave elements** with gradient flow symbolizing water
- **Scalable vector graphics** for crisp rendering at all sizes

The emblem is designed for versatility across digital and print media, app icons, 
and social media profiles while maintaining brand consistency.

### Legal Notice

Government seals remain the intellectual property of Bayelsa State Government and are used 
for partnership identification per co-branding agreement.

### Design System

All logos follow the glassmorphism design language with Deep Ocean Blue backgrounds 
and Muted Teal accents per branding.md specification.
        `,
      },
    },
  },
  tags: ['autodocs', 'brand', 'logo'],
} satisfies Meta;

export default meta;

/* ============================================================================
   BAYELSA STATE GOVERNMENT COAT OF ARMS
   ============================================================================ */
type BayelsaStory = StoryObj<typeof BayelsaCoatOfArms>;

export const BayelsaSmall: BayelsaStory = {
  name: 'Bayelsa Coat of Arms - Small',
  render: () => <BayelsaCoatOfArms size="sm" />,
  parameters: {
    docs: {
      description: {
        story: 'Small size (60x60) - for compact headers or mobile views',
      },
    },
  },
};

export const BayelsaMedium: BayelsaStory = {
  name: 'Bayelsa Coat of Arms - Medium',
  render: () => <BayelsaCoatOfArms size="md" />,
  parameters: {
    docs: {
      description: {
        story: 'Medium size (80x80) - default size for desktop headers',
      },
    },
  },
};

export const BayelsaLarge: BayelsaStory = {
  name: 'Bayelsa Coat of Arms - Large',
  render: () => <BayelsaCoatOfArms size="lg" />,
  parameters: {
    docs: {
      description: {
        story: 'Large size (120x120) - for hero sections or feature displays',
      },
    },
  },
};

/* ============================================================================
   MINISTRY OF MARINE AND BLUE ECONOMY SEAL
   ============================================================================ */
type MinistryStory = StoryObj<typeof MinistryBlueSeal>;

export const MinistrySmall: MinistryStory = {
  name: 'Ministry Seal - Small',
  render: () => <MinistryBlueSeal size="sm" />,
  parameters: {
    docs: {
      description: {
        story: 'Small size (60x60) - for footer or sidebar usage',
      },
    },
  },
};

export const MinistryMedium: MinistryStory = {
  name: 'Ministry Seal - Medium',
  render: () => <MinistryBlueSeal size="md" />,
  parameters: {
    docs: {
      description: {
        story: 'Medium size (80x80) - default size for header placement',
      },
    },
  },
};

export const MinistryLarge: MinistryStory = {
  name: 'Ministry Seal - Large',
  render: () => <MinistryBlueSeal size="lg" />,
  parameters: {
    docs: {
      description: {
        story: 'Large size (120x120) - for about page or institutional sections',
      },
    },
  },
};

/* ============================================================================
  Bayelsa Boat Club WORDMARK
   ============================================================================ */
type WordmarkStory = StoryObj<typeof BlueWatersWordmark>;

export const WordmarkSmall: WordmarkStory = {
  name: 'Bayelsa Boat Club Wordmark - Small',
  render: () => <BlueWatersWordmark size="sm" showText />,
  parameters: {
    docs: {
      description: {
        story: 'Small wordmark with SVG emblem (60px) - Compact version for mobile headers and sidebars',
      },
    },
  },
};

export const WordmarkMedium: WordmarkStory = {
  name: 'Bayelsa Boat Club Wordmark - Medium',
  render: () => <BlueWatersWordmark size="md" showText />,
  parameters: {
    docs: {
      description: {
        story: 'Medium wordmark with SVG emblem (80px) - Default size for desktop headers',
      },
    },
  },
};

export const WordmarkLarge: WordmarkStory = {
  name: 'Bayelsa Boat Club Wordmark - Large',
  render: () => <BlueWatersWordmark size="lg" showText />,
  parameters: {
    docs: {
      description: {
        story: 'Large wordmark with SVG emblem (120px) - For hero sections and feature areas',
      },
    },
  },
};

export const WordmarkExtraLarge: WordmarkStory = {
  name: 'Bayelsa Boat Club Wordmark - Extra Large',
  render: () => <BlueWatersWordmark size="xl" showText />,
  parameters: {
    docs: {
      description: {
        story: 'Extra large wordmark (150px) - Premium presentation for splash screens and marketing',
      },
    },
  },
};

export const WordmarkEmblemOnly: WordmarkStory = {
  name: 'Bayelsa Boat Club Emblem Only',
  render: () => <BlueWatersWordmark size="lg" showText={false} />,
  parameters: {
    docs: {
      description: {
        story: 'SVG emblem without text - For app icons, favicons, and minimal branding contexts',
      },
    },
  },
};

/* ============================================================================
   PARTNERSHIP LOGO CONFIGURATIONS
   ============================================================================ */
type PartnershipStory = StoryObj<typeof PartnershipLogoHeader>;

export const PartnershipHeaderHorizontal: PartnershipStory = {
  name: 'Partnership Header - Horizontal',
  render: () => (
    <div className="w-full min-w-[800px] bg-bg-900 p-8 rounded-lg">
      <PartnershipLogoHeader layout="horizontal" logoSize="md" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full horizontal layout - Desktop homepage header configuration',
      },
    },
  },
};

export const PartnershipHeaderStacked: PartnershipStory = {
  name: 'Partnership Header - Stacked',
  render: () => (
    <div className="w-full bg-bg-900 p-8 rounded-lg">
      <PartnershipLogoHeader layout="stacked" logoSize="sm" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Stacked layout - Mobile or narrow viewport configuration',
      },
    },
  },
};

/* ============================================================================
   FOOTER LOGO SUITE
   ============================================================================ */
type FooterStory = StoryObj<typeof FooterLogoSuite>;

export const FooterConfiguration: FooterStory = {
  name: 'Footer Logo Suite',
  render: () => (
    <div className="w-full bg-bg-800 p-8 rounded-lg">
      <FooterLogoSuite />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Footer configuration with Ministry seal and partnership caption',
      },
    },
  },
};

/* ============================================================================
   COMPLETE SHOWCASE
   ============================================================================ */
export const CompleteShowcase: StoryObj = {
  name: 'Complete Brand System',
  render: () => (
    <div className="space-y-12 min-w-[900px]">
      {/* Header */}
      <section className="bg-bg-900 p-8 rounded-xl border border-border-subtle">
        <h3 className="text-fg-muted text-sm uppercase tracking-wider mb-6">
          Homepage Header
        </h3>
        <PartnershipLogoHeader layout="horizontal" logoSize="md" />
      </section>

      {/* Individual Logos */}
      <section className="bg-bg-800 p-8 rounded-xl border border-border-subtle">
        <h3 className="text-fg-muted text-sm uppercase tracking-wider mb-6">
          Individual Logo Sizes
        </h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-fg-muted">Small (60px)</p>
            <BayelsaCoatOfArms size="sm" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-fg-muted">Medium (80px)</p>
            <BayelsaCoatOfArms size="md" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-fg-muted">Large (120px)</p>
            <BayelsaCoatOfArms size="lg" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-bg-800 p-8 rounded-xl border border-border-subtle">
        <h3 className="text-fg-muted text-sm uppercase tracking-wider mb-6">
          Footer Configuration
        </h3>
        <FooterLogoSuite />
      </section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete brand system showcase with all logo configurations',
      },
    },
  },
};
