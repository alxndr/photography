import { test, expect } from '@playwright/test';
import { expectNoBrokenImages } from './helpers';

test('about page loads', async ({ page }) => {
  await page.goto('about/');
  await expect(page.locator('h1, .post-title').first()).toBeVisible();
});

test('about page images load', async ({ page }) => {
  await page.goto('about/');
  await expectNoBrokenImages(page);
});
