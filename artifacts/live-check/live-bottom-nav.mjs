import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto("https://hugobepa.github.io/app-comparativa-modelos/", {
  waitUntil: "networkidle",
  timeout: 60000,
});

const candidates = page.locator(
  'a[href="/app-comparativa-modelos/plataformas/"]',
);
const count = await candidates.count();
const visibility = [];
for (let index = 0; index < count; index += 1) {
  visibility.push({ index, visible: await candidates.nth(index).isVisible() });
}

const visibleLink = page
  .locator('a[href="/app-comparativa-modelos/plataformas/"]:visible')
  .first();
await visibleLink.click();
await page.waitForURL(/\/app-comparativa-modelos\/plataformas\/$/, {
  timeout: 15000,
});
await page.screenshot({
  path: "artifacts/live-check/plataformas-mobile.png",
  fullPage: true,
});

console.log(JSON.stringify({ count, visibility, url: page.url() }, null, 2));
await browser.close();
