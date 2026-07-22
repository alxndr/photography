import { test, expect } from '@playwright/test';
import { collectSameOriginLinks } from './helpers';

test('tag cloud page lists at least one tag, and each tag page lists its posts', async ({ page }) => {
  const response = await page.goto('tags/');
  expect(response?.status()).toBe(200);

  const links = await collectSameOriginLinks(page);
  const tagLinks = links.filter((href) => /\/photography\/tags\/[^/]+\/$/.test(href));

  expect(tagLinks.length, 'expected at least one tag on the tag cloud page').toBeGreaterThan(0);

  for (const href of tagLinks) {
    await test.step(href, async () => {
      const tagResponse = await page.goto(href);
      expect(tagResponse?.status()).toBe(200);

      const postLinks = page.locator('a.post-title-link');
      expect(await postLinks.count()).toBeGreaterThan(0);
    });
  }
});
