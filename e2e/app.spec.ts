import { test, expect } from '@playwright/test';

test.describe('Netflex App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for content to load
    await page.waitForSelector('.movie-card', { timeout: 15000 });
  });

  test('homepage loads with hero banner', async ({ page }) => {
    // Verify hero section exists (uses .hero class)
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    
    // Verify play button exists
    const playButton = page.locator('.hero-content .btn-primary');
    await expect(playButton).toBeVisible();
    
    // Take screenshot of full homepage
    await page.screenshot({ 
      path: 'screenshots/01-homepage.png',
      fullPage: false 
    });
  });

  test('movie rows display correctly', async ({ page }) => {
    // Verify trending row exists
    const trendingRow = page.locator('text=Trending Now');
    await expect(trendingRow).toBeVisible();
    
    // Verify movie cards exist
    const movieCards = page.locator('.movie-card');
    await expect(movieCards.first()).toBeVisible();
    
    // Scroll to show movie rows
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);
    
    // Take screenshot of movie rows
    await page.screenshot({ 
      path: 'screenshots/02-movie-rows.png',
      fullPage: false 
    });
  });

  test('movie card hover effect works', async ({ page }) => {
    // Scroll to movie row
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);
    
    // Hover over first movie card - this triggers CSS :hover which adds .visible class
    const firstCard = page.locator('.movie-card').first();
    await firstCard.hover();
    await page.waitForTimeout(800);
    
    // Screenshot after hover (the overlay should be visible via CSS)
    await page.screenshot({ 
      path: 'screenshots/03-card-hover.png',
      fullPage: false 
    });
  });

  test('movie modal opens on click', async ({ page }) => {
    // Scroll to movie row
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    
    // Click on a movie card
    const firstCard = page.locator('.movie-card').first();
    await firstCard.click();
    
    // Wait for modal to appear
    await page.waitForSelector('.modal-overlay', { timeout: 5000 });
    
    // Verify modal content
    const modalTitle = page.locator('.modal-content .movie-title');
    await expect(modalTitle).toBeVisible();
    
    const playButton = page.locator('.modal-content .btn-primary');
    await expect(playButton).toBeVisible();
    
    // Take screenshot of modal
    await page.screenshot({ 
      path: 'screenshots/04-movie-modal.png',
      fullPage: false 
    });
  });

  test('modal closes correctly', async ({ page }) => {
    // Open modal
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    await page.locator('.movie-card').first().click();
    await page.waitForSelector('.modal-overlay', { timeout: 5000 });
    
    // Click close button
    const closeButton = page.locator('.modal-content .close-btn');
    await closeButton.click();
    
    // Verify modal is closed
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'screenshots/05-modal-closed.png',
      fullPage: false 
    });
  });

  test('full page screenshot for README', async ({ page }) => {
    // Wait for all content to load
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'screenshots/full-page.png',
      fullPage: true 
    });
  });
});
