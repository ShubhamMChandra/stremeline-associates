/**
 * Visual Design Audit Script
 * 
 * Navigates through key pages, takes full-page screenshots, and analyzes:
 * - Section spacing (padding/margins)
 * - Typography hierarchy
 * - Dead space and excessive padding
 * - Visual rhythm and balance
 * - Alignment issues
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { mkdir } from 'fs/promises';

const PAGES = [
  { url: 'http://localhost:3001', name: 'Homepage' },
  { url: 'http://localhost:3001/services', name: 'Services' },
  { url: 'http://localhost:3001/about', name: 'About' },
  { url: 'http://localhost:3001/case-studies', name: 'Case Studies' },
];

const VIEWPORT = { width: 1440, height: 900 };

async function measureElement(page, selector) {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    
    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    
    return {
      width: rect.width,
      height: rect.height,
      paddingTop: parseFloat(styles.paddingTop),
      paddingBottom: parseFloat(styles.paddingBottom),
      paddingLeft: parseFloat(styles.paddingLeft),
      paddingRight: parseFloat(styles.paddingRight),
      marginTop: parseFloat(styles.marginTop),
      marginBottom: parseFloat(styles.marginBottom),
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      lineHeight: styles.lineHeight,
    };
  }, selector);
}

async function getSectionInfo(page) {
  return await page.evaluate(() => {
    const sections = document.querySelectorAll('section, [class*="section"], main > div');
    const results = [];
    
    sections.forEach((section, idx) => {
      const rect = section.getBoundingClientRect();
      const styles = window.getComputedStyle(section);
      const classes = section.className;
      const id = section.id;
      
      // Find headings in this section
      const headings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingInfo = Array.from(headings).map(h => {
        const hStyles = window.getComputedStyle(h);
        return {
          tag: h.tagName,
          text: h.textContent?.slice(0, 50),
          fontSize: hStyles.fontSize,
          fontWeight: hStyles.fontWeight,
          lineHeight: hStyles.lineHeight,
          marginTop: hStyles.marginTop,
          marginBottom: hStyles.marginBottom,
        };
      });
      
      results.push({
        index: idx,
        id: id || `section-${idx}`,
        classes,
        height: rect.height,
        paddingTop: parseFloat(styles.paddingTop),
        paddingBottom: parseFloat(styles.paddingBottom),
        marginTop: parseFloat(styles.marginTop),
        marginBottom: parseFloat(styles.marginBottom),
        headings: headingInfo,
        top: rect.top + window.scrollY,
      });
    });
    
    return results;
  });
}

async function auditPage(browser, pageInfo) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Auditing: ${pageInfo.name}`);
  console.log(`URL: ${pageInfo.url}`);
  console.log('='.repeat(60));
  
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);
  
  const issues = [];
  
  try {
    // Navigate and wait for page to be ready
    await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for animations
    
    // Create screenshots directory
    const screenshotDir = `screenshots/audit/${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}`;
    await mkdir(screenshotDir, { recursive: true });
    
    // Take full-page screenshot
    await page.screenshot({
      path: `${screenshotDir}/full-page.png`,
      fullPage: true,
    });
    console.log(`✓ Full-page screenshot saved`);
    
    // Get all sections
    const sections = await getSectionInfo(page);
    console.log(`\nFound ${sections.length} sections\n`);
    
    // Analyze each section
    for (const section of sections) {
      console.log(`\n--- Section ${section.index}: ${section.id} ---`);
      console.log(`Height: ${section.height}px`);
      console.log(`Padding: ${section.paddingTop}px (top) / ${section.paddingBottom}px (bottom)`);
      console.log(`Margin: ${section.marginTop}px (top) / ${section.marginBottom}px (bottom)`);
      
      // Check for excessive vertical padding
      const totalVerticalPadding = section.paddingTop + section.paddingBottom;
      if (totalVerticalPadding > 400) {
        issues.push({
          section: section.id,
          type: 'spacing',
          severity: 'high',
          issue: `Excessive vertical padding: ${totalVerticalPadding}px`,
          suggestion: 'Reduce padding to 200-300px total for better visual rhythm',
        });
      }
      
      // Check for dead space (large padding but small content)
      if (section.height > 800 && section.paddingTop > 200) {
        const contentHeight = section.height - section.paddingTop - section.paddingBottom;
        if (contentHeight < section.height * 0.4) {
          issues.push({
            section: section.id,
            type: 'layout',
            severity: 'medium',
            issue: `Dead space detected: ${Math.round((1 - contentHeight / section.height) * 100)}% of section is padding`,
            suggestion: 'Consider reducing padding or increasing content density',
          });
        }
      }
      
      // Analyze typography
      if (section.headings.length > 0) {
        console.log(`\nHeadings in section:`);
        const fontSizes = new Set();
        
        section.headings.forEach((h, i) => {
          console.log(`  ${h.tag}: "${h.text}" - ${h.fontSize} / ${h.fontWeight}`);
          fontSizes.add(h.fontSize);
          
          // Check for inconsistent heading weights
          if (h.tag === 'H1' && parseInt(h.fontWeight) < 600) {
            issues.push({
              section: section.id,
              type: 'typography',
              severity: 'low',
              issue: `H1 has weak font weight (${h.fontWeight})`,
              suggestion: 'H1 should be bold (600+) for hierarchy',
            });
          }
          
          // Check for excessive heading margins
          const topMargin = parseFloat(h.marginTop);
          const bottomMargin = parseFloat(h.marginBottom);
          if (topMargin > 80 || bottomMargin > 80) {
            issues.push({
              section: section.id,
              type: 'typography',
              severity: 'medium',
              issue: `${h.tag} has excessive margin: ${topMargin}px top, ${bottomMargin}px bottom`,
              suggestion: 'Keep heading margins between 20-60px for better rhythm',
            });
          }
        });
        
        // Check for too many different font sizes
        if (fontSizes.size > section.headings.length) {
          issues.push({
            section: section.id,
            type: 'typography',
            severity: 'low',
            issue: `Inconsistent font sizing: ${fontSizes.size} different sizes for ${section.headings.length} headings`,
            suggestion: 'Use a consistent type scale',
          });
        }
      }
      
      // Scroll to section and take screenshot
      await page.evaluate((top) => window.scrollTo(0, top - 100), section.top);
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${screenshotDir}/section-${section.index}-${section.id}.png`,
        fullPage: false,
      });
    }
    
    // Check overall page metrics
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`\nPage height: ${pageHeight}px`);
    
    if (pageHeight > 8000) {
      issues.push({
        section: 'overall',
        type: 'layout',
        severity: 'medium',
        issue: `Very long page (${pageHeight}px)`,
        suggestion: 'Consider breaking into multiple pages or sections',
      });
    }
    
  } catch (error) {
    console.error(`Error auditing ${pageInfo.name}:`, error);
    issues.push({
      section: 'page',
      type: 'error',
      severity: 'critical',
      issue: error.message,
      suggestion: 'Fix the error before auditing',
    });
  } finally {
    await page.close();
  }
  
  return issues;
}

async function generateReport(allIssues) {
  console.log('\n\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'VISUAL DESIGN AUDIT REPORT' + ' '.repeat(32) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  
  for (const [pageName, issues] of Object.entries(allIssues)) {
    console.log(`\n\n📄 ${pageName}`);
    console.log('─'.repeat(80));
    
    if (issues.length === 0) {
      console.log('✅ No issues found!');
      continue;
    }
    
    // Group by severity
    const critical = issues.filter(i => i.severity === 'critical');
    const high = issues.filter(i => i.severity === 'high');
    const medium = issues.filter(i => i.severity === 'medium');
    const low = issues.filter(i => i.severity === 'low');
    
    if (critical.length > 0) {
      console.log(`\n🔴 CRITICAL (${critical.length})`);
      critical.forEach(i => {
        console.log(`  • [${i.section}] ${i.issue}`);
        console.log(`    → ${i.suggestion}`);
      });
    }
    
    if (high.length > 0) {
      console.log(`\n🟠 HIGH (${high.length})`);
      high.forEach(i => {
        console.log(`  • [${i.section}] ${i.issue}`);
        console.log(`    → ${i.suggestion}`);
      });
    }
    
    if (medium.length > 0) {
      console.log(`\n🟡 MEDIUM (${medium.length})`);
      medium.forEach(i => {
        console.log(`  • [${i.section}] ${i.issue}`);
        console.log(`    → ${i.suggestion}`);
      });
    }
    
    if (low.length > 0) {
      console.log(`\n🔵 LOW (${low.length})`);
      low.forEach(i => {
        console.log(`  • [${i.section}] ${i.issue}`);
        console.log(`    → ${i.suggestion}`);
      });
    }
  }
  
  // Summary
  const totalIssues = Object.values(allIssues).flat().length;
  console.log('\n\n' + '═'.repeat(80));
  console.log(`📊 Total issues found: ${totalIssues}`);
  console.log('═'.repeat(80) + '\n');
}

// Main execution
(async () => {
  const browser = await chromium.launch({ headless: true });
  const allIssues = {};
  
  for (const pageInfo of PAGES) {
    const issues = await auditPage(browser, pageInfo);
    allIssues[pageInfo.name] = issues;
  }
  
  await browser.close();
  
  // Generate report
  await generateReport(allIssues);
  
  // Save JSON report
  writeFileSync(
    'screenshots/audit/visual-audit-report.json',
    JSON.stringify(allIssues, null, 2)
  );
  console.log('📁 Full report saved to: screenshots/audit/visual-audit-report.json\n');
})();
