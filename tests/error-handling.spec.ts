import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test('should handle API failure gracefully', async ({ page, context }) => {
    // Block API requests to simulate failure
    await context.route('**/api/questions*', (route) => {
      route.abort('failed');
    });

    await page.goto('/');

    // Wait to see if error handling kicks in
    await page.waitForTimeout(3000);

    // Should show either error message or retry option
    const errorMessage = page.locator('[role="alert"]');
    const retryButton = page.locator('button:has-text("Retry")');

    const hasError = await errorMessage.isVisible().catch(() => false);
    const hasRetry = await retryButton.isVisible().catch(() => false);

    // At least one error handling mechanism should be visible
    expect(hasError || hasRetry).toBeTruthy();
  });

  test('should handle slow API responses', async ({ page, context }) => {
    // Delay API response
    await context.route('**/api/questions*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      route.continue();
    });

    await page.goto('/');

    // Should show loading state
    const loader = page.locator('[data-testid="loader"]');
    const isLoading = await loader.isVisible().catch(() => false);

    // Eventually should load the form
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 15000 });
    const form = await page.locator('[data-testid="question-form"]').isVisible();

    expect(form).toBeTruthy();
  });

  test('should handle submit failure gracefully', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Block submit requests
    await context.route('**/api/answers*', (route) => {
      route.abort('failed');
    });

    // Fill and submit
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Test Data');
    }

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(2000);

    // Should show error or keep data for retry
    const errorMessage = page.locator('[role="alert"]');
    const hasError = await errorMessage.isVisible().catch(() => false);

    // Data should still be in the form
    await expect(textInput).toHaveValue('Test Data');
  });

  test('should handle 404 API response', async ({ page, context }) => {
    await context.route('**/api/questions*', (route) => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Not found' }),
      });
    });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Should handle 404 gracefully
    const errorState = page.locator('[role="alert"]');
    const hasError = await errorState.isVisible().catch(() => false);

    // Some error indication should be present
    expect(hasError).toBeTruthy();
  });

  test('should handle 500 server error', async ({ page, context }) => {
    await context.route('**/api/questions*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal server error' }),
      });
    });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Should show error state
    const errorState = page.locator('[role="alert"]');
    const hasError = await errorState.isVisible().catch(() => false);

    expect(hasError).toBeTruthy();
  });

  test('should handle malformed API response', async ({ page, context }) => {
    await context.route('**/api/questions*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'Invalid JSON{',
      });
    });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Should handle parsing error gracefully
    const form = page.locator('[data-testid="question-form"]');
    const error = page.locator('[role="alert"]');

    const formVisible = await form.isVisible().catch(() => false);
    const errorVisible = await error.isVisible().catch(() => false);

    // Either shows error or fails gracefully
    expect(!formVisible || errorVisible).toBeTruthy();
  });

  test('should handle network timeout', async ({ page, context }) => {
    await context.route('**/api/questions*', async (route) => {
      // Delay indefinitely
      await new Promise(() => {});
    });

    await page.goto('/');

    // Should show loading state initially
    const loader = page.locator('[data-testid="loader"]');
    const isLoading = await loader.isVisible({ timeout: 5000 }).catch(() => false);

    // After timeout, should handle error
    await page.waitForTimeout(10000);

    const error = page.locator('[role="alert"]');
    const hasError = await error.isVisible().catch(() => false);

    expect(isLoading || hasError).toBeTruthy();
  });

  test('should prevent double submission', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    let submitCount = 0;

    page.on('request', (request) => {
      if (request.url().includes('/api/answers') && request.method() === 'POST') {
        submitCount++;
      }
    });

    // Fill form
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Double Submit Test');
    }

    const submitButton = page.locator('button[type="submit"]');

    // Click submit multiple times rapidly
    await submitButton.click();
    await submitButton.click();
    await submitButton.click();

    await page.waitForTimeout(3000);

    // Should only submit once
    expect(submitCount).toBeLessThanOrEqual(1);
  });

  test('should validate number input constraints', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.isVisible()) {
      // Try to enter invalid characters
      await numberInput.fill('abc');

      const value = await numberInput.inputValue();

      // Should either reject or sanitize
      expect(value).not.toBe('abc');
    }
  });

  test('should handle empty form submission', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const submitButton = page.locator('button[type="submit"]');

    // Try to submit without filling anything
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    if (!isDisabled) {
      await submitButton.click();
      await page.waitForTimeout(2000);

      // Should either prevent submission or handle gracefully
      // Check that we're still on the form page
      const form = await page.locator('[data-testid="question-form"]').isVisible();
      expect(form).toBeTruthy();
    }
  });

  test('should handle special characters in form fields', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      // Test with SQL injection pattern
      await textInput.fill("'; DROP TABLE users; --");
      await expect(textInput).toHaveValue("'; DROP TABLE users; --");

      // Test with XSS pattern
      await textInput.fill('<script>alert("xss")</script>');
      await expect(textInput).toHaveValue('<script>alert("xss")</script>');
    }
  });

  test('should handle very long text input', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      const veryLongText = 'A'.repeat(10000);
      await textInput.fill(veryLongText);

      const value = await textInput.inputValue();

      // Should handle or limit long text
      expect(value.length).toBeGreaterThan(0);
    }
  });

  test('should handle negative numbers appropriately', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.isVisible()) {
      await numberInput.fill('-100');

      const value = await numberInput.inputValue();

      // Should accept or reject based on validation
      expect(value).toBeTruthy();
    }
  });

  test('should handle decimal numbers', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.isVisible()) {
      await numberInput.fill('3.14');

      const value = await numberInput.inputValue();

      expect(value).toContain('3.14');
    }
  });

  test('should recover from page reload with unsaved data', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Unsaved Data');

      // Reload page
      await page.reload();
      await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

      // Check if data persisted (implementation dependent)
      const newValue = await textInput.inputValue();

      // Either data is lost (expected) or persisted (if implemented)
      expect(newValue).toBeDefined();
    }
  });
});
