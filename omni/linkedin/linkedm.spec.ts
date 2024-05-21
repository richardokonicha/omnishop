import { expect } from '@playwright/test';
import { test } from './linked-fixtures';
import LinkedInGateway from './linked-fixtures';
import { HOME_URL, PEOPLE_URL } from './constants';

test.describe('LinkedIn tests', () => {
  let linkedInGateway: LinkedInGateway;

  test.beforeAll(async ({ page, email, password }) => {
    if (!email || !password) {
      throw new Error('Email or password not set in environment variables');
    }
    linkedInGateway = new LinkedInGateway(page, email, password);
    await page.goto(HOME_URL);
    if (page.url() !== HOME_URL) {
      await linkedInGateway.login();
    }
    await page.goto(HOME_URL);
    expect(page.url()).toBe(HOME_URL);
  });

  test('Check URL and go to profile', async ({ page }) => {
    await page.goto(HOME_URL);
    expect(page.url()).toBe(HOME_URL);
    await page.goto(PEOPLE_URL);

    await page.waitForSelector('.linked-area', { timeout: 10000 });

    // Get all elements with the class 'linked-area'
    const linkedAreaElements = await page.locator('.linked-area');
    const count = await linkedAreaElements.count();
    expect(count).toBeGreaterThan(0);
    console.log(`Found ${count} linked-area elements`);

    let messageButtons = <any>[];

    for (let i = 0; i < count; i++) {
        const linkedAreaElement = linkedAreaElements.nth(i);
        const messageButton = await linkedAreaElement.locator('button:has-text("Message")').elementHandle();
        if (messageButton) {
            messageButtons.push(messageButton);
        }
    }

    console.log(`Found ${messageButtons.length} message buttons`);

    for (const messageButton of messageButtons) {
        try {
            let close = await page.getByRole('button', { name: 'Close your conversation with' });
            if (close){
                close.click();
            }

            await messageButton.hover();
            await messageButton.click();
            // await page.evaluate((button) => button.click(), messageButton);
            console.log('Message button clicked');

            // Wait for the chat to open and the close button to appear
            await page.waitForSelector('button[aria-label*="Close your conversation with"]', { timeout: 5000 });
            await page.waitForTimeout(5000);

            await page.getByRole('button', { name: 'Close your conversation with' }).click();
            console.log('Chat closed');
        

            // Optional: Add a small delay before the next iteration
            // await page.waitForTimeout(500);
        } catch (error) {
            console.error(`Error interacting with message button: ${error}`);
        }
    }

    await page.waitForTimeout(20000);
  });
});
