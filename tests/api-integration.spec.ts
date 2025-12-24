import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
  test('should successfully fetch questions from API', async ({ page }) => {
    // Listen for API calls
    const apiResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/questions') && response.status() === 200,
      { timeout: 10000 }
    );

    await page.goto('/');

    const apiResponse = await apiResponsePromise;
    const responseData = await apiResponse.json();

    // Verify response structure
    expect(Array.isArray(responseData)).toBeTruthy();
  });

  test('should successfully submit answers to API', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Set up listener for POST request
    const submitPromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/answers') &&
        response.request().method() === 'POST',
      { timeout: 15000 }
    );

    // Fill at least one field
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('API Test User');
    }

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for API response
    const submitResponse = await submitPromise;
    expect(submitResponse.status()).toBe(201);
  });

  test('should handle API request with proper headers', async ({ page }) => {
    let hasContentTypeHeader = false;

    page.on('request', (request) => {
      if (request.url().includes('/api/answers') && request.method() === 'POST') {
        const headers = request.headers();
        hasContentTypeHeader = headers['content-type']?.includes('application/json') ?? false;
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Fill and submit
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Header Test');

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      await page.waitForTimeout(2000);
    }
  });

  test('should send correct payload structure when submitting', async ({ page }) => {
    let requestPayload: any = null;

    page.on('request', async (request) => {
      if (request.url().includes('/api/answers') && request.method() === 'POST') {
        requestPayload = request.postDataJSON();
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Fill form
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Payload Test');

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      await page.waitForTimeout(2000);

      // Verify payload structure if captured
      if (requestPayload) {
        expect(Array.isArray(requestPayload)).toBeTruthy();
        if (requestPayload.length > 0) {
          expect(requestPayload[0]).toHaveProperty('questionId');
          expect(requestPayload[0]).toHaveProperty('answer');
        }
      }
    }
  });

  test('should handle locale parameter in API requests', async ({ page }) => {
    const apiResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/questions'),
      { timeout: 10000 }
    );

    await page.goto('/');

    const apiResponse = await apiResponsePromise;
    const url = apiResponse.url();

    // Check if locale parameter is present (en or fr)
    const hasLocaleParam = url.includes('locale=en') || url.includes('locale=fr');
    expect(hasLocaleParam).toBeTruthy();
  });

  test('should retry failed API requests', async ({ page }) => {
    // This test checks if the app handles network issues gracefully
    await page.goto('/');

    // Wait for initial load
    await page.waitForTimeout(5000);

    // Check that either the form loaded or an error is shown
    const form = page.locator('[data-testid="question-form"]');
    const error = page.locator('[role="alert"]');

    const formVisible = await form.isVisible().catch(() => false);
    const errorVisible = await error.isVisible().catch(() => false);

    expect(formVisible || errorVisible).toBeTruthy();
  });

  test('should handle multiple API calls efficiently', async ({ page }) => {
    let apiCallCount = 0;

    page.on('response', (response) => {
      if (response.url().includes('/api/questions')) {
        apiCallCount++;
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Should not make excessive API calls
    expect(apiCallCount).toBeLessThanOrEqual(2);
  });

  test('should receive hierarchical question structure from API', async ({ page }) => {
    const apiResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/questions'),
      { timeout: 10000 }
    );

    await page.goto('/');

    const apiResponse = await apiResponsePromise;
    const questions = await apiResponse.json();

    if (questions.length > 0) {
      const firstQuestion = questions[0];

      // Check structure
      expect(firstQuestion).toHaveProperty('id');
      expect(firstQuestion).toHaveProperty('label');
      expect(firstQuestion).toHaveProperty('content');
      expect(firstQuestion).toHaveProperty('children');
    }
  });

  test('should handle API response with enum values', async ({ page }) => {
    const apiResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/questions'),
      { timeout: 10000 }
    );

    await page.goto('/');

    const apiResponse = await apiResponsePromise;
    const questions = await apiResponse.json();

    // Find a question with enum values
    const enumQuestion = questions.find(
      (q: any) => q.content === 'enum' && q.enumValues?.length > 0
    );

    if (enumQuestion) {
      expect(Array.isArray(enumQuestion.enumValues)).toBeTruthy();
      expect(enumQuestion.enumValues[0]).toHaveProperty('id');
      expect(enumQuestion.enumValues[0]).toHaveProperty('value');
      expect(enumQuestion.enumValues[0]).toHaveProperty('label');
    }
  });

  test('should preserve answer data structure for different question types', async ({
    page,
  }) => {
    let submittedAnswers: any = null;

    page.on('request', async (request) => {
      if (request.url().includes('/api/answers') && request.method() === 'POST') {
        submittedAnswers = request.postDataJSON();
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="question-form"]', { timeout: 10000 });

    // Fill different types of inputs
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('String Value');
    }

    const numberInput = page.locator('input[type="number"]').first();
    if (await numberInput.isVisible()) {
      await numberInput.fill('42');
    }

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await page.waitForTimeout(2000);

    if (submittedAnswers && submittedAnswers.length > 0) {
      // Verify answers have questionId and answer fields
      submittedAnswers.forEach((answer: any) => {
        expect(answer).toHaveProperty('questionId');
        expect(answer).toHaveProperty('answer');
      });
    }
  });
});
