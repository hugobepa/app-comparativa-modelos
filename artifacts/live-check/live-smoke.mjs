import { chromium } from "playwright";

const base = "https://hugobepa.github.io/app-comparativa-modelos/";
const browser = await chromium.launch();
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
const desktop = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
});
const results = [];

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({
      name,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

await check("home loads", async () => {
  await mobile.goto(base, { waitUntil: "networkidle", timeout: 60000 });
  await mobile.locator("h1").waitFor({ timeout: 10000 });
  await mobile.screenshot({
    path: "artifacts/live-check/home-mobile.png",
    fullPage: true,
  });
});

await check("home CTA goes to modelos", async () => {
  const cta = mobile
    .getByRole("link", { name: /Ver todos los modelos/i })
    .first();
  const href = await cta.getAttribute("href");
  if (href !== "/app-comparativa-modelos/modelos/") {
    throw new Error(`Unexpected href: ${href}`);
  }
  await cta.click();
  await mobile.waitForURL(/\/app-comparativa-modelos\/modelos\/$/, {
    timeout: 15000,
  });
  await mobile.screenshot({
    path: "artifacts/live-check/modelos-mobile.png",
    fullPage: true,
  });
});

await check("model card opens detail", async () => {
  await mobile
    .locator('#modelos-grid a[href^="/app-comparativa-modelos/modelos/"]')
    .first()
    .click();
  await mobile.waitForURL(/\/app-comparativa-modelos\/modelos\/[^/]+\/$/, {
    timeout: 15000,
  });
});

await check("scroll to top button appears on mobile", async () => {
  await mobile.goto(`${base}modelos/`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await mobile.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await mobile.waitForTimeout(800);
  await mobile
    .locator("#scroll-to-top")
    .waitFor({ state: "visible", timeout: 10000 });
});

await check("bottom nav goes to plataformas", async () => {
  await mobile.goto(base, { waitUntil: "networkidle", timeout: 60000 });
  await mobile
    .locator('nav a[href="/app-comparativa-modelos/plataformas/"]')
    .last()
    .click();
  await mobile.waitForURL(/\/app-comparativa-modelos\/plataformas\/$/, {
    timeout: 15000,
  });
  await mobile.screenshot({
    path: "artifacts/live-check/plataformas-mobile.png",
    fullPage: true,
  });
});

await check("desktop benchmarks opens detail", async () => {
  await desktop.goto(`${base}benchmarks/`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await desktop
    .locator('main a[href^="/app-comparativa-modelos/benchmarks/"]')
    .first()
    .click();
  await desktop.waitForURL(/\/app-comparativa-modelos\/benchmarks\/[^/]+\/$/, {
    timeout: 15000,
  });
  await desktop.screenshot({
    path: "artifacts/live-check/benchmark-desktop.png",
    fullPage: true,
  });
});

console.log(JSON.stringify(results, null, 2));
await browser.close();
