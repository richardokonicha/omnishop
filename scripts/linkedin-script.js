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

    async function handleClose(page) {
        if (await page.getByRole('button', { name: 'Close your conversation with' }).isVisible()) {
            await page.getByRole('button', { name: 'Close your conversation with' }).click();
            await page.waitForTimeout(500);
        }
        if (await page.getByRole('button', { name: 'Close your draft conversation' }).isVisible()) {
            await page.getByRole('button', { name: 'Close your draft conversation' }).click();
            await page.waitForTimeout(500);
        }
        if (!await page.getByRole('button', { name: 'Close your draft conversation' }).isVisible() && !await page.getByRole('button', { name: 'Close your conversation with' }).isVisible()){
            console.log("no close found")
        }
    }


    async function handleMButton(btn) {
        await btn.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await btn.hover();
        await btn.click({ force: true });
        console.log('Message button clicked');
        await page.waitForTimeout(1000);
    }

    async function handleMessage(page) {
        let message = 'Hello, I am a recruiter at Omni. I would like to talk to you about a job opportunity. Please let me know if you are interested.';
        await page.waitForTimeout(500);
        let msgFrame = await page.getByLabel('Messaging')
        if (!await msgFrame.isVisible()){
            console.log('msgFrame is not visible')
            return
        }

        await page.waitForTimeout(100);
        await msgFrame.scrollIntoViewIfNeeded();
        await msgFrame.hover();
        await msgFrame.click();

        const conversationText = await msgFrame.locator("//p").allTextContents();
        const headerText = await msgFrame.locator("//header//a").innerText();

        await page.waitForTimeout(100);

        console.log('headerText:', headerText);

        if (await page.getByRole('button', { name: 'Send' }).isVisible()) {
            await page.fill('textarea', message);
            // await page.getByRole('button', { name: 'Send' }).click();
            console.log('Message sent');
            await page.waitForTimeout(500);
        } else {
            console.log('Send button is not visible');
            handleClose(page)
        }

    }

    async function processMessageButtons(page) {
        await page.waitForSelector('.linked-area', { timeout: 10000 });
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
                    await handleClose(page)
                    await handleMButton(messageButton)
                    await handleMessage(page)
                    await handleClose(page)
                } else {
                    console.log('Message button is not an element');
                }
            } catch (error) {
                console.error(`Error interacting with message button: ${error}`);
            }
        }

        await page.waitForTimeout(2000);

        if (await page.getByLabel('Next').isVisible()) {
            await page.getByLabel('Next').click();
            await page.waitForTimeout(1000);
            await processMessageButtons(page);
        } else {
            console.log('No more next button found');
        }
    }
    await processMessageButtons(page);
    await context.close();
})();
