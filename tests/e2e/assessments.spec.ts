import { test, expect } from '@playwright/test';

test.describe('Assessment Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');
    
    // Navigate to first job's assessment builder
    const firstJobCard = page.locator('[data-testid="job-card"]').first();
    await firstJobCard.click();
    
    // Assuming there's a link to assessment builder in job details
    // For now, navigate directly
    const jobId = await page.evaluate(() => {
      const url = window.location.pathname;
      return url.split('/')[2]; // Extract job ID from URL
    });
    
    await page.goto(`/jobs/${jobId}/assessments/builder`);
    await page.waitForLoadState('networkidle');
  });

  test('should create assessment with conditional logic', async ({ page }) => {
    // Add a section
    await page.click('button:has-text("Add Section")');
    
    // Add first question
    await page.click('button:has-text("Add Question")');
    
    // Configure first question
    await page.fill('input[placeholder*="Question Title"]', 'Do you have React experience?');
    await page.selectOption('select', 'single-choice');
    
    // Add options
    await page.fill('input[placeholder*="Add new option"]', 'Yes');
    await page.click('button:has-text("Add")');
    await page.fill('input[placeholder*="Add new option"]', 'No');
    await page.click('button:has-text("Add")');
    
    // Add second question with conditional logic
    await page.click('button:has-text("Add Question")');
    await page.fill('input[placeholder*="Question Title"]', 'Describe your React experience');
    
    // Set up conditional logic
    await page.selectOption('select[name="conditionalDependsOn"]', { index: 1 }); // First question
    await page.fill('input[name="conditionalValue"]', 'Yes');
    
    // Save assessment
    await page.click('button:has-text("Save Assessment")');
    
    // Verify success message
    await expect(page.locator('.toast')).toContainText('saved successfully');
  });

  test('should preview assessment with conditional logic', async ({ page }) => {
    // Navigate to preview
    await page.click('button:has-text("Preview")');
    
    // Fill out form to test conditional logic
    await page.check('input[value="Yes"]');
    
    // Verify conditional question appears
    await expect(page.locator('text=Describe your React experience')).toBeVisible();
    
    // Change answer
    await page.check('input[value="No"]');
    
    // Verify conditional question disappears
    await expect(page.locator('text=Describe your React experience')).not.toBeVisible();
  });
});