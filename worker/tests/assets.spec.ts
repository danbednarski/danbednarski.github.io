import { test, expect } from '@playwright/test';

test.describe('Static Assets', () => {
  const assets = [
    '/sigil.webm',
    '/favicon.ico',
    '/desk.png',
    '/down_still.png',
    '/down_step.png',
    '/companion_down.png',
    '/up_still.png',
    '/up_step.png',
    '/left_still.png',
    '/left_step.png',
    '/right_still.png',
    '/right_step.png',
    '/companion_up.png',
    '/companion_left.png',
    '/companion_right.png',
  ];

  for (const asset of assets) {
    test(`serves ${asset} with 200`, async ({ request }) => {
      const res = await request.get(asset);
      expect(res.status()).toBe(200);
    });
  }

  test('returns proper content-type for HTML', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['content-type']).toContain('text/html');
  });
});
