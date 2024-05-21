import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.locator('body').click();
});

import { chromium } from 'playwright';

async function main() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/');

    // Wait for the page to load and ensure the message buttons are available
    await page.waitForSelector('button[aria-label^="Send a message to"]');

    // Get all message buttons
    const messageButtons = await page.$$('button[aria-label^="Send a message to"]');

    for (const button of messageButtons) {
        await button.click();
        
        // Wait for the send button to appear and click it
        await page.waitForSelector('button[role="button"][name="Send"]', { timeout: 5000 });
        const sendButton = await page.$('button[role="button"][name="Send"]');
        if (sendButton) {
            await sendButton.click();
        }

        // Close the conversation
        await page.waitForSelector('button[role="button"][name^="Close your conversation with"]', { timeout: 5000 });
        const closeButton = await page.$('button[role="button"][name^="Close your conversation with"]');
        if (closeButton) {
            await closeButton.click();
        }
    }

    await browser.close();
}

main().catch(console.error);
