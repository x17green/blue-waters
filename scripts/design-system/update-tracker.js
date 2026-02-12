#!/usr/bin/env node

/**
 * Design System Migration Tracker Updater
 * 
 * This script scans the codebase and updates markdown migration tracker files
 * with current progress statistics.
 * 
 * Usage: node scripts/design-system/update-tracker.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRACKER_FILE = '.github/instructions/design-system/00-MASTER-TRACKER.instructions.md';
const COMPONENT_FILE = '.github/instructions/design-system/02-component-migration.instructions.md';
const PAGE_FILE = '.github/instructions/design-system/03-page-migration.instructions.md';

console.log('🔄 Updating design system migration tracker...\n');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function readFile(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${fullPath}`);
    return null;
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

function writeFile(filePath, content) {
  const fullPath = path.resolve(process.cwd(), filePath);
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ Updated: ${filePath}`);
}

function countCheckboxes(content) {
  const completed = (content.match(/- \[x\]/gi) || []).length;
  const total = (content.match(/- \[[x ]\]/gi) || []).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

function updateProgressTable(content, category, stats) {
  const regex = new RegExp(
    `(\\| ${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\| )(\\d+)( \\| )(\\d+)( \\| \\d+ \\| )(\\d+)( \\| \\d+% \\|)`,
    'g'
  );
  
  const notStarted = stats.total - stats.completed;
  return content.replace(
    regex,
    `$1${stats.total}$3${stats.completed}$5${notStarted} | ${stats.percentage}% |`
  );
}

function updateMetadata(content, field, value) {
  const regex = new RegExp(`^(${field}:)(.*)$`, 'm');
  return content.replace(regex, `$1 ${value}`);
}

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

function analyzeComponents() {
  console.log('📊 Analyzing component migration...');
  
  const componentFile = readFile(COMPONENT_FILE);
  if (!componentFile) return { completed: 0, total: 48, percentage: 0 };
  
  const stats = countCheckboxes(componentFile);
  console.log(`   Components: ${stats.completed}/${stats.total} (${stats.percentage}%)`);
  
  return stats;
}

function analyzePages() {
  console.log('📊 Analyzing page migration...');
  
  const pageFile = readFile(PAGE_FILE);
  if (!pageFile) return { completed: 0, total: 8, percentage: 0 };
  
  const stats = countCheckboxes(pageFile);
  console.log(`   Pages: ${stats.completed}/${stats.total} (${stats.percentage}%)`);
  
  return stats;
}

function analyzeTokens() {
  console.log('📊 Analyzing design token migration...');
  
  try {
    // Check if tokens file exists
    const tokensPath = path.resolve(process.cwd(), 'src/design-system/tokens.ts');
    const tokensExist = fs.existsSync(tokensPath);
    
    // Count CSS variables in globals.css
    const globalsPath = path.resolve(process.cwd(), 'src/app/globals.css');
    if (fs.existsSync(globalsPath)) {
      const globalsContent = fs.readFileSync(globalsPath, 'utf-8');
      const tokenMatches = globalsContent.match(/--[\w-]+:/g) || [];
      const tokenCount = tokenMatches.length;
      
      console.log(`   Tokens defined: ${tokenCount}`);
      
      // Estimate completion (8 categories)
      const completed = tokensExist ? 2 : 0;
      return { completed, total: 8, percentage: Math.round((completed / 8) * 100) };
    }
  } catch (error) {
    console.error('   ⚠️  Error analyzing tokens:', error.message);
  }
  
  return { completed: 0, total: 8, percentage: 0 };
}

function analyzeAccessibility() {
  console.log('📊 Analyzing accessibility fixes...');
  
  const a11yFile = readFile('.github/instructions/design-system/04-accessibility-gates.instructions.md');
  if (!a11yFile) return { completed: 0, total: 14, percentage: 0 };
  
  const stats = countCheckboxes(a11yFile);
  console.log(`   A11y issues fixed: ${stats.completed}/${stats.total} (${stats.percentage}%)`);
  
  return stats;
}

function analyzeIcons() {
  console.log('📊 Analyzing icon migration...');
  
  try {
    // Search for Lucide imports
    const lucideCount = execSync(
      `git grep -i "from ['\"]lucide-react['\"]" -- "src/**/*.tsx" "src/**/*.ts" | wc -l`,
      { encoding: 'utf-8', cwd: process.cwd() }
    ).trim();
    
    // Search for emoji usage
    const emojiCount = execSync(
      `git grep -E "[⛵🌊🎫🚢]" -- "src/**/*.tsx" | wc -l`,
      { encoding: 'utf-8', cwd: process.cwd() }
    ).trim();
    
    const totalIconInstances = parseInt(lucideCount) + parseInt(emojiCount);
    const completed = Math.max(0, 50 - totalIconInstances);
    const percentage = Math.round((completed / 50) * 100);
    
    console.log(`   Lucide icons: ${lucideCount}`);
    console.log(`   Emoji icons: ${emojiCount}`);
    console.log(`   Icons migrated: ${completed}/50 (${percentage}%)`);
    
    return { completed, total: 50, percentage };
  } catch (error) {
    console.error('   ⚠️  Error analyzing icons:', error.message);
    return { completed: 0, total: 50, percentage: 0 };
  }
}

function calculateOverallProgress(stats) {
  const totalItems = stats.tokens.total + stats.components.total + stats.pages.total + 
                     stats.accessibility.total + stats.icons.total;
  const completedItems = stats.tokens.completed + stats.components.completed + 
                         stats.pages.completed + stats.accessibility.completed + 
                         stats.icons.completed;
  
  return {
    completed: completedItems,
    total: totalItems,
    percentage: Math.round((completedItems / totalItems) * 100)
  };
}

// ============================================================================
// UPDATE FUNCTIONS
// ============================================================================

function updateMasterTracker(stats) {
  console.log('\n📝 Updating master tracker...');
  
  let content = readFile(TRACKER_FILE);
  if (!content) return;
  
  // Update metadata
  const now = new Date().toISOString().split('T')[0];
  content = updateMetadata(content, 'last_updated', now);
  content = updateMetadata(content, 'total_progress', `${stats.overall.percentage}%`);
  
  // Update progress table
  content = updateProgressTable(content, 'Design Tokens', stats.tokens);
  content = updateProgressTable(content, 'Core Components', { ...stats.components, total: 6 });
  content = updateProgressTable(content, 'All Components', stats.components);
  content = updateProgressTable(content, 'Pages', stats.pages);
  content = updateProgressTable(content, 'Accessibility Issues', stats.accessibility);
  content = updateProgressTable(content, 'Icon Migration', stats.icons);
  
  // Update overall progress line
  content = content.replace(
    /\*\*Overall: \d+% Complete\*\* \(\d+ of \d+\+ items\)/,
    `**Overall: ${stats.overall.percentage}% Complete** (${stats.overall.completed} of ${stats.overall.total} items)`
  );
  
  // Update last updated in history table
  const historyEntry = `| ${now} | ${stats.overall.percentage < 25 ? '0' : stats.overall.percentage < 50 ? '1' : stats.overall.percentage < 75 ? '2' : '3'} | Automated tracker update | System |`;
  content = content.replace(
    /(## 🔄 Update History[\s\S]*?\| Date \| Phase \| Action \| Author \|\n\|[^\n]+\|\n)([\s\S]*?)(\n\n##)/,
    `$1${historyEntry}\n$2$3`
  );
  
  writeFile(TRACKER_FILE, content);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  try {
    const stats = {
      tokens: analyzeTokens(),
      components: analyzeComponents(),
      pages: analyzePages(),
      accessibility: analyzeAccessibility(),
      icons: analyzeIcons(),
    };
    
    stats.overall = calculateOverallProgress(stats);
    
    console.log('\n📈 Overall Progress:');
    console.log(`   ${stats.overall.completed}/${stats.overall.total} items (${stats.overall.percentage}%)\n`);
    
    updateMasterTracker(stats);
    
    console.log('\n✅ Migration tracker updated successfully!\n');
    console.log('📋 Summary:');
    console.log(`   • Design Tokens: ${stats.tokens.percentage}%`);
    console.log(`   • Components: ${stats.components.percentage}%`);
    console.log(`   • Pages: ${stats.pages.percentage}%`);
    console.log(`   • Accessibility: ${stats.accessibility.percentage}%`);
    console.log(`   • Icons: ${stats.icons.percentage}%`);
    console.log(`   • Overall: ${stats.overall.percentage}%\n`);
    
  } catch (error) {
    console.error('❌ Error updating tracker:', error);
    process.exit(1);
  }
}

// Run if called directly
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMainModule) {
  main();
}

export { main, analyzeComponents, analyzePages, analyzeTokens };
