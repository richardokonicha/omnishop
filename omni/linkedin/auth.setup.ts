// import { test as setup, expect } from '@playwright/test';
// import { EMAIL, PASSWORD } from './constants';
// const authFile = 'playwright/.auth/user.json';

// setup('authenticate', async ({ page }) => {
//   // Perform authentication steps. Replace these actions with your own.
//   await page.goto('https://linkedin.com/login');
//   await page.getByLabel('Username or email address').fill(EMAIL);
//   await page.getByLabel('Password').fill(PASSWORD);
//   await page.getByRole('button', { name: 'Sign in' }).click();
//   // Wait until the page receives the cookies.
//   //
//   // Sometimes login flow sets cookies in the process of several redirects.
//   // Wait for the final URL to ensure that the cookies are actually set.
//   await page.waitForURL('https://linkedin.com/feed');
//   // Alternatively, you can wait until the page reaches a state where all cookies are set.
//   await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

//   // End of authentication steps.

//   await page.context().storageState({ path: authFile });
// });


// await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/');
// await page.getByLabel('Send a message to Vignesh').click();
// await page.getByRole('button', { name: 'Send', exact: true }).click();
// await page.getByRole('button', { name: 'Close your conversation with' }).click();
// await page.getByLabel('Send a message to Romain').click();
// await page.getByRole('button', { name: 'Send', exact: true }).click();
// await page.getByRole('button', { name: 'Close your conversation with' }).click();
// await page.getByLabel('Send a message to Damir').click();
// await page.getByRole('button', { name: 'Send', exact: true }).click();
// await page.getByRole('button', { name: 'Close your conversation with' }).click();
// await page.getByLabel('Locations filter. Clicking').click();
// await page.locator('label').filter({ hasText: 'United States Filter by United States' }).click();
// await page.getByRole('button', { name: 'Apply current filter to show' }).click();
// await page.getByLabel('Message Martin Tasevski').click();
// await page.getByRole('button', { name: 'Send', exact: true }).click();
// await page.getByRole('button', { name: 'Close your conversation with' }).click();
// await page.close();

// // -------------