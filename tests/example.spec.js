import { test, expect } from '@playwright/test';

test.describe('IEEE KEC Website', () => {
  test('Home page loads successfully and displays the Join button', async ({ page }) => {
    // Navigate to local website
    await page.goto('/#/', { waitUntil: 'domcontentloaded' });

    // Verify page title
    await expect(page).toHaveTitle(/IEEE/i);

    // Verify "Join KEC IEEE SB" button is present in the Hero section
    const joinButton = page.getByRole('link', { name: 'Join KEC IEEE SB', exact: true }).first();
    await expect(joinButton).toBeVisible();
  });

  test('Navbar contains Execomm and navigation items', async ({ page }) => {
    await page.goto('/#/', { waitUntil: 'domcontentloaded' });

    // Check if Execomm menu item exists in Navbar
    const execomm = page.getByRole('button', { name: /Execomm/i });
    await expect(execomm).toBeVisible();
  });
});
