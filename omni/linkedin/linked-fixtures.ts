import { test as base } from '@playwright/test';
import { aiFixture, type AiFixture } from '@zerostep/playwright';
import { Page, BrowserContext, chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { LOGIN_URL, HOME_URL, EMAIL, PASSWORD, contextOptions, browserArgs, authFile } from './constants';

const userDataDir = path.resolve(__dirname, 'user_data');

let context: BrowserContext;

export const test = base.extend<AiFixture & { email: string; password: string; page: Page }>({
  ...aiFixture(base),
  email: EMAIL,
  password: PASSWORD,
  context: async ({}, use) => {
    if (!context) {
      if (fs.existsSync(userDataDir)) {
        context = await chromium.launchPersistentContext(userDataDir, {
          headless: false,
          args: browserArgs,
          ...contextOptions,
        });
      } else {
        
        context = await chromium.launchPersistentContext(userDataDir, {
          headless: false,
          
          args: browserArgs,
          ...contextOptions,
        });
      }
    }
    await use(context);
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

// Ensure the browser context is closed properly
base.afterAll(async () => {
  if (context) {
    await context.close();
  }
});

class LinkedInGateway {
  private page: Page;
  private email: string;
  private password: string;
  private loggedIn: boolean = false;

  constructor(page: Page, email: string, password: string) {
    this.page = page;
    this.email = email;
    this.password = password;
  }

  async login() {
    try {
      await this.page.goto(LOGIN_URL);
      await this.page.fill('input[name="session_key"]', this.email);
      await this.page.fill('input[name="session_password"]', this.password);
      await this.page.click('button[type="submit"]');
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForURL(HOME_URL);

      if (this.page.url() === HOME_URL) {
        this.loggedIn = true;
        console.log('Login successful');
        await this.page.context().storageState({ path: authFile });
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error(`Login error: ${error}`);
    }
  }

  async keepAlive() {
    try {
      while (this.loggedIn) {
        await this.page.goto(HOME_URL);
        console.log(`GET ${HOME_URL} - ${this.page.url()}`);
        await this.page.waitForTimeout(Math.floor(Math.random() * 60000) + 60000);
      }
    } catch (error) {
      console.error(`Keep-alive error: ${error}`);
    }
  }

  async fetchData(url: string) {
    try {
      await this.page.goto(url);
      console.log(`GET ${url} - ${this.page.url()}`);
      const data = await this.page.evaluate(() => document.body.innerText);
      return JSON.parse(data);
    } catch (error) {
      console.error(`Fetch data error: ${error}`);
      return null;
    }
  }
}

export default LinkedInGateway;
