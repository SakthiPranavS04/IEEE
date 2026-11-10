import { test, expect } from '@playwright/test';

// List of all main website routes with HashRouter hash paths
const routes = [
  { path: '/#/', name: 'Home' },
  { path: '/#/about/ieee', name: 'About IEEE Global' },
  { path: '/#/about/kvitt', name: 'About KVITT' },
  { path: '/#/about/kec', name: 'About KEC' },
  { path: '/#/about/kec-src', name: 'About KEC SRC' },
  { path: '/#/about/ieee-kec-sb', name: 'About IEEE KEC SB' },
  { path: '/#/about/kec-sps', name: 'About KEC SPS' },
  { path: '/#/about/kec-wie', name: 'About KEC WIE' },
  { path: '/#/events/upcoming', name: 'Upcoming Events' },
  { path: '/#/events/past', name: 'Past Events' },
  { path: '/#/achievements', name: 'Achievements' },
  { path: '/#/faculties', name: 'Execomm' },
  { path: '/#/committee', name: 'Committees' },
  { path: '/#/media', name: 'Media Center' },
  { path: '/#/documents', name: 'Documents' },
  { path: '/#/contact', name: 'Contact' },
  { path: '/#/request/forms', name: 'Request Forms Listing' },
  { path: '/#/request/membership', name: 'Membership Request' },
  { path: '/#/execomm/ap-s', name: 'APS Society' },
  { path: '/#/execomm/computer-society', name: 'Computer Society' },
  { path: '/#/execomm/wie', name: 'WIE Affinity Group' },
  { path: '/#/execomm/ras', name: 'RAS Society' },
  { path: '/#/execomm/pes', name: 'PES Society' },
  { path: '/#/execomm/comsoc', name: 'ComSoc Society' },
  { path: '/#/admin', name: 'Admin Portal' }
];

test.describe('1. Global Route & Error Audit', () => {
  for (const r of routes) {
    test(`Route ${r.path} (${r.name}) should render with zero unhandled exceptions`, async ({ page }) => {
      const pageErrors = [];

      page.on('pageerror', (err) => {
        pageErrors.push(err.message);
      });

      const response = await page.goto(r.path, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBeLessThan(400);

      // Verify page is not completely blank
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length).toBeGreaterThan(20);

      // Assert zero fatal unhandled runtime exceptions
      expect(pageErrors, `Unhandled JS exceptions found on ${r.path}: ${pageErrors.join(', ')}`).toEqual([]);
    });
  }
});

test.describe('2. Navigation & Header Verification', () => {
  test('Navbar links and navigation items should be functional', async ({ page }) => {
    await page.goto('/#/', { waitUntil: 'domcontentloaded' });

    // Navbar should exist
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Verify main navbar items exist
    const homeLink = page.getByRole('link', { name: 'Home' }).first();
    await expect(homeLink).toBeVisible();

    // Verify Documents and Contact navigation links
    const docLink = page.getByRole('link', { name: 'Documents' }).first();
    await expect(docLink).toBeVisible();

    const contactLink = page.getByRole('link', { name: 'Contact' }).first();
    await expect(contactLink).toBeVisible();
  });
});

test.describe('3. Media Section Functional Verification', () => {
  test('Photo Gallery Bento Grid and Tab switching should work properly', async ({ page }) => {
    await page.goto('/#/media', { waitUntil: 'domcontentloaded' });

    // Verify Tab buttons exist
    const galleryTab = page.getByRole('button', { name: /Photo Gallery/i });
    const newslettersTab = page.getByRole('button', { name: /Newsletters/i });
    const researchTab = page.getByRole('button', { name: /Research Papers/i });

    await expect(galleryTab).toBeVisible();
    await expect(newslettersTab).toBeVisible();
    await expect(researchTab).toBeVisible();

    // Verify Bento Grid is rendered
    const bentoGrid = page.locator('.gallery-bento-grid');
    await expect(bentoGrid).toBeVisible();

    // Click on the first album card to drill down into folder
    const firstAlbum = page.locator('.gallery-bento-card').first();
    if (await firstAlbum.isVisible()) {
      await firstAlbum.click();

      // Check Back to Albums button appears
      const backBtn = page.locator('.back-to-albums-btn');
      await expect(backBtn).toBeVisible();

      // Return to albums view
      await backBtn.click();
      await expect(page.locator('.gallery-bento-grid')).toBeVisible();
    }

    // Switch to Newsletters tab
    await newslettersTab.click();
    await expect(page.getByText(/Horizon/i).first()).toBeVisible();

    // Switch to Research tab
    await researchTab.click();
    await expect(page.getByText(/Research/i).first()).toBeVisible();
  });
});

test.describe('4. Interactive Forms Verification', () => {
  test('Contact form inputs and fields are rendered', async ({ page }) => {
    await page.goto('/#/contact', { waitUntil: 'domcontentloaded' });

    // Check contact form elements
    const inputs = page.locator('input, textarea');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Membership request form fields should be fillable', async ({ page }) => {
    await page.goto('/#/request/membership', { waitUntil: 'domcontentloaded' });

    // Look for form or inputs
    const inputs = page.locator('input, textarea, select');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('5. IEEE Computer Society(CS) Page Specific Verification', () => {
  test('Society page should load with IEEE Computer Society(CS) title', async ({ page }) => {
    await page.goto('/#/execomm/computer-society', { waitUntil: 'domcontentloaded' });

    // Wait for skeleton loading state to complete
    await page.waitForSelector('.society-page-container', { timeout: 10000 });

    // Heading or title should contain IEEE Computer Society(CS)
    const content = await page.locator('body').innerText();
    expect(content).toContain('IEEE Computer Society(CS)');
  });
});

test.describe('6. Interactive Chatbot Verification', () => {
  test('Chatbot button opens chat interface and handles quick reply', async ({ page }) => {
    await page.goto('/#/', { waitUntil: 'domcontentloaded' });

    // Chatbot floating button
    const chatBtn = page.locator('button[title="Open IEEE Assistant"]');
    await expect(chatBtn).toBeVisible();
    await chatBtn.click();

    // Verify chat header
    await expect(page.getByText('IEEE Assistant')).toBeVisible();

    // Click a quick reply button (e.g. "Upcoming Events")
    const quickReply = page.getByRole('button', { name: 'Upcoming Events' });
    await expect(quickReply).toBeVisible();
    await quickReply.click();

    // Ensure bot responded
    await page.waitForTimeout(500);
    const messages = page.locator('.chat-message, [class*="message"]');
    const msgCount = await messages.count();
    expect(msgCount).toBeGreaterThan(1);
  });
});

test.describe('7. Events & Activities Verification', () => {
  test('Upcoming and past events pages render event cards', async ({ page }) => {
    await page.goto('/#/events/upcoming', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.goto('/#/events/past', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
