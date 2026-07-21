import { test, expect } from '@playwright/test';
import { expectNoBrokenImages } from './helpers';

test('homepage loads and lists posts', async ({ page }) => {
  await page.goto('');
  await expect(page).toHaveTitle(/A\.B\. Quine Photography/);

  const postLinks = page.locator('a.post-title-link');
  await expect(postLinks.first()).toBeVisible();
  expect(await postLinks.count()).toBeGreaterThan(0);
});

test('homepage has no broken images', async ({ page }) => {
  await page.goto('');
  await expectNoBrokenImages(page);
});

test('nav links to about and archives resolve', async ({ page }) => {
  await page.goto('');

  const aboutResponse = await page.request.get('about/');
  expect(aboutResponse.status()).toBe(200);

  const archivesResponse = await page.request.get('archives/');
  expect(archivesResponse.status()).toBe(200);
});
