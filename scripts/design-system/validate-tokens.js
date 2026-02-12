#!/usr/bin/env node

/**
 * Design Token Validator
 * 
 * Scans codebase for hardcoded color values and reports violations.
 * Blocks CI if violations found.
 * 
 * Usage: node scripts/design-system/validate-tokens.js [--filter=component-name]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Regex patterns for detecting hardcoded colors
const PATTERNS = {
  hex: /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g,
  rgb: /rgba?\([^)]+\)/g,
  hsl: /hsla?\([^)]+\)/g,
  tailwindArbitrary: /(?:bg|text|border)-\[[^\]]+\]/g,
  colorKeywords: /\b(red|blue|green|yellow|orange|purple|pink|gray|black|white|navy|teal|cyan|magenta|lime|indigo|violet)(?=\s*[;:])/gi,
};

// Allowed exceptions (token definitions, etc.)
const ALLOWED_FILES = [
  'tailwind.config.ts',
  'tailwind.config.js',
  'globals.css',
  'tokens.ts',
  'design-system/tokens.ts',
];

const ALLOWED_PATTERNS = [
  /var\(--[\w-]+\)/,                    // CSS variables
  /rgba?\(255,\s*255,\s*255,\s*0\.\d+\)/, // White with alpha (glass effects)
  /rgba?\(0,\s*0,\s*0,\s*0\.\d+\)/,      // Black with alpha (shadows)
];

console.log('🔍 Scanning codebase for hardcoded colors...\n');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function isAllowedFile(filePath) {
  return ALLOWED_FILES.some(allowed => filePath.includes(allowed));
}

function isAllowedException(code) {
  return ALLOWED_PATTERNS.some(pattern => pattern.test(code));
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const violations = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return;
    }
    
    // Check for hex colors
    const hexMatches = line.match(PATTERNS.hex);
    if (hexMatches) {
      hexMatches.forEach(match => {
        if (!isAllowedException(line)) {
          violations.push({
            file: filePath,
            line: lineNumber,
            code: line.trim(),
            match,
            type: 'hex',
          });
        }
      });
    }
    
    // Check for rgb/rgba
    const rgbMatches = line.match(PATTERNS.rgb);
    if (rgbMatches) {
      rgbMatches.forEach(match => {
        if (!isAllowedException(line)) {
          violations.push({
            file: filePath,
            line: lineNumber,
            code: line.trim(),
            match,
            type: 'rgb',
          });
        }
      });
    }
    
    // Check for hsl/hsla
    const hslMatches = line.match(PATTERNS.hsl);
    if (hslMatches) {
      hslMatches.forEach(match => {
        if (!isAllowedException(line)) {
          violations.push({
            file: filePath,
            line: lineNumber,
            code: line.trim(),
            match,
            type: 'hsl',
          });
        }
      });
    }
    
    // Check for Tailwind arbitrary values
    const tailwindMatches = line.match(PATTERNS.tailwindArbitrary);
    if (tailwindMatches) {
      tailwindMatches.forEach(match => {
        violations.push({
          file: filePath,
          line: lineNumber,
          code: line.trim(),
          match,
          type: 'tailwind-arbitrary',
        });
      });
    }
    
    // Check for color keywords (less strict, only in obvious contexts)
    if (line.includes('color:') || line.includes('background:') || line.includes('border:')) {
      const keywordMatches = line.match(PATTERNS.colorKeywords);
      if (keywordMatches) {
        keywordMatches.forEach(match => {
          if (!isAllowedException(line) && !line.includes('var(')) {
            violations.push({
              file: filePath,
              line: lineNumber,
              code: line.trim(),
              match,
              type: 'color-keyword',
            });
          }
        });
      }
    }
  });
  
  return violations;
}

function scanDirectory(dir, filter = null) {
  const allViolations = [];
  
  function walk(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      // Skip node_modules, .next, build directories
      if (stat.isDirectory()) {
        if (!['node_modules', '.next', 'build', 'dist', '.git'].includes(file)) {
          walk(filePath);
        }
        return;
      }
      
      // Only scan relevant files
      if (!['.tsx', '.ts', '.jsx', '.js', '.css'].some(ext => file.endsWith(ext))) {
        return;
      }
      
      // Skip allowed files
      if (isAllowedFile(filePath)) {
        return;
      }
      
      // Apply filter if provided
      if (filter && !filePath.includes(filter)) {
        return;
      }
      
      const violations = scanFile(filePath);
      if (violations.length > 0) {
        allViolations.push(...violations);
      }
    });
  }
  
  walk(dir);
  return allViolations;
}

function suggestFix(violation) {
  const fixes = {
    '#0C4A79': 'var(--accent-500) or var(--bg-800)',
    '#FF6B35': 'var(--accent-500) [REMOVED: too vibrant]',
    '#6DA7C8': 'var(--accent-500)',
    '#0B0F12': 'var(--bg-900)',
    '#0F171B': 'var(--bg-800)',
    'rgb(': 'rgba( with var(--color-name)',
    'hsl(': 'Use var(--color-name) instead',
    'bg-[': 'Use token-based class: bg-accent-500',
    'text-[': 'Use token-based class: text-muted-100',
    'red': 'var(--danger-500)',
    'blue': 'var(--accent-500)',
    'green': 'var(--success-500)',
    'orange': 'var(--accent-500) or var(--warning-500)',
  };
  
  for (const [pattern, fix] of Object.entries(fixes)) {
    if (violation.match.includes(pattern) || violation.match === pattern) {
      return fix;
    }
  }
  
  return 'Use design token from src/design-system/tokens.ts';
}

function groupViolationsByFile(violations) {
  const grouped = {};
  
  violations.forEach(v => {
    if (!grouped[v.file]) {
      grouped[v.file] = [];
    }
    grouped[v.file].push(v);
  });
  
  return grouped;
}

function printReport(violations) {
  if (violations.length === 0) {
    console.log('✅ No hardcoded color violations found!\n');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║           DESIGN TOKEN VALIDATION REPORT                     ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    console.log('✅ ALL CHECKS PASSED — Design token system is compliant.\n');
    return;
  }
  
  console.log('❌ HARDCODED COLOR VIOLATIONS FOUND\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║           DESIGN TOKEN VALIDATION REPORT                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  const grouped = groupViolationsByFile(violations);
  const fileCount = Object.keys(grouped).length;
  
  console.log(`Files with violations: ${fileCount}`);
  console.log(`Total violations: ${violations.length}\n`);
  
  console.log('VIOLATIONS BY FILE:\n');
  
  Object.entries(grouped).forEach(([file, viols]) => {
    console.log(`\n📄 ${file}:`);
    console.log(`   ${viols.length} violation(s)\n`);
    
    viols.forEach((v, index) => {
      console.log(`   ${index + 1}. Line ${v.line}: ${v.type.toUpperCase()}`);
      console.log(`      Code: ${v.code}`);
      console.log(`      Match: ${v.match}`);
      console.log(`      Fix: ${suggestFix(v)}\n`);
    });
  });
  
  console.log('\n═══════════════════════════════════════════════════════════════\n');
  console.log('FIX INSTRUCTIONS:\n');
  console.log('1. Replace hardcoded colors with design tokens');
  console.log('2. See .github/instructions/design-system/01-design-tokens.instructions.md');
  console.log('3. Run: npm run design-system:replace-tokens (if available)');
  console.log('4. Re-run this script to verify fixes\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  const filterArg = args.find(arg => arg.startsWith('--filter='));
  const filter = filterArg ? filterArg.split('=')[1] : null;
  
  if (filter) {
    console.log(`📁 Filtering by: ${filter}\n`);
  }
  
  const srcDir = path.resolve(process.cwd(), 'src');
  const violations = scanDirectory(srcDir, filter);
  
  printReport(violations);
  
  if (violations.length > 0) {
    console.log('❌ VALIDATION FAILED — Fix violations before merging.\n');
    process.exit(1);
  } else {
    console.log('✅ VALIDATION PASSED\n');
    process.exit(0);
  }
}

// Run if called directly
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMainModule) {
  main();
}

export { scanDirectory, scanFile, printReport };
