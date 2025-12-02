import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

await page.goto('http://localhost:3001');
await page.waitForTimeout(500);

// Click Reference tab
await page.click('button:has-text("Reference")');
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshot-reference.png', fullPage: true });
console.log('Saved screenshot-reference.png');

await browser.close();
