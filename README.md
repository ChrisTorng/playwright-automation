# Playwright Automation

以 Playwright 實作的網頁自動化腳本，主要用於清除 eBird 網站上不正確的繁殖代碼。目前是寫死鳥種與需清除之繁殖代碼，可自行修改程式以適應其他鳥種與繁殖代碼。

## Init

```
npm init playwright@latest
```

// Install VSCode extension: [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

Copy `.env.example` to `.env` and fill in your credentials.

## Run automation

```
node ebird-fix-breeding-code.js
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.