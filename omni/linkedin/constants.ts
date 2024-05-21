// constants.ts
import { Page, chromium, BrowserContextOptions } from 'playwright';

export const FIREFOX_SETTINGS: { [key: string]: boolean | number } = {
    "pdfjs.disabled": false,
    "browser.taskbar.lists.enabled": true,
    "browser.taskbar.lists.frequent.enabled": true,
    "browser.taskbar.lists.recent.enabled": true,
    "browser.taskbar.lists.tasks.enabled": true,
    "browser.taskbar.lists.maxListItemCount": 10,
};

export const SPOOF_FINGERPRINT = (deviceMemory: number, hardwareConcurrency: number): string => `
    (() => {
        delete navigator.__proto__.webdriver;
        Object.defineProperty(navigator, 'deviceMemory', {
            value: ${deviceMemory}, configurable: true
        });

        const originalHardwareConcurrency = navigator.hardwareConcurrency;
        const originalPropertyDescriptor = Object.getOwnPropertyDescriptor(
            Navigator.prototype, 'hardwareConcurrency'
        );
        Object.defineProperty(Navigator.prototype, 'hardwareConcurrency', {
            get: function() {
                return ${hardwareConcurrency};
            },
            enumerable: originalPropertyDescriptor?.enumerable,
            configurable: originalPropertyDescriptor?.configurable,
        });

        const originalWorker = window.Worker;
        window.Worker = new Proxy(originalWorker, {
            construct(target, args) {
                const worker = new target(...args);
                const handleMessage = (event: MessageEvent) => {
                    if (event.data === 'spoofHardwareConcurrency') {
                        worker.postMessage(navigator.hardwareConcurrency);
                    }
                };
                worker.addEventListener('message', handleMessage);
                return worker;
            }
        });
    })();
`;

export const HOST: string = "http://127.0.0.1:8000";

export const COUNTRIES: string[] = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Greece",
    "Czechia", "Denmark", "Finland", "France",
    "Germany", "Hungary", "Ireland", "Italy", "Netherlands",
    "Poland", "Portugal", "Romania", "Spain", "Sweden",
    "Canada", "Australia", "New Zealand", "Japan",
    "South Korea", "Singapore", "Turkey"
];

export const POPULAR_DESTINATION: string[] = ["Sweden", "Germany", "Netherlands"];

export const IGNORE_LIST: string[] = [
    "how can i assist you today",
    "thebai"
];

// constants.ts
export const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Accept-Language': 'en-US,en;q=0.9',
};

export const browserArgs: string[] = [
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

export const contextOptions: BrowserContextOptions = {
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
    geolocation: { latitude: 6.5, longitude: 3.3 },
    permissions: ['geolocation'],
    extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
    },
};

export const LOGIN_URL = 'https://www.linkedin.com/login';
export const HOME_URL = 'https://www.linkedin.com/feed/';
export const KEEP_ALIVE_URL = 'https://www.linkedin.com/mynetwork/';
export const PROXY_URL = 'http://proxy-url.example.com'; // Replace with your actual proxy URL if needed

export const EMAIL = process.env.LINKEDIN_EMAIL || 'richardokonicha@gmail.com';
export const PASSWORD = process.env.LINKEDIN_PASSWORD || 'Shoo';
export const authFile = 'playwright/.auth/user.json';


export const PEOPLE_URL  = "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&network=%5B%22F%22%5D&origin=FACETED_SEARCH&sid=_vU"