# KUANG HAO, Harry — Portfolio

完整靜態網站，包含英文、繁體及簡體版本，毋須安裝或編譯。

## 本地查看

直接開啟 index.html（英文）或 zh-hant/index.html（繁體）、zh-hans/index.html（簡體）。
圖片、CV 及推薦信已包含在 assets 資料夾。Instagram、Bilibili、Facebook 及 Google Fonts 需要網絡；影片預覽也可能受平台限制，可使用原帖連結。

## 部署到 GitHub Pages

1. 在你的 GitHub 帳號建立公開 repository，例如 portfolio。
2. 把本資料夾內全部內容放在 repository 根目錄，確保 index.html 在根目錄，而非再多一層資料夾。請上傳解壓後的檔案，不要只上傳 ZIP。
3. 進入 Settings → Pages。
4. Source 選 Deploy from a branch，Branch 選 main，資料夾選 / (root)，然後 Save。
5. 等待 GitHub 完成發布，Pages 頁面會顯示實際網站網址。

這份網站已使用相對路徑，支援 username.github.io/portfolio/ 及自訂網域。
不用 ChatGPT 登入，也不需要 OpenAI Sites 設定。

如使用 GitHub Desktop：建立／clone repository，將本資料夾內容複製到 repository，Commit 後 Push，再完成以上 Pages 設定。

官方說明：https://docs.github.com/en/pages/quickstart

## 後續修改

三語頁面分別是 index.html、zh-hant/index.html、zh-hans/index.html。
共用樣式為 styles.css，互動為 site.js。
