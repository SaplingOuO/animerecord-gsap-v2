<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import animeData from '@/assets/gamerAcg-List.json';
import { groupAnimeData } from '@/utils/homepage/animeParser';

// ==========================================
// 1. 📢 事件宣告 (Emits)
// ==========================================
const emit = defineEmits(['filter-change']);

// ==========================================
// 2. 🎯 響應式狀態 (State)
// ==========================================
const groupedAnime = ref({});         // 存放轉換後的動漫分類資料
const selectedYear = ref('全部');     // 選中的年份（預設 '全部'）
const selectedSeason = ref('全部');   // 選中的季節（預設 '全部'）

// 季節下拉選單選項庫
const seasonOptions = ['全部', '冬季', '春季', '夏季', '秋季'];

// ==========================================
// 3. 🧮 計算屬性 (Computed)
// ==========================================
// 動態解析現有資料中的所有年份，並倒序排列（新年份在前）
const yearOptions = computed(() => {
  const years = Object.keys(groupedAnime.value).reverse(); 
  return ['全部', ...years];
});

// ==========================================
// 4. 👁️ 監聽器與生命週期 (Watch & Lifecycle)
// ==========================================
onMounted(() => {
  // 初始化載入並轉換 JSON 資料
  groupedAnime.value = groupAnimeData(animeData);
});

// 監聽年份與季節變動，即時向父組件同步發送最新的篩選條件
watch([selectedYear, selectedSeason], ([newYear, newSeason]) => {
  emit('filter-change', { year: newYear, season: newSeason });
});
</script>

<template>
  <div class="style">
    <!-- 📅 年份選擇下拉選單 -->
    <el-select v-model="selectedYear" placeholder="選擇年份" style="width: 240px">
      <el-option
        v-for="item in yearOptions"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>

    <!-- 🌸 季節選擇下拉選單 -->
    <el-select v-model="selectedSeason" placeholder="選擇季節" style="width: 240px">
      <el-option
        v-for="item in seasonOptions"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<style scoped>
/* 🎛️ 懸浮選單容器：固定懸浮於視窗底部中央，超級層級確保不被遮檔 */
.style {
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%); /* 水平精準置中 */
  width: fit-content;
  display: flex;
  gap: 10px;
  z-index: 100000;             /* 極高層級，高於畫布卡片與一般遮罩 */
}

/* 覆寫 Element Plus 下拉選單樣式 */
.el-select {
  width: 10em !important;
  padding: 0; 
}
</style>