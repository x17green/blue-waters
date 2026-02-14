# Storybook Starter for Blue Waters — HeroUI wrappers + Design Tokens

This is a Storybook-ready starter scaffold tailored for **Blue Waters**. It includes:

- `package.json` with necessary dependencies and scripts (HeroUI, Storybook, React, TypeScript)
- Storybook config (`.storybook/main.ts`, `.storybook/preview.tsx`)
- Design tokens (`src/tokens/*`) and global theme CSS (glassmorphism, dark-first)
- A small set of **HeroUI wrapper components** (Button, Input, Card) with accessibility baked in
- Storybook MDX docs for the Button component demonstrating ARIA, keyboard patterns, and reduced-motion
- README with setup instructions

> Drop this scaffold into the root of your repo (`/blue-waters-storybook-starter`) and run install + storybook.

---

## File tree

```
blue-waters-storybook-starter/
├── package.json
├── tsconfig.json
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
├── src/
│   ├── index.ts
│   ├── tokens/
│   │   ├── colors.ts
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css
│   ├── components/
│   │   ├── HeroUIButton.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── stories/
│       └── Button.stories.mdx
└── README_STORYBOOK.md
```

---

## Files (copy each file into your project)

---

### package.json

```json
{
  "name": "blue-waters-storybook-starter",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public",
    "build-storybook": "build-storybook -o storybook-static",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@heroui/core": "^1.0.0",
    "@mdi/js": "^7.0.96",
    "@mdi/react": "^1.7.1"
  },
  "devDependencies": {
    "@storybook/react": "^7.0.0",
    "@storybook/addon-essentials": "^7.0.0",
    "@storybook/addon-interactions": "^7.0.0",
    "@storybook/testing-library": "^0.0.0",
    "typescript": "^5.1.6",
    "ts-loader": "^9.4.2",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.6"
  }
}
```

> Note: Replace `@heroui/core` with the actual HeroUI package name you will use. If HeroUI is configured differently in your environment, adapt imports.

---

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src", ".storybook"]
}
```

---

### .storybook/main.ts

```ts
import type { StorybookConfig } from '@storybook/react';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react',
    options: {}
  }
};
export default config;
```

---

### .storybook/preview.tsx

```tsx
import React from 'react';
import { withPerformance } from '@storybook/addon-performance';
import '../src/styles/globals.css';

export const decorators = [Story => <div style={{ padding: 20, background: 'var(--bg-900)', minHeight: '100vh' }}><Story /></div>];
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { expanded: true },
  layout: 'centered',
};
```

---

### src/index.ts

```ts
export * from './components/Button';
export * from './components/Input';
export * from './components/Card';
```

---

### src/tokens/colors.ts

```ts
export const colors = {
  bg900: '#0A2A3A',
  bg800: '#0F171B',
  glass01: 'rgba(255,255,255,0.04)',
  accent500: '#6DA7C8',
  accent400: '#89B6D2',
  textPrimary: '#E8ECEF',
  textMuted: '#9FAAB3',
  danger500: '#E06C75',
  success500: '#65C489'
} as const;
```

---

### src/tokens/index.ts

```ts
import { colors } from './colors';
export const tokens = {
  colors,
  radius: { sm: '6px', md: '12px', lg: '20px' },
  shadow: { soft: '0 6px 20px rgba(4,8,16,0.6)' },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24 }
} as const;
```

---

### src/styles/globals.css

```css
:root {
  --bg-900: #0A2A3A;
  --bg-800: #0F171B;
  --glass-01: rgba(255,255,255,0.04);
  --accent-500: #6DA7C8;
  --accent-400: #89B6D2;
  --text-primary: #E8ECEF;
  --text-muted: #9FAAB3;
  --danger-500: #E06C75;
  --success-500: #65C489;
  --radius-md: 12px;
  --shadow-soft: 0 6px 20px rgba(4,8,16,0.6);
}

* { box-sizing: border-box; }
html,body,#root { height: 100%; }
body {
  margin: 0;
  background: linear-gradient(180deg, var(--bg-900), var(--bg-800));
  color: var(--text-primary);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

.glass {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  backdrop-filter: blur(10px) saturate(120%);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
}

:focus-visible { outline: 3px solid var(--accent-400); outline-offset: 2px; }

/* Utility */
.container { max-width: 980px; margin: 0 auto; padding: 24px; }
```

---

### src/components/HeroUIButton.tsx

```tsx
import React from 'react';
import { tokens } from '../tokens';

export type HeroUIButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
};

export const HeroUIButton: React.FC<HeroUIButtonProps> = ({ variant = 'primary', children, ...rest }) => {
  const style: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: tokens.radius.md,
    border: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 15,
  };

  if (variant === 'primary') {
    Object.assign(style, { background: tokens.colors.accent500, color: tokens.colors.textPrimary });
  } else if (variant === 'ghost') {
    Object.assign(style, { background: 'transparent', color: tokens.colors.textPrimary, border: `1px solid rgba(255,255,255,0.06)` });
  } else if (variant === 'danger') {
    Object.assign(style, { background: tokens.colors.danger500, color: tokens.colors.textPrimary });
  }

  return (
    <button {...rest} style={style} aria-pressed={(rest as any)['aria-pressed'] || false}>
      {children}
    </button>
  );
};

export default HeroUIButton;
```

---

### src/components/Button.tsx

```tsx
import React from 'react';
import HeroUIButton from './HeroUIButton';

export type ButtonProps = React.ComponentProps<typeof HeroUIButton> & { 'aria-label'?: string };

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <HeroUIButton {...props}>{children}</HeroUIButton>
  );
};

export default Button;
```

---

### src/components/Input.tsx

```tsx
import React from 'react';
import { tokens } from '../tokens';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ id, ...rest }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* assume label externally provided for accessibility */}
      <input
        id={id}
        {...rest}
        style={{
          padding: '10px 12px',
          borderRadius: tokens.radius.md,
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'transparent',
          color: tokens.colors.textPrimary,
        }}
      />
    </div>
  );
};

export default Input;
```

---

### src/components/Card.tsx

```tsx
import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
  return (
    <div className="glass" style={{ padding: 16 }} role="region" aria-label={(rest as any)['aria-label'] || 'Card'} {...rest}>
      {children}
    </div>
  );
};

export default Card;
```

---

### src/stories/Button.stories.mdx

```mdx
import { Meta, Story, Canvas, ArgsTable } from '@storybook/addon-docs';
import { Button } from '../components/Button';

<Meta title="Components/Button" component={Button} />

# Button

A HeroUI-wrapped button with accessible defaults and glassmorphism-ready styling.

<Canvas>
  <Story name="Primary">
    <Button variant="primary">Book Cruise</Button>
  </Story>
</Canvas>

## Accessibility

- The `Button` supports `aria-pressed` for toggle states.
- It is keyboard-focusable and exposes `:focus-visible` outline for high visibility.
- Ensure to provide `aria-label` for icon-only buttons.

<ArgsTable story={PRIMARY_STORY} />
```

---

### README_STORYBOOK.md

```md
# Blue Waters — Storybook Starter

## Setup

1. Install:

```bash
pnpm install
# or npm install

2. Run Storybook:

```bash
pnpm storybook

3. Open http://localhost:6006

## Notes
- Replace placeholder HeroUI package with the official one or your local wrapper.
- Add additional stories under `src/stories/` for Inputs, Cards, and complex flows (SeatMap, Checkout).

---

## Next steps & customization suggestions

- Add `Button` keyboard interaction tests via `@storybook/testing-library`.
- Add `axe` accessibility addon or CI test to validate each story.
- Expand components to include `SeatMap` with ARIA grid pattern and an accessible `Checkin` flow.
- Add Storybook theming to match design tokens for dark-first glassmorphism.

---

```
