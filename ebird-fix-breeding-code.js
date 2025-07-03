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
  let links = await page.$$eval('a', as =>
    as.map(a => a.getAttribute('href')).filter(href => !!href && /^\/atlastw\/checklist\//.test(href))
  );
  links = links.sort((a, b) => {
    const getNum = href => {
      const match = href.match(/\/atlastw\/checklist\/S(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };
    return getNum(b) - getNum(a);
  });
  console.log(`找到 ${links.length} 個符合條件的連結（已反序排序）。`);
  const startIndex = 92; // 修改這裡可指定從第幾個連結開始
  for (let i = startIndex; i < links.length; i++) {
    console.log(`目前點擊第 ${i + 1} 個連結，總共 ${links.length} 個: ${links[i]}`);
    await page.goto('https://ebird.org' + links[i]);
    // await page.goto('https://ebird.org/atlastw/checklist/S254263743');
    // await page.goto('https://ebird.org/atlastw/checklist/S200570322');
    const nodes = await page.$$eval('*', nodes => nodes.map(n => n.textContent || ''));
    let foundTarget = false;
    let foundConfirmed = false;
    for (let j = nodes.length - 1; j >= 2; j--) {
      const text = nodes[j];
      if (text.startsWith('東方黃鶺鴒')) {
        foundTarget = true;
        break;
      }
      if (text.startsWith('\nFL Recently Fledged Young')) {
        foundConfirmed = true;
      }
    }
    if (!foundTarget) {
      console.error('沒有找到目標物種「東方黃鶺鴒」，跳過此連結。');
      continue;
    }
    if (!foundConfirmed) {
      continue;
    }

    console.log(`找到符合條件的連結: ${links[i]}`);

    await page.getByLabel('Totals').getByRole('link', { name: 'Edit Species' }).click();
    await page.waitForLoadState('networkidle');

    // 檢查 <select id="selectedId"> 並修改選取值
    let selectedId = 'p-weywag8_bcode';
    let selectHandle = await page.$(`#${selectedId}`);
    if (!selectHandle) {
      console.log(`找不到 <select id="${selectedId}"> 元素。`);
      selectedId = 'p-eaywag_bcode';
      selectHandle = await page.$(`#${selectedId}`);
      if (!selectHandle) {
        console.error(`找不到 <select id="${selectedId}"> 元素，無法繼續。`);
        continue;
        // process.exit(1);
      }
      console.log(`已找到 <select id="${selectedId}"> 元素，繼續處理。`);
    }
    const selectedValue = await page.$eval(`#${selectedId}`, sel => sel.value);
    if (selectedValue !== 'FL') {
      console.log('目前選取的繁殖代碼不是 FL Recently Fledged Young。');
      if (selectedValue !== 'NC') {
        console.error('目前選取的繁殖代碼不是 NC No code，無法繼續。');
        continue;
        // process.exit(1);
      }
      console.log('目前選取的繁殖代碼是 NC No code，可以繼續。');
    }
    await page.selectOption(`#${selectedId}`, '');
    // console.log('已將繁殖代碼選取項目改為空值。');

    // console.log('儲存...');
    await page.getByRole('button', { name: 'Save' }).click();
    // console.log('等待儲存完成...');
    await page.waitForLoadState('networkidle');
    // console.log(`第 ${i + 1} 個連結處理完成。`);
  }
  console.log('所有連結處理完成。');
  //await browser.close();
  //console.log('瀏覽器已關閉。');
}

main().catch(e => {
  console.error('執行發生錯誤:', e);
  process.exit(1);
});
