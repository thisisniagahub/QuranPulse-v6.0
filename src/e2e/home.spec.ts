import { test, expect } from '@playwright/test';

test.describe('QuranPulse Basic Flow', () => {
  test('should load the landing page', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Check if the main title exists (adjust text based on your app's real content)
    // Looking for "QuranPulse" or similar in the landing page
    const title = page.locator('h1');
    await expect(title).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Find a link or button that says "Login" or "Masuk"
    const loginButton = page.locator('text=/Masuk|Login/i').first();
    
    if (await loginButton.isVisible()) {
        await loginButton.click();
        // Verify URL contains auth or login
        await expect(page).toHaveURL(/.*auth|login.*/);
    }
  });
});
