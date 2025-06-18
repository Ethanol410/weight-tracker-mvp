import { test, expect } from '@playwright/test';

test.describe('Debug Registration', () => {
  test('should debug webkit registration issues', async ({ page }) => {
    const timestamp = Date.now().toString();
    const testEmail = `debug${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log('Browser name:', page.context().browser()?.browserType().name());
    
    // Go to register page
    await page.goto('/register');
    
    console.log('Current URL after going to register:', page.url());
    
    // Fill the form
    await page.fill('input[name="name"]', 'Debug Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    
    console.log('Form filled, about to submit...');
    
    // Submit and capture any errors immediately
    await page.click('button[type="submit"]');
    
    // Wait a bit for any errors to appear
    await page.waitForTimeout(2000);
    
    console.log('Current URL after submit:', page.url());
    
    // Check for any error messages
    const errorSelectors = [
      '.text-red-500',
      '[role="alert"]', 
      '.error-message',
      '.error',
      '[data-testid="error"]',
      '.text-red-600',
      '.text-danger',
      '[class*="error"]'
    ];
    
    for (const selector of errorSelectors) {
      const errorElements = page.locator(selector);
      const count = await errorElements.count();
      if (count > 0) {
        console.log(`Found ${count} error(s) with selector "${selector}"`);
        for (let i = 0; i < count; i++) {
          const text = await errorElements.nth(i).textContent();
          console.log(`Error ${i + 1}: "${text}"`);
        }
      }
    }
    
    // Check for form validation errors
    const fieldErrors = page.locator('input:invalid, textarea:invalid, select:invalid');
    const invalidCount = await fieldErrors.count();
    if (invalidCount > 0) {
      console.log(`Found ${invalidCount} invalid form field(s)`);
      for (let i = 0; i < invalidCount; i++) {
        const field = fieldErrors.nth(i);
        const name = await field.getAttribute('name');
        const value = await field.inputValue();
        const validationMessage = await field.evaluate(el => (el as HTMLInputElement).validationMessage);
        console.log(`Invalid field "${name}": value="${value}", validation="${validationMessage}"`);
      }
    }
    
    // Check console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });
    
    // Check network errors
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`Network error: ${response.status()} ${response.url()}`);
      }
    });
  });
});
