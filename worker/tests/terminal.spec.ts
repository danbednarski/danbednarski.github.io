import { test, expect } from '@playwright/test';

test.describe('Terminal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders homepage with sigil, quote, and prompt', async ({ page }) => {
    // Sigil video is present
    const video = page.locator('#sigil-container video');
    await expect(video).toBeVisible();

    // Quote is present
    await expect(page.locator('#quote')).toContainText('C.S. Lewis');

    // Prompt is visible
    await expect(page.locator('form label')).toContainText('guest@darigo.su:~ $');

    // Input exists
    const input = page.locator('form input[name="cmd"]');
    await expect(input).toBeVisible();
  });

  test('input is autofocused on initial load', async ({ page }) => {
    const input = page.locator('form input[name="cmd"]');
    await expect(input).toBeFocused();
  });

  test('welcome message shows available commands', async ({ page }) => {
    const welcome = page.locator('.welcome');
    await expect(welcome).toContainText('D-WOS');
    await expect(welcome).toContainText('Commands:');
    await expect(welcome).toContainText('ls');
    await expect(welcome).toContainText('cat');
    await expect(welcome).toContainText('who');
    await expect(welcome).toContainText('ps');
  });

  test('ls command lists files', async ({ page }) => {
    await page.goto('/?cmd=ls');
    const output = page.locator('.cmd-output');
    await expect(output).toContainText('README.md');
    await expect(output).toContainText('HACKME');
    await expect(output).toContainText('scry.txt');
    // Hidden file should NOT appear
    await expect(output).not.toContainText('.somefile.txt');
  });

  test('ls command shows permissions', async ({ page }) => {
    await page.goto('/?cmd=ls');
    const output = page.locator('.cmd-output');
    await expect(output).toContainText('-rw-rw-r--');
    await expect(output).toContainText('-r--r-----');
  });

  test('who command shows bio', async ({ page }) => {
    await page.goto('/?cmd=who');
    const output = page.locator('.cmd-output');
    await expect(output).toContainText('Darigo');
    await expect(output).toContainText('rogue dev');
  });

  test('ps command shows processes', async ({ page }) => {
    await page.goto('/?cmd=ps');
    const output = page.locator('.cmd-output');
    await expect(output).toContainText('PID TTY');
    await expect(output).toContainText('darigo.su');
    await expect(output).toContainText('github');
  });

  test('cat README.md shows content', async ({ page }) => {
    await page.goto('/?cmd=cat+README.md');
    const output = page.locator('.cmd-output');
    await expect(output).toContainText('Heyyyy');
    await expect(output).toContainText('home on the web');
  });

  test('cat HACKME shows content', async ({ page }) => {
    await page.goto('/?cmd=cat+HACKME');
    const output = page.locator('.cmd-output');
    await expect(output).toContainText('TODO: implement CTF');
  });

  test('cat without argument shows usage', async ({ page }) => {
    await page.goto('/?cmd=cat');
    const output = page.locator('.cmd-output');
    await expect(output).toContainText('Usage: cat');
  });

  test('cat nonexistent file shows error', async ({ page }) => {
    await page.goto('/?cmd=cat+nope.txt');
    const output = page.locator('.cmd-output');
    await expect(output).toContainText('does not exist');
  });

  test('unknown command shows error', async ({ page }) => {
    await page.goto('/?cmd=whoami');
    const output = page.locator('.cmd-output');
    await expect(output).toContainText('Unknown command');
  });

  test('empty command shows no output', async ({ page }) => {
    await page.goto('/?cmd=');
    const output = page.locator('.cmd-output');
    await expect(output).toHaveCount(0);
  });

  test('form submission navigates with cmd param', async ({ page }) => {
    const input = page.locator('form input[name="cmd"]');
    await input.fill('ls');
    await input.press('Enter');
    await expect(page).toHaveURL(/[?&]cmd=ls/);
    await expect(page.locator('.cmd-output')).toContainText('README.md');
  });

  test('input is autofocused after command submission', async ({ page }) => {
    await page.goto('/?cmd=ls');
    const input = page.locator('form input[name="cmd"]');
    await expect(input).toBeFocused();
  });
});
