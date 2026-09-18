# KUANG HAO, Harry — Portfolio

完整靜態網站，包含英文、繁體及簡體版本，毋須安裝或編譯。

## 本地查看

直接開啟 index.html（英文）或 zh-hant/index.html（繁體）、zh-hans/index.html（簡體）。
圖片、CV 及推薦信已包含在 assets 資料夾。Instagram、Bilibili、Facebook 及 Google Fonts 需要網絡；影片預覽也可能受平台限制，可使用原帖連結。

## 後續修改

三語頁面分別是 index.html、zh-hant/index.html、zh-hans/index.html。
共用樣式為 styles.css，互動為 site.js。

## 圖片與動效

頁面使用 `assets/previews/` 的 WebP 響應式預覽（480 / 960 / 1440px，上限為原圖寬度），保留 lazy loading、圖片比例和原圖連結。28 張原圖約 64.07 MB；每張選用最大預覽合共約 3.38 MB，減少 94.7%。實際傳輸量取決於螢幕尺寸及瀏覽器選圖。

更新原圖後，安裝 Pillow 並執行 `python scripts/optimize_images.py`，同步更新三語頁面。原始 JPG / PNG 不會被覆寫。

展開／收縮使用原生 details 配合 Web Animations API，提供高度和透明度過渡、加號旋轉及連續點擊反向動畫。尊重系統「減少動態效果」設定；沒有 JavaScript 時仍可原生展開。
