import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to a good standard size with high device scale factor for 4k quality
  await page.setViewport({
    width: 1200,
    height: 1200,
    deviceScaleFactor: 2,
  });

  await page.goto('http://localhost:5173/mockup-renderer.html', { waitUntil: 'networkidle0' });

  // Ensure fonts are loaded
  await page.evaluateHandle('document.fonts.ready');

  // Wait a bit extra for the background image to render completely
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.screenshot({ path: 'public/ebook-v3-mockup.png', fullPage: true });

  await browser.close();
  console.log('Screenshot saved to public/ebook-v3-mockup.png');
})();
