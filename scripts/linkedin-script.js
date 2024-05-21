const { chromium } = require('playwright');
const fs = require('fs');

const PEOPLE_URL = "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&network=%5B%22F%22%5D&origin=FACETED_SEARCH&sid=_vU";
const LOGIN_URL = 'https://www.linkedin.com/login';
const HOME_URL = 'https://www.linkedin.com/feed/';
const EMAIL = process.env.LINKEDIN_EMAIL || 'richardokonicha@gmail.com';
const PASSWORD = process.env.LINKEDIN_PASSWORD || 'Shoo';
const authFile = 'playwright/.auth/user.json';
const userDataDir = 'omni/linkedin/user_data'; // Define your userDataDir path here
const browserArgs = [
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-blink-features=AutomationControlled',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-webgl',
    '--disable-rtc-smoothness-algorithm',
    '--disable-webrtc-encryption',
];
const contextOptions = {
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
    geolocation: { latitude: 6.5, longitude: 3.3 },
    permissions: ['geolocation'],
    extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
    },
};

(async () => {
    let context;

    if (fs.existsSync(userDataDir)) {
        context = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            args: browserArgs,
            ...contextOptions,
        });
    } else {
        const browser = await chromium.launch();
        context = await browser.newContext();
    }
    const page = await context.newPage();
    await page.goto(PEOPLE_URL);

    // from this line should be a standalone function that can be called from recursively after a next button click
    await page.waitForSelector('.linked-area', { timeout: 10000 });

    // Get all elements with the class 'linked-area'
    const linkedAreaElements = await page.locator('.linked-area');
    const count = await linkedAreaElements.count();
    console.log(`Found ${count} linked-area elements`);

    let messageButtons = [];

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
            if (messageButton) {

                if (await page.getByRole('button', { name: 'Close your conversation with' }).isVisible()) {
                    await page.getByRole('button', { name: 'Close your conversation with' }).click();
                    await page.waitForTimeout(500);
                } else if (await page.getByRole('button', { name: 'Close your draft conversation' }).isVisible()) {
                    await page.getByRole('button', { name: 'Close your draft conversation' }).click();
                    await page.waitForTimeout(500);
                }

                // Scroll to the message button before attempting to hover and click
                await messageButton.scrollIntoViewIfNeeded();
                await page.waitForTimeout(500); // Wait for the scroll action to complete
                await messageButton.hover();
                await messageButton.click({ force: true });
                console.log('Message button clicked');

                await page.waitForTimeout(1000)

                // Check for the close buttons again after opening the chat
                if (await page.getByRole('button', { name: 'Close your conversation with' }).isVisible()) {
                    await page.getByRole('button', { name: 'Close your conversation with' }).click();
                    console.log('Chat closed');
                } else if (await page.getByRole('button', { name: 'Close your draft conversation' }).isVisible()) {
                    await page.getByRole('button', { name: 'Close your draft conversation' }).click();
                    console.log('Chat closed');
                } else {
                    console.log('Close button not found');
                }
            } else {
                console.log('Message button is not an element');
            }
        } catch (error) {
            console.error(`Error interacting with message button: ${error}`);
        }
    }
    await page.waitForTimeout(1000); // Wait for the scroll action to complete
    await page.getByLabel('Next').click();
    await page.waitForTimeout(1000); // Wait for the scroll action to complete

    await context.close();
})();
