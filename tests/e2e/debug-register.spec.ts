import { test } from '@playwright/test';

test('debug register form', async ({ page }) => {
  // Navigate to register page
  await page.goto('http://localhost:3000/register');
  
  // Take a screenshot before clicking
  await page.screenshot({ path: 'before-submit.png' });
  
  // Click submit without filling anything  
  await page.click('button[type="submit"]');
  
  // Wait a bit
  await page.waitForTimeout(2000);
  
  // Take a screenshot after clicking
  await page.screenshot({ path: 'after-submit.png' });
  
  // Print page content
  const content = await page.content();
  console.log('Page content:', content);
  
  // Try to find error messages using different selectors
  const nameErrors = await page.locator('text=Le nom est requis').all();
  console.log('Name error elements found:', nameErrors.length);
  
  const emailErrors = await page.locator('text=L\'email est requis').all();
  console.log('Email error elements found:', emailErrors.length);
  
  const passwordErrors = await page.locator('text=Le mot de passe est requis').all();  
  console.log('Password error elements found:', passwordErrors.length);
  
  // Try different selectors
  const allErrors = await page.locator('div[class*="text-red"]').all();
  console.log('All red text elements:', allErrors.length);
  
  const allTexts = await page.locator('text=/requis/').all();
  console.log('All elements containing "requis":', allTexts.length);
});
