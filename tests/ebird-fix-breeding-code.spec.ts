import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

test('test', async ({ page }) => {
  await page.goto('https://ebird.org/atlastw/lifelist?r=TW&time=life&spp=eaywag');
  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.EBIRD_USERNAME || '');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.EBIRD_PASSWORD || '');
  await page.getByRole('button', { name: 'Sign in' }).click();
  // 等待登入後頁面載入（可根據登入後會出現的元素調整）
  await page.waitForLoadState('networkidle');
  // 或者等待特定元素出現，例如主頁的某個明顯元素
  // await page.waitForSelector('a[href^="/atlastw/checklist/"]');

  console.log('登入成功，開始處理連結...');
  // 取得所有 <a> 並篩選 href
  const links = await page.$$eval('a', (as) =>
    as.map(a => a.getAttribute('href')).filter(href => href && /^\/atlastw\/checklist\//.test(href))
  );
  console.log(`找到 ${links.length} 個符合條件的連結。`);

  // 可調整起始索引，預設 0
  const startIndex = 0; // 修改這裡可指定從第幾個連結開始

  for (let i = startIndex; i < links.length; i++) {
    console.log(`目前點擊第 ${i + 1} 個連結，總共 ${links.length} 個`);
    await page.goto('https://ebird.org' + links[i]);

    // 檢查是否有 'FL Recently Fledged Young (Confirmed)' 字串
    const found = await page.locator('text=FL Recently Fledged Young (Confirmed)').count();
    if (found > 0) {
      await page.getByLabel('Totals').getByRole('link', { name: 'Edit Species' }).click();
      await page.locator('#weywag8_breedingCode').getByRole('link', { name: 'Breeding Code' }).click();
      await page.getByRole('button', { name: 'Save' }).click();
    } else {
      console.log('未找到 FL Recently Fledged Young (Confirmed)，跳過此連結');
    }
    // await page.goto('https://ebird.org/atlastw/lifelist?r=TW&time=life&spp=eaywag');
  }
});