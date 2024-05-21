// const { chromium } = require('playwright');
// const fs = require('fs');
// // const { LOGIN_URL, HOME_URL, EMAIL, PASSWORD, authFile } = require('../omni/linkedin/c');

// const LOGIN_URL = 'https://www.linkedin.com/login';
// const HOME_URL = 'https://www.linkedin.com/feed/';
// const KEEP_ALIVE_URL = 'https://www.linkedin.com/mynetwork/';
// const PROXY_URL = 'http://proxy-url.example.com'; // Replace with your actual proxy URL if needed

// const EMAIL = process.env.LINKEDIN_EMAIL || 'richardokonicha@gmail.com';
// const PASSWORD = process.env.LINKEDIN_PASSWORD || 'Shoo';
// const authFile = 'playwright/.auth/user.json';


// (async () => {
//     const browser = await chromium.launch();
//     const context = await browser.newContext();
//     const page = await context.newPage();

//     await page.goto(LOGIN_URL);
//     await page.fill('input[name="session_key"]', EMAIL);
//     await page.fill('input[name="session_password"]', PASSWORD);
//     await page.click('button[type="submit"]');
//     await page.waitForURL(HOME_URL);

//     // Ensure login was successful
//     if (page.url() === HOME_URL) {
//         const storageState = await context.storageState();
//         fs.writeFileSync(authFile, JSON.stringify(storageState));
//         console.log('State saved successfully');
//     } else {
//         console.error('Login failed');
//     }

//     await browser.close();
// })();
