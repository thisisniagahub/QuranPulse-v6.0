import { test, expect } from '@playwright/test';

test.describe('QuranPulse Core Flow', () => {
  
  test('should navigate from landing to quran reader', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('/');
    
    // Check if we see the brand
    await expect(page.locator('text=QURANPULSE')).toBeVisible();

    // 2. Click Get Started (Assuming it goes to Login)
    const getStartedBtn = page.locator('button:has-text("Mula Sekarang")');
    if (await getStartedBtn.isVisible()) {
        await getStartedBtn.click();
        await expect(page).toHaveURL(/.*login/);
    }

    // 3. Login Flow (Mocking or using test account)
    // For E2E, we usually use a dedicated test account
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@quranpulse.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PW || 'password123');
    await page.click('button:has-text("Log Masuk")');

    // 4. Navigate to Quran
    // Wait for Dashboard
    await page.waitForURL('**/');
    
    // Click Quran in Nav
    await page.click('nav >> a[href="/quran"]');
    await expect(page).toHaveURL(/.*quran/);

    // 5. Select a Surah
    await page.waitForSelector('text=Al-Fatihah');
    await page.click('text=Al-Fatihah');

    // 6. Verify Reader is open
    await expect(page.locator('h1:has-text("Al-Fatihah")')).toBeVisible();
    
    // Check if verses are loaded
    await page.waitForSelector('.quran-verse-card', { timeout: 10000 });
    const verses = page.locator('.quran-verse-card');
    expect(await verses.count()).toBeGreaterThan(0);
  });

  test('should open Smart Deen AI chat', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@quranpulse.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PW || 'password123');
    await page.click('button:has-text("Log Masuk")');

    await page.click('nav >> a[href="/smart-deen"]');
    await expect(page).toHaveURL(/.*smart-deen/);

    // Check if Ustaz AI is ready
    await expect(page.locator('text=Tanya ustaz apa sahaja')).toBeVisible();

    // Send a message
    await page.fill('textarea', 'Apa khabar?');
    await page.click('button >> i.fa-paper-plane');

    // Check for thinking state or response
    await page.waitForSelector('.chat-message', { timeout: 15000 });
    const messages = page.locator('.chat-message');
    expect(await messages.count()).toBeGreaterThan(1);
  });

});
