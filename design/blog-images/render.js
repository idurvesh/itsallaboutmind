import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.goto('file://' + path.resolve(process.argv[2]), { waitUntil: 'load' });
  await page.screenshot({ path: process.argv[3], type: 'jpeg', quality: 92 });
  await browser.close();
})();
