/**
 * Comprehensive Visual Flow Audit
 * Executes the exact JS measurements and visual checks requested
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const PAGES = [
  { url: 'http://localhost:3001', name: 'Homepage' },
  { url: 'http://localhost:3001/services', name: 'Services' },
  { url: 'http://localhost:3001/about', name: 'About' },
  { url: 'http://localhost:3001/case-studies', name: 'Case Studies' },
];

const VIEWPORT = { width: 1440, height: 900 };

async function auditPage(browser, pageInfo) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 AUDITING: ${pageInfo.name}`);
  console.log(`URL: ${pageInfo.url}`);
  console.log('='.repeat(80));
  
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);
  
  const issues = [];
  
  try {
    await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(3000); // Wait for full hydration
    
    const dir = `screenshots/comprehensive-audit/${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}`;
    await mkdir(dir, { recursive: true });
    
    // ========================================
    // 1. MEASURE ALL HEADINGS (exact JS from user)
    // ========================================
    console.log('\n📝 TYPOGRAPHY MEASUREMENTS\n');
    
    const headings = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3');
      return JSON.stringify(Array.from(headings).map(h => ({
        tag: h.tagName,
        text: h.textContent?.slice(0, 50),
        fontSize: getComputedStyle(h).fontSize,
        fontWeight: getComputedStyle(h).fontWeight
      })), null, 2);
    });
    
    const headingsData = JSON.parse(headings);
    console.log(headings);
    
    // Analyze heading issues
    headingsData.forEach(h => {
      const size = parseFloat(h.fontSize);
      
      if (h.tag === 'H1') {
        if (size < 48 || size > 72) {
          issues.push({
            type: 'typography',
            severity: size < 48 ? 'high' : 'low',
            element: 'H1',
            text: h.text,
            issue: `H1 is ${h.fontSize} (should be 48-72px)`,
            current: h.fontSize,
            expected: '48-72px',
          });
        }
      } else if (h.tag === 'H2') {
        if (size < 36 || size > 48) {
          issues.push({
            type: 'typography',
            severity: size < 36 ? 'high' : 'low',
            element: 'H2',
            text: h.text,
            issue: `H2 is ${h.fontSize} (should be 36-48px)`,
            current: h.fontSize,
            expected: '36-48px',
          });
        }
      } else if (h.tag === 'H3') {
        if (size < 16 || size > 20) {
          issues.push({
            type: 'typography',
            severity: 'medium',
            element: 'H3',
            text: h.text,
            issue: `H3 is ${h.fontSize} (should be 16-20px consistently)`,
            current: h.fontSize,
            expected: '16-20px',
          });
        }
      }
    });
    
    // Check H3 consistency
    const h3s = headingsData.filter(h => h.tag === 'H3');
    const h3Sizes = [...new Set(h3s.map(h => parseFloat(h.fontSize)))];
    if (h3Sizes.length > 2) {
      issues.push({
        type: 'typography',
        severity: 'medium',
        element: 'H3',
        issue: `H3 has ${h3Sizes.length} different sizes: ${h3Sizes.join(', ')}px`,
        current: h3Sizes.join(', ') + 'px',
        expected: 'Max 2 variants (e.g., 18px for titles, 14px for labels)',
      });
    }
    
    // ========================================
    // 2. MEASURE SECTION SPACING (exact JS from user)
    // ========================================
    console.log('\n\n📏 SECTION SPACING MEASUREMENTS\n');
    
    const sections = await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      return JSON.stringify(Array.from(sections).map((s, i) => ({
        idx: i,
        ariaLabel: s.getAttribute('aria-label') || '',
        className: s.className.slice(0, 80),
        paddingTop: getComputedStyle(s).paddingTop,
        paddingBottom: getComputedStyle(s).paddingBottom,
        height: s.getBoundingClientRect().height + 'px'
      })), null, 2);
    });
    
    const sectionsData = JSON.parse(sections);
    console.log(sections);
    
    // Analyze spacing issues
    const paddings = sectionsData.map(s => ({
      top: parseFloat(s.paddingTop),
      bottom: parseFloat(s.paddingBottom),
      total: parseFloat(s.paddingTop) + parseFloat(s.paddingBottom),
    }));
    
    const uniquePaddings = [...new Set(paddings.map(p => p.total))].sort((a, b) => a - b);
    
    if (uniquePaddings.length > 4) {
      issues.push({
        type: 'spacing',
        severity: 'medium',
        issue: `Too many different vertical padding values: ${uniquePaddings.length} variants`,
        values: uniquePaddings.join(', ') + 'px',
        expected: 'Max 4 variants (e.g., 64px, 96px, 128px, 160px)',
      });
    }
    
    // Check for dead space (huge sections)
    sectionsData.forEach(s => {
      const height = parseFloat(s.height);
      const paddingTop = parseFloat(s.paddingTop);
      const paddingBottom = parseFloat(s.paddingBottom);
      const totalPadding = paddingTop + paddingBottom;
      
      if (totalPadding > 400) {
        issues.push({
          type: 'spacing',
          severity: 'high',
          section: s.ariaLabel || `Section ${s.idx}`,
          issue: `Excessive padding: ${totalPadding}px total`,
          current: `${paddingTop}px top, ${paddingBottom}px bottom`,
          expected: 'Max 200px per side',
        });
      }
      
      if (height > 1000 && totalPadding / height > 0.6) {
        issues.push({
          type: 'layout',
          severity: 'medium',
          section: s.ariaLabel || `Section ${s.idx}`,
          issue: `Dead space: ${Math.round((totalPadding / height) * 100)}% of section is padding`,
          current: `${height} tall, ${totalPadding}px padding`,
          expected: 'Content should fill more of the section',
        });
      }
    });
    
    // ========================================
    // 3. TAKE SCREENSHOTS
    // ========================================
    console.log('\n\n📸 CAPTURING SCREENSHOTS\n');
    
    // Top of page
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${dir}/01-top.png` });
    console.log('✓ Top screenshot');
    
    // Get page height and scroll through
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    const numScreenshots = Math.ceil(pageHeight / 800);
    
    for (let i = 1; i < numScreenshots; i++) {
      const scrollPos = i * 800;
      await page.evaluate((y) => window.scrollTo(0, y), scrollPos);
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${dir}/${String(i + 1).padStart(2, '0')}-scroll-${scrollPos}.png`,
      });
      console.log(`✓ Screenshot at ${scrollPos}px`);
    }
    
    // ========================================
    // 4. CHECK DARK/LIGHT TRANSITIONS (homepage only)
    // ========================================
    if (pageInfo.name === 'Homepage') {
      console.log('\n\n🎨 CHECKING DARK/LIGHT SECTION TRANSITIONS\n');
      
      const transitions = await page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll('section, main > div'));
        return sections.map((s, i) => {
          const bg = getComputedStyle(s).backgroundColor;
          const nextBg = i < sections.length - 1 ? 
            getComputedStyle(sections[i + 1]).backgroundColor : null;
          
          return {
            idx: i,
            bg,
            nextBg,
            transition: bg !== nextBg ? 'CHANGES' : 'SAME',
          };
        });
      });
      
      console.log(JSON.stringify(transitions, null, 2));
      
      // Check for harsh transitions
      const harshTransitions = transitions.filter(t => 
        t.transition === 'CHANGES' && 
        (t.bg.includes('0, 0, 0') || t.bg.includes('255, 255, 255'))
      );
      
      if (harshTransitions.length > 0) {
        console.log(`\n⚠️  Found ${harshTransitions.length} dark/light transitions`);
      }
    }
    
    // ========================================
    // 5. CHECK FOR VISUAL ISSUES
    // ========================================
    console.log('\n\n🔍 CHECKING FOR VISUAL ISSUES\n');
    
    // Check for elements outside viewport
    const overflowIssues = await page.evaluate(() => {
      const body = document.body;
      const bodyWidth = body.offsetWidth;
      const allElements = document.querySelectorAll('*');
      const overflow = [];
      
      allElements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > bodyWidth + 10) { // 10px tolerance
          overflow.push({
            tag: el.tagName,
            class: el.className.slice(0, 50),
            right: rect.right,
            bodyWidth,
          });
        }
      });
      
      return overflow.slice(0, 5); // Limit to first 5
    });
    
    if (overflowIssues.length > 0) {
      issues.push({
        type: 'layout',
        severity: 'high',
        issue: `${overflowIssues.length} elements overflow viewport`,
        details: overflowIssues,
      });
    }
    
    console.log(`✓ Audit complete for ${pageInfo.name}`);
    console.log(`📁 Screenshots saved to ${dir}/`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    issues.push({
      type: 'error',
      severity: 'critical',
      issue: error.message,
    });
  } finally {
    await page.close();
  }
  
  return issues;
}

async function generateReport(allIssues) {
  console.log('\n\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'COMPREHENSIVE VISUAL AUDIT REPORT' + ' '.repeat(25) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  
  for (const [pageName, issues] of Object.entries(allIssues)) {
    console.log(`\n\n📄 ${pageName.toUpperCase()}`);
    console.log('─'.repeat(80));
    
    if (issues.length === 0) {
      console.log('✅ No issues found!');
      continue;
    }
    
    const critical = issues.filter(i => i.severity === 'critical');
    const high = issues.filter(i => i.severity === 'high');
    const medium = issues.filter(i => i.severity === 'medium');
    const low = issues.filter(i => i.severity === 'low');
    
    if (critical.length > 0) {
      console.log(`\n🔴 CRITICAL (${critical.length})`);
      critical.forEach(i => {
        console.log(`  • ${i.issue}`);
        if (i.text) console.log(`    Text: "${i.text}"`);
        if (i.current) console.log(`    Current: ${i.current}`);
        if (i.expected) console.log(`    Expected: ${i.expected}`);
      });
    }
    
    if (high.length > 0) {
      console.log(`\n🟠 HIGH (${high.length})`);
      high.forEach(i => {
        console.log(`  • ${i.issue}`);
        if (i.section) console.log(`    Section: ${i.section}`);
        if (i.current) console.log(`    Current: ${i.current}`);
        if (i.expected) console.log(`    Expected: ${i.expected}`);
      });
    }
    
    if (medium.length > 0) {
      console.log(`\n🟡 MEDIUM (${medium.length})`);
      medium.forEach(i => {
        console.log(`  • ${i.issue}`);
        if (i.values) console.log(`    Values: ${i.values}`);
        if (i.current) console.log(`    Current: ${i.current}`);
        if (i.expected) console.log(`    Expected: ${i.expected}`);
      });
    }
    
    if (low.length > 0) {
      console.log(`\n🔵 LOW (${low.length})`);
      low.forEach(i => {
        console.log(`  • ${i.issue}`);
        if (i.current) console.log(`    Current: ${i.current}`);
      });
    }
  }
  
  const totalIssues = Object.values(allIssues).flat().length;
  console.log('\n\n' + '═'.repeat(80));
  console.log(`📊 TOTAL ISSUES: ${totalIssues}`);
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
  
  await generateReport(allIssues);
  
  console.log('📁 All screenshots: apps/web/screenshots/comprehensive-audit/');
  console.log('✅ Comprehensive audit complete\n');
})();
