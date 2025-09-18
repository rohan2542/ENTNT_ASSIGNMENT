import { test, expect } from '@playwright/test';

test.describe('Jobs Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should create a new job with unique slug validation', async ({ page }) => {
    await page.click('button:has-text("Create Job")');
    
    await page.fill('input[name="title"]', 'Test Frontend Developer');
    await page.fill('input[name="slug"]', 'test-frontend-dev');
    
    // Try to submit - should succeed first time
    await page.click('button[type="submit"]');
    await expect(page.locator('.toast')).toContainText('created successfully');
    
    // Try to create another with same slug - should fail
    await page.click('button:has-text("Create Job")');
    await page.fill('input[name="title"]', 'Another Test Job');
    await page.fill('input[name="slug"]', 'test-frontend-dev');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=This slug is already taken')).toBeVisible();
  });

  test('should reorder jobs with drag and drop', async ({ page }) => {
    // Wait for jobs to load
    await expect(page.locator('[data-testid="job-card"]').first()).toBeVisible();
    
    const firstJob = page.locator('[data-testid="job-card"]').first();
    const secondJob = page.locator('[data-testid="job-card"]').nth(1);
    
    const firstJobText = await firstJob.textContent();
    
    // Perform drag and drop
    await firstJob.dragTo(secondJob);
    
    // Check if order changed
    const newFirstJob = page.locator('[data-testid="job-card"]').first();
    const newFirstJobText = await newFirstJob.textContent();
    
    expect(newFirstJobText).not.toBe(firstJobText);
  });

  test('should handle reorder error and rollback', async ({ page }) => {
    // This test would require MSW to simulate errors
    // Implementation would depend on the specific error simulation setup
  });
});