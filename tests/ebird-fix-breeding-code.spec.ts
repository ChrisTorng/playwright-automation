import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

test('test', async ({ page }) => {
  await page.goto('https://ebird.org/atlastw/lifelist?r=TW&time=life&spp=eaywag');
  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.EBIRD_USERNAME || '');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.EBIRD_PASSWORD || '');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: '27 Jun 2025' }).click();
  await page.getByRole('link', { name: '東方黃鶺鴒(黃眉)' }).click({
    button: 'right'
  });
  await expect(page.getByText('FL Recently Fledged Young (')).toBeVisible();
  await page.getByLabel('Totals').getByRole('link', { name: 'Edit Species' }).click();
  await page.locator('#weywag8_breedingCode').getByRole('link', { name: 'Breeding Code' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
});