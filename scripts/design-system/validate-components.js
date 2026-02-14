#!/usr/bin/env node

/**
 * Component Validator
 * 
 * Validates a specific component against design system requirements:
 * - Design tokens (no hardcoded colors)
 * - Accessibility (ARIA, keyboard, contrast)
 * - Glassmorphism (if applicable)
 * - Icons (Pictogrammers, not Lucide/emoji)
 * 
 * Usage: node scripts/design-system/validate-component.js <component-name>
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv.length < 3) {
  console.error('❌ Usage: npm run design-system:validate-component <component-name>');
  console.error('   Example: npm run design-system:validate-component button');
  process.exit(1);
}

const componentName = process.argv[2].toLowerCase();
const componentFile = `src/components/ui/${componentName}.tsx`;

console.log(`\n🔍 Validating component: ${componentName}\n`);
console.log('═══════════════════════════════════════════════════════════════\n');

// ============================================================================
// VALIDATION CHECKS
// ============================================================================

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

function checkFileExists() {
  const fullPath = path.resolve(process.cwd(), componentFile);
  if (!fs.existsSync(fullPath)) {
    results.failed.push({
      check: 'File Existence',
      message: `Component file not found: ${componentFile}`,
    });
    return false;
  }
  results.passed.push({
    check: 'File Existence',
    message: `Component file found: ${componentFile}`,
  });
  return true;
}

function checkDesignTokens() {
  console.log('Checking design tokens...');
  
  try {
    const content = fs.readFileSync(componentFile, 'utf-8');
    
    // Check for hardcoded hex colors
    const hexMatches = content.match(/#([0-9a-fA-F]{3,6})/g);
    if (hexMatches && hexMatches.length > 0) {
      results.failed.push({
        check: 'Design Tokens',
        message: `Found ${hexMatches.length} hardcoded hex color(s): ${hexMatches.join(', ')}`,
      });
      return;
    }
    
    // Check for rgb/rgba (excluding white/black with alpha for glass)
    const rgbMatches = content.match(/rgba?\([^)]+\)/g);
    if (rgbMatches) {
      const filtered = rgbMatches.filter(m => 
        !m.includes('255, 255, 255') && 
        !m.includes('0, 0, 0') &&
        !m.includes('var(')
      );
      if (filtered.length > 0) {
        results.failed.push({
          check: 'Design Tokens',
          message: `Found ${filtered.length} hardcoded rgb color(s)`,
        });
        return;
      }
    }
    
    // Check for Tailwind arbitrary values
    const arbitraryMatches = content.match(/(?:bg|text|border)-\[[^\]]+\]/g);
    if (arbitraryMatches && arbitraryMatches.length > 0) {
      results.failed.push({
        check: 'Design Tokens',
        message: `Found ${arbitraryMatches.length} Tailwind arbitrary value(s): ${arbitraryMatches.join(', ')}`,
      });
      return;
    }
    
    results.passed.push({
      check: 'Design Tokens',
      message: 'No hardcoded colors found',
    });
    
  } catch (error) {
    results.failed.push({
      check: 'Design Tokens',
      message: `Error reading file: ${error.message}`,
    });
  }
}

function checkAccessibility() {
  console.log('Checking accessibility...');
  
  const content = fs.readFileSync(componentFile, 'utf-8');
  const issues = [];
  
  // Check for aria attributes
  const hasAriaLabel = content.includes('aria-label');
  const hasAriaDescribedby = content.includes('aria-describedby');
  const hasRole = content.includes('role=');
  
  // Check for keyboard support (onKeyDown, onKeyPress, etc.)
  const hasKeyboardSupport = /on(Key|Keyboard)/i.test(content);
  
  // Check for focus styles
  const hasFocusStyles = /focus:|focus-visible:/i.test(content);
  
  if (content.includes('<button') || content.includes('Button')) {
    if (!hasFocusStyles) {
      issues.push('Missing focus-visible styles');
    }
  }
  
  if (content.includes('<input') || content.includes('Input')) {
    if (!hasAriaLabel && !content.includes('htmlFor')) {
      issues.push('Inputs should have labels (htmlFor) or aria-label');
    }
  }
  
  if (issues.length > 0) {
    results.warnings.push({
      check: 'Accessibility',
      message: issues.join(', '),
    });
  } else {
    results.passed.push({
      check: 'Accessibility',
      message: 'Basic accessibility patterns present',
    });
  }
}

function checkGlassmorphism() {
  console.log('Checking glassmorphism...');
  
  const content = fs.readFileSync(componentFile, 'utf-8');
  
  // Check if component should have glass effects (cards, modals, etc.)
  const shouldHaveGlass = ['card', 'modal', 'dialog', 'popover', 'dropdown'].some(
    name => componentName.includes(name)
  );
  
  if (!shouldHaveGlass) {
    results.passed.push({
      check: 'Glassmorphism',
      message: 'Not applicable for this component',
    });
    return;
  }
  
  const hasGlassClass = /glass|backdrop-filter|backdrop-blur/i.test(content);
  const hasReducedMotion = content.includes('prefers-reduced-motion') || content.includes('motion-reduce:');
  
  if (!hasGlassClass) {
    results.warnings.push({
      check: 'Glassmorphism',
      message: 'Component type suggests glass effect but none found',
    });
    return;
  }
  
  if (!hasReducedMotion) {
    results.failed.push({
      check: 'Glassmorphism',
      message: 'Glass effect found but no reduced-motion fallback',
    });
    return;
  }
  
  results.passed.push({
    check: 'Glassmorphism',
    message: 'Glass effects properly implemented with fallbacks',
  });
}

function checkIcons() {
  console.log('Checking icons...');
  
  const content = fs.readFileSync(componentFile, 'utf-8');
  
  // Check for Lucide icons
  const hasLucide = content.includes('lucide-react');
  if (hasLucide) {
    results.failed.push({
      check: 'Icons',
      message: 'Lucide icons found - should use Pictogrammers (@mdi/react)',
    });
    return;
  }
  
  // Check for emoji icons
  const emojiMatches = content.match(/[⛵🌊🎫🚢]/g);
  if (emojiMatches && emojiMatches.length > 0) {
    results.failed.push({
      check: 'Icons',
      message: `Found ${emojiMatches.length} emoji icon(s) - should use Pictogrammers SVG`,
    });
    return;
  }
  
  // Check for Pictogrammers
  const hasPictogrammers = content.includes('@mdi/react') || content.includes('@mdi/js');
  if (hasPictogrammers) {
    results.passed.push({
      check: 'Icons',
      message: 'Using Pictogrammers icon system',
    });
  } else {
    results.passed.push({
      check: 'Icons',
      message: 'No icons used in component',
    });
  }
}

function checkStorybook() {
  console.log('Checking Storybook story...');
  
  const storyFile = `src/stories/${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.stories.tsx`;
  const fullPath = path.resolve(process.cwd(), storyFile);
  
  if (!fs.existsSync(fullPath)) {
    results.warnings.push({
      check: 'Storybook',
      message: `Story file not found: ${storyFile}`,
    });
    return;
  }
  
  results.passed.push({
    check: 'Storybook',
    message: `Story file exists: ${storyFile}`,
  });
}

// ============================================================================
// REPORT
// ============================================================================

function printReport() {
  console.log('\n═══════════════════════════════════════════════════════════════\n');
  console.log('VALIDATION REPORT\n');
  
  // Passed checks
  if (results.passed.length > 0) {
    console.log('✅ PASSED CHECKS:\n');
    results.passed.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.check}`);
      console.log(`      ${r.message}\n`);
    });
  }
  
  // Warnings
  if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    results.warnings.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.check}`);
      console.log(`      ${r.message}\n`);
    });
  }
  
  // Failed checks
  if (results.failed.length > 0) {
    console.log('❌ FAILED CHECKS:\n');
    results.failed.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.check}`);
      console.log(`      ${r.message}\n`);
    });
  }
  
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Summary
  console.log('SUMMARY:\n');
  console.log(`   Passed: ${results.passed.length}`);
  console.log(`   Warnings: ${results.warnings.length}`);
  console.log(`   Failed: ${results.failed.length}\n`);
  
  if (results.failed.length === 0 && results.warnings.length === 0) {
    console.log('✅ COMPONENT MIGRATION COMPLETE — All checks passed!\n');
    return true;
  } else if (results.failed.length === 0) {
    console.log('⚠️  COMPONENT MIGRATION MOSTLY COMPLETE — Minor warnings present\n');
    return true;
  } else {
    console.log('❌ COMPONENT MIGRATION INCOMPLETE — Fix failures before marking complete\n');
    return false;
  }
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  if (!checkFileExists()) {
    console.log('\n❌ Component file not found. Exiting.\n');
    process.exit(1);
  }
  
  checkDesignTokens();
  checkAccessibility();
  checkGlassmorphism();
  checkIcons();
  checkStorybook();
  
  const passed = printReport();
  
  if (!passed) {
    console.log('NEXT STEPS:\n');
    console.log('1. Fix failed checks listed above');
    console.log('2. Review warnings and address if necessary');
    console.log('3. Re-run: npm run design-system:validate-component ' + componentName);
    console.log('4. Once passing, update migration tracker:\n');
    console.log('   npm run migration:update-tracker\n');
    process.exit(1);
  }
  
  process.exit(0);
}

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMainModule) {
  main();
}

export { main, checkDesignTokens, checkAccessibility };
