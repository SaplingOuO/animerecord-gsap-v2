<script setup>
import { onMounted, ref, computed } from 'vue';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

// 元件匯入
import AnimeCard from '@/components/Card/AnimeCard.vue';
import AnimeOption from '@/components/Card/AnimeOption.vue';
import AnimeFooter from '@/components/Card/AnimeFooter.vue';

// 資料與工具函式匯入
import animeData from '@/assets/gamerAcg-List.json';
import { 
  groupAnimeData, 
  filterAnimeData, 
  getRowsPerColumn, 
  totalAnimeCount, 
  chunkAnimeList 
} from '@/utils/homepage/animeParser';

// 註冊 GSAP 拖曳外掛
gsap.registerPlugin(Draggable);

// ==========================================
// 1. 🎯 響應式狀態 (State)
// ==========================================
const groupedAnime = ref(groupAnimeData(animeData)); // 格式化後的完整動漫資料
const currentYear = ref('全部');                      // 當前篩選年份
const currentSeason = ref('全部');                    // 當前篩選季節
const hoveredAnimeName = ref('');                    // 當前懸停的動漫名稱
const selectedAnime = ref(null);                     // 當前點擊選中的動漫物件（null 表示關閉彈窗）

// ==========================================
// 2. 🧮 計算屬性 (Computed)
// ==========================================
// 依據年份與季節篩選後的動漫列表
const filteredAnime = computed(() => {
  return filterAnimeData(groupedAnime.value, currentYear.value, currentSeason.value);
});

// 篩選後的動漫總數
const total = computed(() => {
  return totalAnimeCount(filteredAnime.value);
});

// 計算每列應分配的卡片數量
const column = computed(() => {
  return getRowsPerColumn(total.value);
});

// 將動漫列表進行二維陣列切片，供樣式分頁/分欄渲染
const finalData = computed(() => {
  return chunkAnimeList(filteredAnime.value, column.value);
});

// 組合傳遞給 AnimeFooter 的預設頁尾資訊
const footerData = computed(() => {
  return {
    name: hoveredAnimeName.value,
    total: total.value
  };
});

// ==========================================
// 3. 🎯 事件處理函式 (Event Handlers)
// ==========================================
// 處理卡片懸停事件：更新頁尾顯示名稱
const handleAnimeHover = (name) => {
  hoveredAnimeName.value = name;
};

// 處理桌面端卡片直接點擊事件
const handleAnimeSelect = (anime) => {
  selectedAnime.value = anime;
};

// 處理關閉彈窗事件：清空選中資料
const handleCloseModal = () => {
  selectedAnime.value = null;
};

// 處理篩選條件變更（年份/季節）
const handleFilterChange = (payload) => {
  currentYear.value = payload.year;
  currentSeason.value = payload.season;
};

// ==========================================
// 4. 🚀 生命週期鉤子 (Lifecycle)
// ==========================================
onMounted(() => {
  // 初始化全頁面地圖拖曳效果
  Draggable.create(".container", {
    type: "xy",
    bounds: ".page-wrapper",
    inertia: true,
    edgeResistance: 0.65,
    
    // 🎯 採用 GSAP 內建 onClick 解決移動端拖曳與點擊衝突問題
    onClick: function (e) {
      // 尋找離觸控/點擊目標最近的卡片 DOM 元素
      const cardElement = e.target.closest('.card-container');
      
      // 解析 DOM 上綁定的 :data-anime JSON 字串
      if (cardElement && cardElement.dataset.anime) {
        try {
          const animeData = JSON.parse(cardElement.dataset.anime);
          // 更新選中的動漫狀態，觸發 AnimeFooter 開啟彈窗
          selectedAnime.value = animeData;
        } catch (error) {
          console.error("解析動漫資料失敗：", error);
        }
      }
    }
  });
});
</script>

<template>
  <div class="page-wrapper">
    <!-- 🗺️ 可無限拖曳的動漫卡片畫布容器 -->
    <div class="container">
      <div 
        v-for="(row, rowIndex) in finalData" 
        :key="'row-' + rowIndex" 
        class="test"
      >
        <AnimeCard 
          v-for="item in row" 
          :key="item.num" 
          :anime="item"
          @hover-anime="handleAnimeHover" 
          @select-anime="handleAnimeSelect"
        />
      </div>
    </div>

    <!-- 🔍 固定於頁面下方的年份/季節篩選選單 -->
    <AnimeOption @filter-change="handleFilterChange" />
    
    <!-- 📦 固定於底部的頁尾 / 展開中央彈窗元件 -->
    <AnimeFooter 
      :footer-info="footerData" 
      :selected-anime="selectedAnime"
      @close-modal="handleCloseModal"
    />
  </div>
</template>

<style scoped>
/* 🌐 全螢幕畫布框架：隱藏原生滾動條，靠 GSAP 拖曳瀏覽 */
.page-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;       
  height: 100vh;      
  overflow: hidden;
}

/* 🖼️ 卡片容器：寬度隨內容自動延伸 */
.container {
  display: flex;
  width: max-content;
}

/* 📊 欄位切片容器 */
.test {
  width: min-content;
}
</style>