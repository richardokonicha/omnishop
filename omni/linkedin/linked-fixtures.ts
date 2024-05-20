import { test as base } from '@playwright/test';
import { aiFixture, type AiFixture }  from '@zerostep/playwright';
import { Page } from 'playwright';
import { LOGIN_URL, HOME_URL, KEEP_ALIVE_URL, HEADERS } from './constants';

export const test = base.extend<AiFixture>({
  ...aiFixture(base)
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
            await this.page.waitForNavigation();

            if (this.page.url() === HOME_URL) {
                this.loggedIn = true;
                console.log('Login successful');
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
                await this.page.goto(KEEP_ALIVE_URL);
                console.log(`GET ${KEEP_ALIVE_URL} - ${this.page.url()}`);
                await this.page.waitForTimeout(Math.floor(Math.random() * 60000) + 60000); // Wait between 1 to 2 minutes
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
