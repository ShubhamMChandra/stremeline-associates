/**
 * What this does: Captures screenshots of the live terminal component animation
 * Why it's here: To verify the terminal component renders and animates correctly
 * How it works: Opens localhost:3001, scrolls to terminal, waits and captures multiple screenshots
 * Dependencies: playwright
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testTerminal() {
  console.log('🚀 Starting terminal component test...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // Navigate to homepage
    console.log('📍 Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Scroll down to find the terminal component
    console.log('📜 Scrolling to find terminal component...');
    
    // Look for text "stremeline-cli" in the title bar
    const terminalTitleBar = page.locator('text=stremeline-cli');
    const terminalExists = await terminalTitleBar.count();
    
    if (terminalExists > 0) {
      console.log('✅ Terminal component found by title bar!');
      await terminalTitleBar.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    } else {
      // If not found, scroll down more aggressively
      console.log('🔍 Scrolling down page more to find terminal...');
      await page.evaluate(() => window.scrollBy(0, 1800));
      await page.waitForTimeout(500);
    }

    // Screenshot 1: Initial state
    console.log('📸 Taking screenshot 1 (initial state)...');
    await page.screenshot({ 
      path: join(__dirname, '../screenshots/terminal-1-initial.png'),
      fullPage: false
    });

    // Wait for typing animation
    console.log('⏳ Waiting 3 seconds for typing animation...');
    await page.waitForTimeout(3000);

    // Screenshot 2: During typing
    console.log('📸 Taking screenshot 2 (typing in progress)...');
    await page.screenshot({ 
      path: join(__dirname, '../screenshots/terminal-2-typing.png'),
      fullPage: false
    });

    // Wait for command to complete and output to appear
    console.log('⏳ Waiting 4 more seconds for output lines...');
    await page.waitForTimeout(4000);

    // Screenshot 3: Output appearing
    console.log('📸 Taking screenshot 3 (output appearing)...');
    await page.screenshot({ 
      path: join(__dirname, '../screenshots/terminal-3-output.png'),
      fullPage: false
    });

    // Wait a bit more
    console.log('⏳ Waiting 3 more seconds...');
    await page.waitForTimeout(3000);

    // Screenshot 4: More output
    console.log('📸 Taking screenshot 4 (more output)...');
    await page.screenshot({ 
      path: join(__dirname, '../screenshots/terminal-4-complete.png'),
      fullPage: false
    });

    // Analyze the page for terminal component details
    console.log('\n🔍 Analyzing terminal component...\n');
    
    const analysis = await page.evaluate(() => {
      const results = {
        terminalFound: false,
        titleBar: null,
        commandLine: null,
        outputLines: 0,
        cursorVisible: false,
        componentClasses: [],
        fullText: null
      };

      // Look for the specific title bar with "stremeline-cli"
      const titleBarElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent?.includes('stremeline-cli')
      );
      
      if (titleBarElements.length > 0) {
        results.terminalFound = true;
        results.titleBar = 'stremeline-cli';
        
        // Find the terminal container (should be a parent element)
        const titleBar = titleBarElements[0];
        const terminal = titleBar?.closest('[class*="rounded"]') || titleBar?.parentElement?.parentElement;
        
        if (terminal) {
          results.componentClasses = Array.from(terminal.classList);
          
          // Get all text content
          results.fullText = terminal.textContent;
          
          // Count elements that look like lines
          const allDivs = terminal.querySelectorAll('div');
          results.outputLines = Array.from(allDivs).filter(div => {
            const text = div.textContent?.trim();
            return text && text.length > 0 && text !== 'stremeline-cli';
          }).length;
          
          // Check for cursor - look for any element with animation
          const animatedElements = terminal.querySelectorAll('[style*="animation"]');
          results.cursorVisible = animatedElements.length > 0;
        }
      }
      
      return results;
    });

    console.log('Analysis Results:');
    console.log('=================');
    console.log('Terminal Found:', analysis.terminalFound);
    console.log('Title Bar Text:', analysis.titleBar || 'Not found');
    console.log('Command Line:', analysis.commandLine || 'Not found');
    console.log('Output Lines:', analysis.outputLines);
    console.log('Cursor Visible:', analysis.cursorVisible);
    console.log('Component Classes:', analysis.componentClasses.join(', ') || 'None');
    console.log('\nTerminal Text Content:');
    console.log('---------------------');
    console.log(analysis.fullText || 'No text captured');
    
    console.log('\n✅ Screenshots saved to apps/web/screenshots/');
    console.log('   - terminal-1-initial.png');
    console.log('   - terminal-2-typing.png');
    console.log('   - terminal-3-output.png');
    console.log('   - terminal-4-complete.png\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testTerminal();
