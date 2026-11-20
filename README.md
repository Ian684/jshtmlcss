# HTML、CSS 與 JavaScript 練習

**目前共 50 個實作練習單元。** 完整題號、來源與執行方式見 [CATALOG.md](CATALOG.md)，機器可讀清單見 [EXERCISES.json](EXERCISES.json)。

以下保留起步練習的說明；其餘題目按完整目錄閱讀。

原本 htmlcss/ 與 js/ 保留。新增 [practice/](practice/) 用三個完整小工具串起表單、DOM、儲存與狀態操作，不需要打包工具或框架。

## 開啟

在 repo 根目錄執行：

    python -m http.server 8000

瀏覽 http://localhost:8000/practice/ 。請使用 HTTP，瀏覽器會限制 file:// 的 ES module。

| 練習 | 可操作功能 | 重點 |
|---|---|---|
| 待辦清單 | 新增、完成、刪除、篩選、重新整理後保留 | textContent、localStorage 與錯誤處理 |
| 記帳 | 分類統計、刪除與 CSV 匯出 | 整數分，0.10+0.20=0.30 |
| 插入排序 | 上一步、下一步、重新輸入 | 陣列快照、負數與重複值 |

## 互動筆記

待辦的使用者輸入直接成為文字節點，不交給 innerHTML。儲存資料先檢查結構，不假設 localStorage 的 JSON 永遠正確。資料僅存在目前瀏覽器，沒有登入或跨裝置同步。

記帳先驗證十進位格式再轉整數分。分類統計從紀錄重算，刪除後不另維護容易不同步的總額。CSV 處理引號與使用者欄位的公式開頭。此頁重新整理會清空，請先匯出。

排序每步保存陣列副本，返回前一步才不受後續修改影響。橘色標示改動位置，紅框表示負數，長條依本次資料比例縮放。為保存步驟，記憶體成本高於原地排序。

## 驗證

    node --test tests/core.test.mjs
    python -m pip install playwright
    python -m playwright install chromium
    python tests/browser_smoke.py

瀏覽器測試自動啟動本機伺服器，檢查保存、篩選、HTML 字串、金額、CSV、排序與 390px 版面。也可設定 BROWSER_EXECUTABLE 指向現有 Edge/Chrome。

第 4–50 題位於 [互動實驗室](practice/lab/index.html)，可用選單或 #題目代號切換。所有 47 個單元都由瀏覽器實際操作測試，另保留原本三個小專案。
