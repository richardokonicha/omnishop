// constants.ts

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

export const LOGIN_URL = 'https://www.linkedin.com/login';
export const HOME_URL = 'https://www.linkedin.com/feed/';
export const KEEP_ALIVE_URL = 'https://www.linkedin.com/mynetwork/';
export const PROXY_URL = 'http://proxy-url.example.com'; // Replace with your actual proxy URL if needed
