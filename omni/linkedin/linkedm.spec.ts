import { expect } from '@playwright/test';
import { test } from './linked-fixtures'
import { SPOOF_FINGERPRINT } from './constants';
import { chromium, BrowserContextOptions } from 'playwright';
import LinkedInGateway from './linked-fixtures';
import { HEADERS, HOME_URL  } from './constants';


test('Linkedin message', async ({ ai }) => {
    const browser = await chromium.launch({
        // headless: true, // Run in headless mode
        args: [
            '--disable-web-security', // Disable web security to bypass CORS issues
            '--disable-features=IsolateOrigins,site-per-process', // Disable site isolation
            '--disable-blink-features=AutomationControlled', // Prevent detection
            '--no-sandbox', // Disable sandbox for performance
            '--disable-setuid-sandbox', // Disable setuid sandbox
            '--disable-dev-shm-usage', // Disable /dev/shm usage for performance
            '--disable-webgl', // Disable WebGL
            '--disable-rtc-smoothness-algorithm', // Disable WebRTC
            '--disable-webrtc-encryption' // Disable WebRTC encryption
        ],
    });
    const contextOptions: BrowserContextOptions = {
        viewport: { width: 1280, height: 720 }, // Set a standard viewport size
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', // Set a common user-agent
        ignoreHTTPSErrors: true, // Ignore HTTPS errors
        geolocation: { latitude: 6.5, longitude: 3.3 }, // Optional: Set a fixed geolocation
        permissions: ['geolocation'], // Grant geolocation permissions
        extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9', // Set language headers
        },
    };
    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();
    const linkedInGateway = new LinkedInGateway(page, '@gmail.com', '');
    await linkedInGateway.login();
    expect(page.url()).toBe(HOME_URL);
    linkedInGateway.keepAlive();

    // Perform data fetching or other actions
    const data = await linkedInGateway.fetchData('https://www.linkedin.com/some-data-url');
    console.log(data);

    await browser.close();


    // const deviceMemory = 8; // Example value: 8GB RAM
    // const hardwareConcurrency = 4; // Example value: 4 logical processors
    // await page.addInitScript(SPOOF_FINGERPRINT(deviceMemory, hardwareConcurrency));
    
    //  // Block images and CSS to speed up scraping
    //  await page.route('**/*', (route) => {
    //     const request = route.request();
    //     if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet') {
    //         route.abort();
    //     } else {
    //         route.continue();
    //     }
    // });

    // await page.goto('https://www.linkedin.com/login');
    // // await ai('enter email "@gmail.com"')
    // // await ai('enter password " "')
    // await page.getByLabel('Email or Phone').fill('@gmail.com')
    // await page.getByLabel('Password').fill('')
    // await page.getByLabel('Sign in', { exact: true }).click()
    // await page.waitForURL('https://www.linkedin.com/feed/')
    // expect(page.url()).toBe('https://www.linkedin.com/feed/')
    // browser.close();
});