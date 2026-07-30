# 📌 Interactive Anime Canvas - 2D 動態動畫地圖與互動畫布

這個專案是一個整合了 **Python 後端數據採集** 與 **Vue 3 + GSAP 前端視覺互動** 的獨立 Web 應用。專案突破傳統的網頁列表形式，以 **2D 可拖曳畫布** 為核心，實作流暢的轉場動畫與多維度資料動態篩選。

---

## 🛠️ 核心技術棧 (Tech Stack)

* **數據採集工程**：Python 3 (Requests, BeautifulSoup)
* **前端核心框架**：Vue 3 (`<script setup>` Composition API)
* **動畫與互動引擎**：GSAP 3 & GSAP Draggable
* **UI 視覺佈局**：Element Plus (`el-image`, `el-select`) & Scoped CSS
* **建構工具**：Vite

---

## 🚀 後端數據工程與純函式資料架構

為了讓前端能高效掌控與渲染數百條動漫資料，我採用了「資料邏輯與 UI 檢視分離」的架構：
1. **Python 自動化採集**：撰寫爬蟲腳本定時擷取巴哈姆特 ACG 數據，清洗並輸出為標準 JSON 格式（`gamerAcg-List.json`）。
2. **純函式資料解析器 (`animeParser.js`)**：將複雜的資料處理獨立封裝成 Pure Functions，處理年份/季節分類 (`groupAnimeData`)、動態過濾 (`filterAnimeData`) 與二維陣列切片 (`chunkAnimeList`)，確保 Vue 元件職責單一且易於維護。

---

## 🎨 UI/UX 踩坑實錄與視覺工程化

### 1. 手勢與點擊衝突優化 (Event Handling Optimization)
* **踩坑**：在 2D 拖曳畫布上，使用者在拖曳地圖（Drag）與點擊卡片（Click）時容易產生事件觸發衝突，導致滑動時誤觸開啟詳細資訊彈窗。
* **解決方案**：利用 **GSAP Draggable** 的 `onClick` 事件鉤子，搭配 DOM 節點上的 `data-anime` JSON 屬性提取機制。只有當使用者進行明確點擊而非拖曳位移時才觸發解析，成功解決行動端與桌面端的觸控事件衝突。

### 2. 狀態列到彈窗的流暢形變與狀態鎖 (Morphing & Animation Lock)
* **挑戰**：傳統彈窗（Modal）切換較為生硬。本專案規劃將頁尾狀態欄（Footer）平滑擴展形變為中央詳細視窗，但在動畫過渡期間使用者若連續點擊，極易導致 GSAP 動畫狀態錯亂。
* **解決方案**：設計 **`isAnimating` 狀態鎖** 與 CSS `pointer-events: none` 阻擋機制。在過渡動畫執行期間停用重複互動，確保動畫順暢播放完畢後才解除鎖定，提升 UI 互動的穩定度。

---

## 📂 專案目錄結構 (Project Structure)

```text
src/
├── assets/          # 🖼️ 靜態資源與動漫 JSON 資料
├── components/      # 🧩 UI 元件庫 (AnimeCard, AnimeFooter, AnimeOption)
├── utils/           # 🧰 animeParser.js (資料處理與切片邏輯)
├── views/           # 🖼️ HomePage.vue (畫布主頁面)
└── App.vue          # 🏠 根組件