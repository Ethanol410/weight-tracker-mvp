import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to register and login', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Click register button/link (correct text)
    await page.click('text=Créer un compte');
    
    // Fill registration form (only 3 fields: name, email, password)
    const timestamp = Date.now().toString();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
      await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    // Note: No confirmPassword field in our app
    
    // Submit registration
    await page.click('button[type="submit"]');
    
    // Wait for the form to be processed
    await page.waitForTimeout(2000);
    
    // Check for validation errors first
    const errorElements = await page.locator('[role="alert"], .text-red-500, .text-red-600').all();
    if (errorElements.length > 0) {
      for (let i = 0; i < errorElements.length; i++) {
        const errorText = await errorElements[i].textContent();
        if (errorText && errorText.trim()) {
          throw new Error(`Registration failed with error: ${errorText}`);
        }
      }
    }
    
    // Wait for navigation or check if we're still on register page
    const currentUrl = page.url();
    if (currentUrl.includes('/register')) {
      // If still on register page, wait for redirect
      await page.waitForURL(/.*\/login.*/, { timeout: 10000 });
    }
    
    // Should redirect to login page with success message (not dashboard directly)
    await expect(page).toHaveURL(/login/);
    
    // Should show success message
    await expect(page.locator('text=Inscription réussie')).toBeVisible();

    // Now login with the created account
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Should show dashboard elements
    await expect(page.locator('text=Weight Tracker')).toBeVisible();    // Logout
    await page.click('text=Se déconnecter');
    
    // Should redirect to login (not home)
    await expect(page).toHaveURL('/login');
      // Login with same credentials - already on login page
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard again
    await expect(page).toHaveURL('/dashboard');
  });  test('should show validation errors for invalid registration', async ({ page }) => {
    await page.goto('/register');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors (in French)
    await expect(page.locator('text=Le nom est requis')).toBeVisible();
    await expect(page.locator('text=L\'email est requis')).toBeVisible();
    await expect(page.locator('text=Le mot de passe est requis')).toBeVisible();
    
    // Clear errors by filling valid name
    await page.fill('input[name="name"]', 'Test User');
    
    // Fill invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.locator('input[name="email"]').blur();
    
    await expect(page.locator('text=Format d\'email invalide')).toBeVisible();
    
    // Fill short password
    await page.fill('input[name="password"]', '123');
    await page.locator('input[name="password"]').blur();
    
    await expect(page.locator('text=Le mot de passe doit contenir au moins 6 caractères')).toBeVisible();
  });
});
