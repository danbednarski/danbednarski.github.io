import { test, expect } from '@playwright/test';

test.describe('Win95 Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('desktop is hidden by default', async ({ page }) => {
    const modal = page.locator('#desktop-modal');
    await expect(modal).toHaveCSS('display', 'none');
    const toggle = page.locator('#desktop-toggle');
    await expect(toggle).not.toBeChecked();
  });

  test('clicking sigil opens desktop', async ({ page }) => {
    await page.locator('#sigil-container').click();
    const modal = page.locator('#desktop-modal');
    await expect(modal).toHaveCSS('display', 'block');
    const toggle = page.locator('#desktop-toggle');
    await expect(toggle).toBeChecked();
  });

  test('desktop has teal background', async ({ page }) => {
    await page.locator('#sigil-container').click();
    const modal = page.locator('#desktop-modal');
    await expect(modal).toHaveCSS('background-color', 'rgb(0, 128, 128)');
  });

  test('desktop icons are visible', async ({ page }) => {
    await page.locator('#sigil-container').click();
    const icons = page.locator('.desktop-icon');
    await expect(icons).toHaveCount(3);
    await expect(icons.nth(0)).toContainText('Recycling Bin');
    await expect(icons.nth(1)).toContainText('Napster');
    await expect(icons.nth(2)).toContainText('Pokeroom');
  });

  test('start menu toggles', async ({ page }) => {
    await page.locator('#sigil-container').click();
    const menu = page.locator('.start-menu');
    await expect(menu).toHaveCSS('display', 'none');

    await page.locator('.start-btn').click();
    await expect(menu).toHaveCSS('display', 'block');

    await page.locator('.start-btn').click();
    await expect(menu).toHaveCSS('display', 'none');
  });

  test('taskbar is visible with clock', async ({ page }) => {
    await page.locator('#sigil-container').click();
    const taskbar = page.locator('.taskbar');
    await expect(taskbar).toBeVisible();
    await expect(page.locator('.taskbar-clock')).toContainText('4:20 PM');
  });

  test('shut down refreshes page', async ({ page }) => {
    await page.locator('#sigil-container').click();
    await expect(page.locator('#desktop-modal')).toHaveCSS('display', 'block');

    // Open start menu then click Shut Down
    await page.locator('.start-btn').click();
    await page.locator('.start-menu-item:has-text("Shut Down")').click();
    await page.waitForURL('/');
    await expect(page.locator('#desktop-modal')).toHaveCSS('display', 'none');
    // Input should be autofocused after refresh
    const input = page.locator('input[name="cmd"]');
    await expect(input).toBeFocused();
  });
});

test.describe('Pokeroom Modal (via Desktop)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Open desktop first
    await page.locator('#sigil-container').click();
    await expect(page.locator('#desktop-modal')).toHaveCSS('display', 'block');
  });

  test('modal is hidden by default on desktop', async ({ page }) => {
    const modal = page.locator('#pokeroom-modal');
    await expect(modal).toHaveCSS('display', 'none');
  });

  test('clicking Pokeroom icon opens modal', async ({ page }) => {
    await page.locator('.desktop-icon:has-text("Pokeroom")').click();
    const modal = page.locator('#pokeroom-modal');
    await expect(modal).toHaveCSS('display', 'flex');
    const toggle = page.locator('#pokeroom-toggle');
    await expect(toggle).toBeChecked();
  });

  test('close button dismisses modal back to desktop', async ({ page }) => {
    await page.locator('.desktop-icon:has-text("Pokeroom")').click();
    const modal = page.locator('#pokeroom-modal');
    await expect(modal).toHaveCSS('display', 'flex');

    await page.locator('#pokeroom-close').click();
    await expect(modal).toHaveCSS('display', 'none');
    // Desktop should still be visible
    await expect(page.locator('#desktop-modal')).toHaveCSS('display', 'block');
  });

  test('clicking overlay dismisses modal', async ({ page }) => {
    await page.locator('.desktop-icon:has-text("Pokeroom")').click();
    const modal = page.locator('#pokeroom-modal');
    await expect(modal).toHaveCSS('display', 'flex');

    await page.locator('.pr-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modal).toHaveCSS('display', 'none');
  });

  test('modal contains the game room', async ({ page }) => {
    await page.locator('.desktop-icon:has-text("Pokeroom")').click();

    const room = page.locator('.pr-room');
    await expect(room).toBeVisible();
    await expect(room).toHaveCSS('background-color', 'rgb(245, 245, 220)'); // beige
  });

  test('player sprite is visible in modal', async ({ page }) => {
    await page.locator('.desktop-icon:has-text("Pokeroom")').click();

    const player = page.locator('.pr-player');
    await expect(player).toBeVisible();
  });

  test('companion sprite is visible in modal', async ({ page }) => {
    await page.locator('.desktop-icon:has-text("Pokeroom")').click();

    const companion = page.locator('.pr-companion');
    await expect(companion).toBeVisible();
  });

  test('desk image loads', async ({ page }) => {
    await page.locator('.desktop-icon:has-text("Pokeroom")').click();

    const desk = page.locator('.pr-desk');
    await expect(desk).toBeVisible();
    const loaded = await desk.evaluate(
      (img: HTMLImageElement) => img.naturalWidth > 0
    );
    expect(loaded).toBe(true);
  });

  test('computer link is present', async ({ page }) => {
    await page.locator('.desktop-icon:has-text("Pokeroom")').click();

    const link = page.locator('.pr-desk-link');
    await expect(link).toBeVisible();
    await expect(link).toContainText('Computer');
  });

  test('speech bubbles exist', async ({ page }) => {
    await page.locator('.desktop-icon:has-text("Pokeroom")').click();

    const bubbles = page.locator('.pr-speech');
    await expect(bubbles).toHaveCount(4);
    await expect(bubbles.nth(0)).toContainText("I'm Mimikyu");
    await expect(bubbles.nth(1)).toContainText('arrow keys');
    await expect(bubbles.nth(2)).toContainText('desk');
    await expect(bubbles.nth(3)).toContainText('Have fun');
  });
});
