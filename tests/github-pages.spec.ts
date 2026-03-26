import { expect, test } from "@playwright/test";

test("homepage links stay under GitHub Pages base path", async ({ page }) => {
  await page.goto("./");

  const primaryCta = page
    .getByRole("link", { name: "Ver todos los modelos" })
    .first();
  await expect(primaryCta).toHaveAttribute(
    "href",
    "/app-comparativa-modelos/modelos/",
  );

  const featuredCards = page.locator(
    'main .grid a[href^="/app-comparativa-modelos/modelos/"]',
  );
  await expect(featuredCards.first()).toBeVisible();

  await featuredCards.first().click();
  await expect(page).toHaveURL(/\/app-comparativa-modelos\/modelos\/[^/]+\/$/);
});

test("benchmark and recommendation detail links resolve with the base path", async ({
  page,
}) => {
  await page.goto("benchmarks/");

  await page
    .locator('main .grid > a[href^="/app-comparativa-modelos/benchmarks/"]')
    .first()
    .click();
  await expect(page).toHaveURL(
    /\/app-comparativa-modelos\/benchmarks\/[^/]+\/$/,
  );

  await page
    .locator('main a[href^="/app-comparativa-modelos/modelos/"]')
    .first()
    .click();
  await expect(page).toHaveURL(/\/app-comparativa-modelos\/modelos\/[^/]+\/$/);

  await page.goto("recomendaciones/");
  await page
    .locator('main a[href^="/app-comparativa-modelos/recomendaciones/"]')
    .first()
    .click();
  await expect(page).toHaveURL(
    /\/app-comparativa-modelos\/recomendaciones\/[^/]+\/$/,
  );
});

test("mobile navigation and scroll-to-top work across the GitHub Pages build", async ({
  page,
  isMobile,
}) => {
  test.skip(
    !isMobile,
    "This interaction is only relevant on the mobile layout.",
  );

  await page.goto("modelos/");
  await page.locator("#scroll-to-top").waitFor({ state: "attached" });
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(300);

  const scrollButton = page.locator("#scroll-to-top");
  await expect(scrollButton).toBeVisible();
  await scrollButton.click();

  await expect
    .poll(async () => page.evaluate(() => window.scrollY))
    .toBeLessThan(50);

  await page.goto("./");
  await page.locator("#mobile-menu-button").click();
  const mobilePlatformsLink = page.locator(
    '#mobile-menu a[href="/app-comparativa-modelos/plataformas/"]',
  );
  await mobilePlatformsLink.click();
  await expect(page).toHaveURL("/app-comparativa-modelos/plataformas/");
});
