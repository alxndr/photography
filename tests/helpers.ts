import { Page, expect } from '@playwright/test';

/**
 * Asserts every <img> on the current page loaded successfully (naturalWidth > 0),
 * and reports the failing src attributes so a broken-asset-path bug is easy to spot.
 */
export async function expectNoBrokenImages(page: Page) {
  const images = page.locator('img');
  const count = await images.count();
  expect(count, `expected at least one <img> on ${page.url()}`).toBeGreaterThan(0);

  const broken: string[] = [];
  for (let i = 0; i < count; i++) {
    const image = images.nth(i);
    const src = await image.getAttribute('src');
    const naturalWidth = await image.evaluate((element: HTMLImageElement) => element.naturalWidth);
    if (naturalWidth === 0) {
      broken.push(src ?? '(no src)');
    }
  }

  expect(broken, `broken image(s) on ${page.url()}`).toEqual([]);
}

/** Collects the href of every same-origin <a> on the current page. */
export async function collectSameOriginLinks(page: Page): Promise<string[]> {
  const origin = new URL(page.url()).origin;
  const hrefs = await page.locator('a[href]').evaluateAll((anchors: HTMLAnchorElement[]) =>
    anchors.map((anchor) => anchor.href)
  );
  return [...new Set(hrefs.filter((href) => href.startsWith(origin)))];
}
