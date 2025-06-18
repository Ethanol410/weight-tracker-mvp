import { test, expect } from '@playwright/test';

test.describe('Weight Entry Flow', () => {
  let testEmail: string;
  let testPassword: string;
    test.beforeEach(async ({ page }) => {
    // Create a test user for each test
    const timestamp = Date.now().toString();
    testEmail = `weight${timestamp}@example.com`;
    testPassword = 'TestPassword123!';
    
    // Register user
    await page.goto('/register');
    
    // Use different methods for different browsers to handle WebKit issues
    const browserName = page.context().browser()?.browserType().name();
    
    if (browserName === 'webkit') {
      // For WebKit, use type() instead of fill() and add delays
      await page.locator('input[name="name"]').type('Weight Test User', { delay: 100 });
      await page.locator('input[name="email"]').type(testEmail, { delay: 100 });
      await page.locator('input[name="password"]').type(testPassword, { delay: 100 });
      
      // Wait a bit before submit
      await page.waitForTimeout(500);
    } else {
      // For other browsers, use the standard fill method
      await page.fill('input[name="name"]', 'Weight Test User');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', testPassword);
    }
    
    await page.click('button[type="submit"]');
    
    // Wait for either success redirect or error
    try {
      await page.waitForURL('**/login**', { timeout: 8000 });
    } catch {
      // If registration didn't redirect, check for success message or error
      const errorElement = page.locator('.text-red-500, [role="alert"], .error-message');
      if (await errorElement.count() > 0) {
        const errorText = await errorElement.first().textContent();
        throw new Error(`Registration failed: ${errorText}`);
      }
      // If no error, manually navigate to login (might be a race condition)
      await page.goto('/login');
    }
    
    // Ensure we are on login page (handle URL with query params)
    await expect(page).toHaveURL(/.*\/login.*/);
    
    // Login with the same browser-specific approach
    if (browserName === 'webkit') {
      await page.locator('input[name="email"]').type(testEmail, { delay: 100 });
      await page.locator('input[name="password"]').type(testPassword, { delay: 100 });
      await page.waitForTimeout(500);
    } else {
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', testPassword);
    }
    
    await page.click('button[type="submit"]');
    
    // Wait for dashboard redirect
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });
    test('should allow adding daily weight entries', async ({ page }) => {
    // Click on "Nouvelle entrée" button on dashboard - this should navigate to /entry page
    await page.click('text=Nouvelle entrée');
    
    // Should be on entry page
    await expect(page).toHaveURL('/entry');
    
    // On the entry page, there's another "Nouvelle entrée" button to show the form
    await page.click('button:has-text("Nouvelle entrée")');
    
    // Wait for form to appear
    await page.waitForSelector('input[name="weight"]', { timeout: 5000 });
    
    // Fill the form
    await page.fill('input[name="weight"]', '75.5');
    await page.fill('input[name="caloriesConsumed"]', '2000');
    await page.fill('input[name="steps"]', '8000');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should show success behavior (form should hide and entry should appear in list)
    await page.waitForTimeout(1000);
    
    // Should show the entry in the list
    await expect(page.locator('text=75.5')).toBeVisible();
  });
  test('should show validation errors for invalid weight entries', async ({ page }) => {
    await page.click('text=Nouvelle entrée');
    await expect(page).toHaveURL('/entry');
    
    // Click the form button to show the form
    await page.click('button:has-text("Nouvelle entrée")');
    await page.waitForSelector('input[name="weight"]', { timeout: 5000 });
    
    // Try to submit with invalid weight (too low)
    await page.fill('input[name="weight"]', '10');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Le poids doit être entre 30 et 300 kg')).toBeVisible();
    
    // Try with invalid weight (too high)
    await page.fill('input[name="weight"]', '400');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Le poids doit être entre 30 et 300 kg')).toBeVisible();
  });    test('should allow editing weight entries', async ({ page }) => {
    // Navigate to entry page
    await page.goto('/entry');
    
    // First add an entry - check if form is already visible, if not show it
    const weightInput = page.locator('input[name="weight"]');
    if (!(await weightInput.isVisible())) {
      await page.click('button:has-text("Nouvelle entrée")');
      await page.waitForSelector('input[name="weight"]', { timeout: 5000 });
    }    // Fill and submit the form - need to fill ALL required fields
    await page.fill('input[name="weight"]', '70.0');
    await page.fill('input[name="caloriesConsumed"]', '2000');
    await page.fill('input[name="steps"]', '8000');
    // fatigueLevel should default to 5, date should be auto-filled
    
    await page.click('button[type="submit"]');
    
    // Wait for form to be submitted and check for any error messages
    await page.waitForTimeout(2000);
    
    // Check for any error messages first
    const errorMessages = await page.locator('[role="alert"], .text-red-500, .text-red-600, .bg-red-50').all();
    if (errorMessages.length > 0) {
      for (let i = 0; i < errorMessages.length; i++) {
        const errorText = await errorMessages[i].textContent();
        if (errorText && errorText.trim()) {
          console.log(`Error found: ${errorText}`);
        }
      }
    }
    
    // Check if form is still visible (which indicates an error)
    const isFormVisible = await page.locator('input[name="weight"]').isVisible();
    if (isFormVisible) {
      // Log current state for debugging
      console.log('Form is still visible after submission');
      const currentWeight = await page.locator('input[name="weight"]').inputValue();
      console.log('Current weight input value:', currentWeight);
      
      // Try to look for success messages too
      const successMessages = await page.locator('.bg-green-50, .text-green-700').all();
      for (let i = 0; i < successMessages.length; i++) {
        const successText = await successMessages[i].textContent();
        if (successText && successText.trim()) {
          console.log(`Success message found: ${successText}`);
        }
      }
      
      // Maybe the form needs to be cancelled/closed manually
      const cancelButton = page.locator('button:has-text("Annuler")');
      if (await cancelButton.isVisible()) {
        console.log('Clicking cancel button to close form');
        await cancelButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Should now be showing the entries list, not the form
    await expect(page.locator('input[name="weight"]')).not.toBeVisible();
    
    // Should show the added entry in the list
    await expect(page.locator('text=70 kg')).toBeVisible();
    
    // Should show edit functionality (look for edit button or similar)
    const editButton = page.locator('button[title="Modifier cette entrée"]');
    await expect(editButton.first()).toBeVisible();
    await editButton.first().click();
    
    // Form should be visible again for editing
    await page.waitForSelector('input[name="weight"]', { timeout: 5000 });
    
    // Should pre-fill with existing data
    await expect(page.locator('input[name="weight"]')).toHaveValue('70');
      // Edit the weight (and other fields if needed)
    await page.fill('input[name="weight"]', '71.0');
    // Other fields should retain their values, but let's make sure
    const currentCalories = await page.locator('input[name="caloriesConsumed"]').inputValue();
    const currentSteps = await page.locator('input[name="steps"]').inputValue();
    if (!currentCalories) await page.fill('input[name="caloriesConsumed"]', '2100');
    if (!currentSteps) await page.fill('input[name="steps"]', '8500');
    
    await page.click('button[type="submit"]');
    
    // Wait for form to be submitted and entries list to be displayed again
    await page.waitForTimeout(2000);
    
    // Should show updated weight in the list
    await expect(page.locator('text=71 kg')).toBeVisible();
  });  test('should allow deleting weight entries', async ({ page }) => {
    // Navigate to entry page
    await page.goto('/entry');
    
    // First add an entry - check if form is already visible, if not show it
    const weightInput = page.locator('input[name="weight"]');
    if (!(await weightInput.isVisible())) {
      await page.click('button:has-text("Nouvelle entrée")');
      await page.waitForSelector('input[name="weight"]', { timeout: 5000 });
    }
      // Fill and submit the form - need to fill ALL required fields
    await page.fill('input[name="weight"]', '68.0');
    await page.fill('input[name="caloriesConsumed"]', '1800');
    await page.fill('input[name="steps"]', '7000');
    
    await page.click('button[type="submit"]');
    
    // Wait for form to be submitted and entries list to be displayed
    await page.waitForTimeout(2000);
    
    // Should now be showing the entries list, not the form
    await expect(page.locator('input[name="weight"]')).not.toBeVisible();
    
    // Should show the added entry in the list
    await expect(page.locator('text=68 kg')).toBeVisible();
      // Should show delete functionality
    const deleteButton = page.locator('button[title="Supprimer cette entrée"]');
    await expect(deleteButton.first()).toBeVisible();
    
    // Handle confirmation dialog
    page.on('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });
    
    await deleteButton.first().click();
    
    // Confirm deletion if there's a confirmation dialog
    const confirmButton = page.locator('button:has-text("Confirmer"), button:has-text("Confirm")');
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }
    
    // Wait for deletion to complete
    await page.waitForTimeout(2000);
    
    // Weight should no longer be visible in the list
    await expect(page.locator('text=68 kg')).not.toBeVisible();
  });
});
