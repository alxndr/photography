import { test, expect } from '@playwright/test';

const categories = ['2022-ireland', '2016-south-america', '2016-vermont', '2017-cuba'];

for (const category of categories) {
  test(`category page ${category} lists its posts`, async ({ page }) => {
    const response = await page.goto(`${category}/`);
    expect(response?.status()).toBe(200);

    const postLinks = page.locator('a.post-title-link');
    expect(await postLinks.count()).toBeGreaterThan(0);
  });
}
