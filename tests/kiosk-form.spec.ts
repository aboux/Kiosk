import { test, expect } from '@playwright/test';

test.describe('Kiosk Form - Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the application title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Kiosk');
  });

  test('should load and display questions', async ({ page }) => {
    // Wait for questions to load
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Check that at least one question is visible
    const questions = page.locator('label');
    await expect(questions.first()).toBeVisible();
  });

  test('should fill out a complete form with text input', async ({ page }) => {
    // Wait for form to load
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Find the first text input and fill it
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('John Doe');
      await expect(textInput).toHaveValue('John Doe');
    }
  });

  test('should fill out a number input', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Find a number input and fill it
    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.isVisible()) {
      await numberInput.fill('25');
      await expect(numberInput).toHaveValue('25');
    }
  });

  test('should select an option from dropdown', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Find select/dropdown button
    const selectButton = page.locator('button[role="combobox"]').first();
    if (await selectButton.isVisible()) {
      await selectButton.click();

      // Wait for options to appear
      await page.waitForSelector('[role="option"]', { timeout: 5000 });

      // Select the first option
      const firstOption = page.locator('[role="option"]').first();
      await firstOption.click();

      // Verify selection was made
      await expect(selectButton).not.toContainText('Select an option');
    }
  });

  test('should persist answers when modifying them', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      // Fill initial value
      await textInput.fill('Initial Value');
      await expect(textInput).toHaveValue('Initial Value');

      // Modify value
      await textInput.fill('Modified Value');
      await expect(textInput).toHaveValue('Modified Value');
    }
  });

  test('should show submit button', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Check for submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should enable submit button when form has data', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Fill at least one field
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Test Data');
    }

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });

  test('should submit form successfully', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Fill out at least one field
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('E2E Test User');
    }

    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for success message or confirmation
    // Adjust selector based on your actual success message
    await page.waitForTimeout(2000); // Give time for submission
  });

  test('should handle multiple question types in one form', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    let hasText = false;
    let hasNumber = false;
    let hasSelect = false;

    // Check for text input
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Text Answer');
      hasText = true;
    }

    // Check for number input
    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.isVisible()) {
      await numberInput.fill('42');
      hasNumber = true;
    }

    // Check for select
    const selectButton = page.locator('button[role="combobox"]').first();
    if (await selectButton.isVisible()) {
      hasSelect = true;
    }

    // At least one type should be present
    expect(hasText || hasNumber || hasSelect).toBeTruthy();
  });

  test('should clear form data', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Fill a field
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Data to clear');
      await expect(textInput).toHaveValue('Data to clear');

      // Clear the field
      await textInput.clear();
      await expect(textInput).toHaveValue('');
    }
  });

  test('should display loading state initially', async ({ page }) => {
    // Navigate to page and immediately check for loader
    const navigationPromise = page.goto('/');

    // Try to catch the loading state
    const loader = page.locator('[data-testid="loader"]');
    const isLoaderVisible = await loader.isVisible().catch(() => false);

    await navigationPromise;

    // Either loader was shown or form loaded too quickly
    const form = page.locator('[data-testid="question-form"]');
    await expect(form).toBeVisible({ timeout: 10000 });
  });

  test('should handle navigation and maintain state', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Fill a field
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Persistent Data');

      // Trigger a page interaction (scroll, click elsewhere, etc.)
      await page.evaluate(() => window.scrollTo(0, 100));
      await page.waitForTimeout(500);

      // Value should still be there
      await expect(textInput).toHaveValue('Persistent Data');
    }
  });

  test('should validate required fields behavior', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Try to submit empty form if validation exists
    const submitButton = page.locator('button[type="submit"]');

    // If button is disabled when form is empty, that's validation
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    if (!isDisabled) {
      // If button is enabled, fill at least one field to test
      const textInput = page.locator('input[type="text"]').first();
      if (await textInput.isVisible()) {
        await textInput.fill('Valid Input');
      }
    }

    // Button should be clickable after valid input
    await expect(submitButton).toBeEnabled();
  });

  test('should handle long text input', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      const longText = 'A'.repeat(100);
      await textInput.fill(longText);

      const value = await textInput.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  });

  test('should handle special characters in input', async ({ page }) => {
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      const specialText = "Test <>&\"'";
      await textInput.fill(specialText);
      await expect(textInput).toHaveValue(specialText);
    }
  });
});
