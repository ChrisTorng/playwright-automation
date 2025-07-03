VSCode Insiders/GitHub Copilot/GPT-4.1/Agent:

[1.md](1.md)
1. 這裡網頁內輸入帳密的地方，應如何安全保護帳密，不用簽入 git?

[2.md](2.md)
1. 我要列舉目前網頁中所有 <a> 標籤的 href 屬性，若符合格式 `/atlastw/checklist/*`，則一一點擊該連結。因此整個要有一個 loop 把所有符合格式連結都依序點擊過。並且我要能顯示目前點擊到第幾個連結，而且我要支援能修改寫死參數，要從第幾個連結開始點起，預設是由第一個開始。
2. 點了 Sign in 之後，需要等網頁載入完畢，再進行下一步。
3. 這裡的條件要改為: 若有找到 'FL Recently Fledged Young (Confirmed)' 字串則進行下一步，若沒有則跳過，再開啟迴圈中下一個網頁。
4. 條件要再增加: 若有找到 'FL Recently Fledged Young (Confirmed)' 字串，且該字串的前面有找到 '東方黃鶺鴒'，則進行下一步，若沒有則跳過，再開啟迴圈中下一個網頁。

[3.md](3.md)
1. 使用執行測試的方式有限時 30 秒，但我想要做的是網頁自動化，執行時間會超過，我想要改為像一般的程式執行，只是單純使用 Playwright 的 API 來操作網頁。
2. 請設定讓我可以用 VSCode 偵錯 node 程式，我現在要執行的是 `node ebird-fix-breeding-code.ts`。
3. C:\Program Files\nodejs\node.exe -r ts-node/register .\ebird-fix-breeding-code.ts
D:\Projects\GitHub\ChrisTorng\playwright-automation\node_modules\ts-node\src\index.ts:859
    return new TSError(diagnosticText, diagnosticCodes, diagnostics);
           ^
source-map-support.js:722
TSError: ⨯ Unable to compile TypeScript:
4. 奇怪，錯誤還是一樣，但我也確定檔案裡沒有寫 export:
5. 我放棄使用 TS，改用 JavaScript 來寫，請幫我把這個檔案轉成 JavaScript。
6. 修正 launch.json。

[4.md](4.md)
1. 請將所有取得網址反序排序，再開始依序前往網址。
2. 排序請以字串內容反序排序，也就是從 Z 到 A 的順序。
3. 我要再修改排序方法。目前網址格式是 `/atlastw/checklist/S98170824`，就是在 `/atlastw/checklist/S` 之後有數字。請截取數字部分，並以數字大小由大到小的反序排序。

[5.md](5.md)
1. 我要在游標這個位置，增加在網頁內找到這個元素: `<select id="p-weywag8_bcode">`，確定其值選擇的是 `<option value="FL" selected="selected">FL Recently Fledged Young</option>`，並將選取項目改為 `<option value="">Choose the highest possible code...</option>`。若沒有找到該元素，或選取項目不是 `FL Recently Fledged Young`，則輸出 console 錯誤並中斷執行。
2. 我要在 nodes 字串陣列中，先排除 元素 0 與 1。剩下的項目中，由末端往前尋找到 `東方黃鶺鴒` 的部份符合項目即停止搜尋，並在尋找過程中記錄是否有遇到 `\nFL Recently Fledged Young (Confirmed)` 的完全符合項目。若在停止搜尋前有遇到 `\nFL Recently Fledged Young (Confirmed)`，則視為符合條件，繼續往後執行。若沒有找到  `東方黃鶺鴒` 或停止搜尋前沒有找到  `\nFL Recently Fledged Young (Confirmed)`，則視為不符合條件，跳過該網頁，繼續迴圈，進入下一個網址項目。