import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fsearch%2Fresults%2Fpeople%2F%3FgeoUrn%3D%255B%2522103644278%2522%255D%26keywords%3Dhiring%2520cloud%26network%3D%255B%2522S%2522%255D%26origin%3DFACETED_SEARCH%26searchId%3Dbabf985c-48f5-4255-a1e9-ea4d31e84461%26sid%3Dt%21J');
});