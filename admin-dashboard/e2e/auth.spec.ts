import { test, expect } from '@playwright/test';

test('should redirect unauthenticated users to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*\/login/);
});

test('should show login form', async ({ page }) => {
  await page.goto('/login');
  // Assuming there is an email input and a sign in button
  // Adjust selectors based on actual UI
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
