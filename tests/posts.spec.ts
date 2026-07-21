import { test, expect } from '@playwright/test';
import { expectNoBrokenImages, collectSameOriginLinks } from './helpers';

test('every post reachable from the homepage loads with no broken images', async ({ page }) => {
  await page.goto('');
  const links = await collectSameOriginLinks(page);
  const postLinks = links.filter((href) => /\/photography\/\d{4}-[^/]+\/[^/]+\/$/.test(href));

  expect(postLinks.length, 'expected at least one post link on the homepage').toBeGreaterThan(0);

  for (const href of postLinks) {
    await test.step(href, async () => {
      const response = await page.goto(href);
      expect(response?.status()).toBe(200);
      await expectNoBrokenImages(page);
    });
  }
});
