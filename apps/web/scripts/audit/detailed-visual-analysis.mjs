/**
 * Detailed Typography & Spacing Analysis
 * 
 * Analyzes the raw data from the visual audit to identify:
 * - Typography inconsistencies (H2 being smaller than H3, etc.)
 * - Spacing rhythm issues
 * - Hierarchy problems
 */

import { chromium } from 'playwright';

const PAGES = [
  { url: 'http://localhost:3001', name: 'Homepage' },
  { url: 'http://localhost:3001/services', name: 'Services' },
  { url: 'http://localhost:3001/about', name: 'About' },
  { url: 'http://localhost:3001/case-studies', name: 'Case Studies' },
];

const VIEWPORT = { width: 1440, height: 900 };

async function analyzeTypography(page) {
  return await page.evaluate(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const results = [];
    
    headings.forEach(h => {
      const styles = window.getComputedStyle(h);
      const parent = h.closest('section, [class*="section"], main');
      const parentId = parent?.id || parent?.className || 'unknown';
      
      results.push({
        tag: h.tagName,
        text: h.textContent?.trim().slice(0, 60),
        fontSize: parseFloat(styles.fontSize),
        fontWeight: parseInt(styles.fontWeight),
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        marginTop: parseFloat(styles.marginTop),
        marginBottom: parseFloat(styles.marginBottom),
        section: parentId,
      });
    });
    
    return results;
  });
}

async function analyzeSections(page) {
  return await page.evaluate(() => {
    const sections = document.querySelectorAll('section, main > div[class*="py-"], main > div[class*="space"]');
    const results = [];
    
    sections.forEach((section, idx) => {
      const styles = window.getComputedStyle(section);
      const rect = section.getBoundingClientRect();
      
      // Get all direct children to analyze spacing
      const children = Array.from(section.children);
      const childSpacing = [];
      
      for (let i = 0; i < children.length - 1; i++) {
        const curr = children[i].getBoundingClientRect();
        const next = children[i + 1].getBoundingClientRect();
        const gap = next.top - curr.bottom;
        if (gap !== 0) childSpacing.push(gap);
      }
      
      results.push({
        index: idx,
        id: section.id || section.className.split(' ').find(c => c.includes('section')) || `section-${idx}`,
        height: rect.height,
        paddingTop: parseFloat(styles.paddingTop),
        paddingBottom: parseFloat(styles.paddingBottom),
        paddingLeft: parseFloat(styles.paddingLeft),
        paddingRight: parseFloat(styles.paddingRight),
        marginTop: parseFloat(styles.marginTop),
        marginBottom: parseFloat(styles.marginBottom),
        childSpacing,
        backgroundColor: styles.backgroundColor,
      });
    });
    
    return results;
  });
}

async function analyzePage(browser, pageInfo) {
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);
  
  const issues = {
    typography: [],
    spacing: [],
    hierarchy: [],
  };
  
  try {
    await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📄 ${pageInfo.name}`);
    console.log('='.repeat(80));
    
    // Typography analysis
    const headings = await analyzeTypography(page);
    console.log(`\n📝 TYPOGRAPHY ANALYSIS`);
    console.log('-'.repeat(80));
    
    // Group by heading level
    const h1s = headings.filter(h => h.tag === 'H1');
    const h2s = headings.filter(h => h.tag === 'H2');
    const h3s = headings.filter(h => h.tag === 'H3');
    
    // Check H1 consistency
    if (h1s.length > 0) {
      const h1Sizes = [...new Set(h1s.map(h => h.fontSize))];
      console.log(`\nH1 (${h1s.length} found):`);
      h1s.forEach(h => {
        console.log(`  "${h.text}" - ${h.fontSize}px / ${h.fontWeight}wt`);
      });
      
      if (h1Sizes.length > 1) {
        issues.typography.push({
          level: 'H1',
          issue: `Inconsistent H1 sizes: ${h1Sizes.join(', ')}px`,
          suggestion: 'H1 should have consistent size across pages',
          severity: 'high',
        });
      }
      
      // Check if H1 is actually large
      const avgH1 = h1Sizes.reduce((a, b) => a + b, 0) / h1Sizes.length;
      if (avgH1 < 40) {
        issues.typography.push({
          level: 'H1',
          issue: `H1 too small: ${avgH1}px`,
          suggestion: 'H1 should be 48-72px for strong hierarchy',
          severity: 'medium',
        });
      }
    }
    
    // Check H2 consistency
    if (h2s.length > 0) {
      const h2Sizes = [...new Set(h2s.map(h => h.fontSize))];
      console.log(`\nH2 (${h2s.length} found):`);
      h2s.forEach(h => {
        console.log(`  "${h.text}" - ${h.fontSize}px / ${h.fontWeight}wt`);
      });
      
      if (h2Sizes.length > 1) {
        issues.typography.push({
          level: 'H2',
          issue: `Inconsistent H2 sizes: ${h2Sizes.join(', ')}px`,
          suggestion: 'H2 should have consistent size',
          severity: 'medium',
        });
      }
      
      const avgH2 = h2Sizes.reduce((a, b) => a + b, 0) / h2Sizes.length;
      if (avgH2 < 24) {
        issues.typography.push({
          level: 'H2',
          issue: `H2 too small: ${avgH2}px (looks like body text)`,
          suggestion: 'H2 should be 30-48px for section headers',
          severity: 'high',
        });
      }
    }
    
    // Check H3 consistency
    if (h3s.length > 0) {
      const h3Sizes = [...new Set(h3s.map(h => h.fontSize))];
      console.log(`\nH3 (${h3s.length} found):`);
      // Show first 5
      h3s.slice(0, 5).forEach(h => {
        console.log(`  "${h.text}" - ${h.fontSize}px / ${h.fontWeight}wt`);
      });
      if (h3s.length > 5) console.log(`  ... and ${h3s.length - 5} more`);
      
      if (h3Sizes.length > 2) {
        issues.typography.push({
          level: 'H3',
          issue: `Inconsistent H3 sizes: ${h3Sizes.join(', ')}px`,
          suggestion: 'H3 should have max 2 variants (card titles vs subsections)',
          severity: 'low',
        });
      }
    }
    
    // Check hierarchy: H2 should be bigger than H3
    if (h2s.length > 0 && h3s.length > 0) {
      const avgH2 = h2s.reduce((sum, h) => sum + h.fontSize, 0) / h2s.length;
      const maxH3 = Math.max(...h3s.map(h => h.fontSize));
      
      if (avgH2 <= maxH3) {
        issues.hierarchy.push({
          issue: `H2 (${avgH2}px) not larger than H3 (${maxH3}px)`,
          suggestion: 'Increase H2 to 30-48px to establish clear hierarchy',
          severity: 'critical',
        });
      }
    }
    
    // Spacing analysis
    const sections = await analyzeSections(page);
    console.log(`\n\n📏 SPACING ANALYSIS`);
    console.log('-'.repeat(80));
    
    const verticalPaddings = [];
    sections.forEach((s, idx) => {
      const totalPadding = s.paddingTop + s.paddingBottom;
      verticalPaddings.push(totalPadding);
      
      console.log(`\nSection ${idx}: ${s.id}`);
      console.log(`  Vertical padding: ${s.paddingTop}px (top) + ${s.paddingBottom}px (bottom) = ${totalPadding}px`);
      console.log(`  Horizontal padding: ${s.paddingLeft}px / ${s.paddingRight}px`);
      
      if (s.childSpacing.length > 0) {
        const avgGap = s.childSpacing.reduce((a, b) => a + b, 0) / s.childSpacing.length;
        console.log(`  Avg child spacing: ${avgGap.toFixed(1)}px`);
      }
    });
    
    // Check for padding inconsistency
    const uniquePaddings = [...new Set(verticalPaddings)];
    if (uniquePaddings.length > 5) {
      issues.spacing.push({
        issue: `Too many different vertical paddings: ${uniquePaddings.length} variants`,
        values: uniquePaddings.sort((a, b) => a - b),
        suggestion: 'Use consistent spacing scale (e.g., 64px, 96px, 128px)',
        severity: 'medium',
      });
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    await page.close();
  }
  
  return issues;
}

async function generateDetailedReport(allIssues) {
  console.log('\n\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'DETAILED VISUAL ISSUES' + ' '.repeat(35) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  
  for (const [pageName, issues] of Object.entries(allIssues)) {
    const allPageIssues = [...issues.typography, ...issues.spacing, ...issues.hierarchy];
    
    if (allPageIssues.length === 0) continue;
    
    console.log(`\n\n📄 ${pageName}`);
    console.log('─'.repeat(80));
    
    const critical = allPageIssues.filter(i => i.severity === 'critical');
    const high = allPageIssues.filter(i => i.severity === 'high');
    const medium = allPageIssues.filter(i => i.severity === 'medium');
    const low = allPageIssues.filter(i => i.severity === 'low');
    
    if (critical.length > 0) {
      console.log(`\n🔴 CRITICAL (${critical.length})`);
      critical.forEach(i => {
        console.log(`  • ${i.issue}`);
        console.log(`    → ${i.suggestion}`);
      });
    }
    
    if (high.length > 0) {
      console.log(`\n🟠 HIGH PRIORITY (${high.length})`);
      high.forEach(i => {
        console.log(`  • ${i.issue}`);
        console.log(`    → ${i.suggestion}`);
      });
    }
    
    if (medium.length > 0) {
      console.log(`\n🟡 MEDIUM (${medium.length})`);
      medium.forEach(i => {
        console.log(`  • ${i.issue}`);
        if (i.values) console.log(`    Values: ${i.values.join(', ')}`);
        console.log(`    → ${i.suggestion}`);
      });
    }
    
    if (low.length > 0) {
      console.log(`\n🔵 LOW (${low.length})`);
      low.forEach(i => {
        console.log(`  • ${i.issue}`);
        console.log(`    → ${i.suggestion}`);
      });
    }
  }
  
  const totalIssues = Object.values(allIssues)
    .flatMap(i => [...i.typography, ...i.spacing, ...i.hierarchy])
    .length;
  
  console.log('\n\n' + '═'.repeat(80));
  console.log(`📊 Total issues found: ${totalIssues}`);
  console.log('═'.repeat(80) + '\n');
}

// Main
(async () => {
  const browser = await chromium.launch({ headless: true });
  const allIssues = {};
  
  for (const pageInfo of PAGES) {
    const issues = await analyzePage(browser, pageInfo);
    allIssues[pageInfo.name] = issues;
  }
  
  await browser.close();
  
  await generateDetailedReport(allIssues);
})();
