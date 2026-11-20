# 練習目錄

目錄列出各題的實作位置與執行入口。

## 執行與驗證

    python -m http.server 8000
    # http://localhost:8000/practice/lab/#dialog
    node --test tests/core.test.mjs
    python tests/browser_smoke.py

## 題目

| 題號 | 任務／學習重點 | 來源 | 入口 |
|---|---|---|---|
| 01 | 待辦清單 | [index.html](practice/todo/index.html) | 檔案本身 |
| 02 | 記帳工具 | [index.html](practice/expenses/index.html) | 檔案本身 |
| 03 | 插入排序觀察 | [index.html](practice/sorting/index.html) | 檔案本身 |
| 04 | 原生對話框：showModal、關閉與焦點 | [labs.mjs](practice/lab/labs.mjs) | dialog |
| 05 | 原生摺疊區：summary 與 toggle 事件 | [labs.mjs](practice/lab/labs.mjs) | details |
| 06 | 無障礙頁籤：aria-selected 與 hidden 同步 | [labs.mjs](practice/lab/labs.mjs) | tabs |
| 07 | 輪播卡片：索引繞回 | [labs.mjs](practice/lab/labs.mjs) | carousel |
| 08 | 主題切換：局部樣式與色彩切換 | [labs.mjs](practice/lab/labs.mjs) | theme |
| 09 | 字級調整：range 與即時樣式 | [labs.mjs](practice/lab/labs.mjs) | font_scale |
| 10 | Grid 欄數：repeat 與 minmax | [labs.mjs](practice/lab/labs.mjs) | grid |
| 11 | Flex 對齊：justify-content 的效果 | [labs.mjs](practice/lab/labs.mjs) | flex |
| 12 | 容器自適應卡片：auto-fit 與寬度 | [labs.mjs](practice/lab/labs.mjs) | responsive |
| 13 | 捲動區固定標題：position:sticky 的容器 | [labs.mjs](practice/lab/labs.mjs) | sticky |
| 14 | 焦點提示：鍵盤也能顯示說明 | [labs.mjs](practice/lab/labs.mjs) | tooltip |
| 15 | 方向鍵選單：roving tabindex | [labs.mjs](practice/lab/labs.mjs) | menu |
| 16 | 密碼顯示切換：type 與 aria-pressed | [labs.mjs](practice/lab/labs.mjs) | password_visibility |
| 17 | 規則計數器：明確規則不冒充安全評分 | [labs.mjs](practice/lab/labs.mjs) | password_meter |
| 18 | Unicode 字元計數：code point 與字串 length | [labs.mjs](practice/lab/labs.mjs) | character_count |
| 19 | 即時篩選：文字節點與清單篩選 | [labs.mjs](practice/lab/labs.mjs) | search |
| 20 | 可排序表格：資料排序後重畫 | [labs.mjs](practice/lab/labs.mjs) | table_sort |
| 21 | 清單分頁：頁碼邊界與按鈕停用 | [labs.mjs](practice/lab/labs.mjs) | pagination |
| 22 | 輸入防抖：清除過期的計時器 | [labs.mjs](practice/lab/labs.mjs) | debounce |
| 23 | 可撤回計數器：歷史堆疊 | [labs.mjs](practice/lab/labs.mjs) | undo_counter |
| 24 | 碼錶：performance.now 與清除 interval | [labs.mjs](practice/lab/labs.mjs) | stopwatch |
| 25 | 倒數計時：截止時刻而非逐次減量 | [labs.mjs](practice/lab/labs.mjs) | countdown |
| 26 | 多步驟流程：狀態與進度同步 | [labs.mjs](practice/lab/labs.mjs) | stepper |
| 27 | 拖放資料：dragstart、dragover 與 drop | [labs.mjs](practice/lab/labs.mjs) | drag_drop |
| 28 | Canvas 畫筆：座標換算與 pointer 事件 | [labs.mjs](practice/lab/labs.mjs) | canvas_draw |
| 29 | Canvas 長條圖：資料比例與可存取文字 | [labs.mjs](practice/lab/labs.mjs) | canvas_chart |
| 30 | SVG 圓形進度：stroke-dashoffset | [labs.mjs](practice/lab/labs.mjs) | svg_progress |
| 31 | 本機檔案預覽：File.text 與文字節點 | [labs.mjs](practice/lab/labs.mjs) | file_preview |
| 32 | CSV 引號狀態機：引號內逗號與成對引號 | [labs.mjs](practice/lab/labs.mjs) | csv_parser |
| 33 | JSON 檢視器：例外處理與格式化 | [labs.mjs](practice/lab/labs.mjs) | json_viewer |
| 34 | JSON 記錄表格：欄位聯集與安全插入 | [labs.mjs](practice/lab/labs.mjs) | json_table |
| 35 | 查詢字串：URLSearchParams 自動編碼 | [labs.mjs](practice/lab/labs.mjs) | query_builder |
| 36 | 網址欄位：URL API 與協定白名單 | [labs.mjs](practice/lab/labs.mjs) | url_inspector |
| 37 | 日期天數差：UTC 午夜避免夏令時間 | [labs.mjs](practice/lab/labs.mjs) | date_difference |
| 38 | 時區顯示：Intl.DateTimeFormat | [labs.mjs](practice/lab/labs.mjs) | timezone |
| 39 | 長度換算：以公尺作共同基準 | [labs.mjs](practice/lab/labs.mjs) | unit_converter |
| 40 | 攝氏華氏換算：雙向公式與有限值 | [labs.mjs](practice/lab/labs.mjs) | temperature |
| 41 | RGB 混色：三個 channel 與 hex 格式 | [labs.mjs](practice/lab/labs.mjs) | rgb |
| 42 | Hex 顏色拆解：格式驗證與位元組 | [labs.mjs](practice/lab/labs.mjs) | hex_color |
| 43 | CSS 漸層：色彩輸入與角度 | [labs.mjs](practice/lab/labs.mjs) | gradient |
| 44 | 剪貼簿 API：安全來源與權限錯誤 | [labs.mjs](practice/lab/labs.mjs) | clipboard |
| 45 | 鍵盤事件：排除輸入框內按鍵 | [labs.mjs](practice/lab/labs.mjs) | keyboard |
| 46 | 本機偏好保存：localStorage JSON 結構 | [labs.mjs](practice/lab/labs.mjs) | preferences |
| 47 | 分頁工作階段：sessionStorage 與 reset | [labs.mjs](practice/lab/labs.mjs) | session |
| 48 | 背景執行緒：Worker 訊息與資源清理 | [labs.mjs](practice/lab/labs.mjs) | worker |
| 49 | 讀取本機 JSON：fetch 狀態與 AbortController | [labs.mjs](practice/lab/labs.mjs) | fetch |
| 50 | 交集觀察器：容器捲動與解除觀察 | [labs.mjs](practice/lab/labs.mjs) | intersection |

每個新增單元的正常值與邊界案例可在 tests/、check.py 或 testbench 找到。先預測輸出，再執行，再修改輸入觀察；不是把通過單一範例視為正式部署或線上 AC。
