const { chromium } = require('playwright');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://ebird.org/atlastw/lifelist?r=TW&time=life&spp=eaywag');
  await page.getByRole('textbox', { name: 'Username' }).fill(process.env.EBIRD_USERNAME || '');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.EBIRD_PASSWORD || '');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForLoadState('networkidle');
  console.log('登入成功，開始處理連結...');
  const links = await page.$$eval('a', as =>
    as.map(a => a.getAttribute('href')).filter(href => !!href && /^\/atlastw\/checklist\//.test(href))
  );
  console.log(`找到 ${links.length} 個符合條件的連結。`);
  const startIndex = 0; // 修改這裡可指定從第幾個連結開始
  for (let i = startIndex; i < links.length; i++) {
    console.log(`目前點擊第 ${i + 1} 個連結，總共 ${links.length} 個: ${links[i]}`);
    // await page.goto('https://ebird.org' + links[i]);
    await page.goto('https://ebird.org/atlastw/checklist/S254263743');
    const nodes = await page.$$eval('*', nodes => nodes.map(n => n.textContent || ''));
    let confirmedIndex = nodes[0].indexOf('FL Recently Fledged Young');
    if (confirmedIndex === -1) {
        continue;
    }
    let targetIndex = nodes[0].indexOf('東方黃鶺鴒');
    if (targetIndex === -1 || targetIndex > confirmedIndex) {
        continue;
    }

    await page.getByLabel('Totals').getByRole('link', { name: 'Edit Species' }).click();
    await page.locator('#weywag8_breedingCode').getByRole('link', { name: 'Breeding Code' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
  }
  await browser.close();
}

main().catch(e => {
  console.error('執行發生錯誤:', e);
  process.exit(1);
});
