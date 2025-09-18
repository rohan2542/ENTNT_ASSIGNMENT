import { test, expect } from '@playwright/test';

test.describe('Candidates Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/candidates');
    await page.waitForLoadState('networkidle');
  });

  test('should display virtualized candidate list', async ({ page }) => {
    await expect(page.locator('[data-testid="candidate-row"]').first()).toBeVisible();
    
    // Check if virtualization is working (not all candidates rendered at once)
    const candidateRows = await page.locator('[data-testid="candidate-row"]').count();
    expect(candidateRows).toBeLessThan(1000); // Should be virtualized
  });

  test('should filter candidates by search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('john');
    
    await page.waitForTimeout(500); // Debounce
    
    const candidates = page.locator('[data-testid="candidate-row"]');
    const count = await candidates.count();
    
    for (let i = 0; i < count; i++) {
      const candidateText = await candidates.nth(i).textContent();
      expect(candidateText?.toLowerCase()).toContain('john');
    }
  });

  test('should move candidate between kanban stages', async ({ page }) => {
    await page.goto('/kanban');
    await page.waitForLoadState('networkidle');
    
    const candidate = page.locator('[data-testid="kanban-card"]').first();
    const targetColumn = page.locator('[data-testid="kanban-column"][data-stage="screen"]');
    
    await candidate.dragTo(targetColumn);
    
    // Verify the candidate moved
    await expect(targetColumn.locator('[data-testid="kanban-card"]')).toContainText(await candidate.textContent() || '');
  });
});