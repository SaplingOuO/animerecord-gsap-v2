<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import animeData from '@/assets/gamerAcg-List.json';
import { groupAnimeData } from '@/utils/homepage/animeParser';

// 儲存轉換後的vue格式
const groupedAnime = ref({});
onMounted(() => {
  // 將josn格式轉換為Vue使用格式
  groupedAnime.value = groupAnimeData(animeData);
});

// 抓取年分，預設為'全部'
const selectedYear = ref('全部');
const yearOptions = computed(() => {
  const years = Object.keys(groupedAnime.value).reverse(); // 取得 ['2026', '2025'...]
  return ['全部', ...years];
});

// 抓取季節，預設為'全部'
const selectedSeason = ref('全部');
const seasonOptions = ['全部', '冬季', '春季', '夏季', '秋季'];

// 宣告子組件要發送的事件名稱
const emit = defineEmits(['filter-change']);
// watch監聽年份與季節，如有變動就觸發emit傳遞新的值
watch([selectedYear, selectedSeason], ([newYear, newSeason]) => {
  emit('filter-change', { year: newYear, season: newSeason });
});

</script>

<template>
  <div class="style">
    <el-select v-model="selectedYear" placeholder="Select" style="width: 240px">
        <el-option
        v-for="item in yearOptions"
        :key="item"
        :label="item"
        :value="item"
        />
    </el-select>
    <el-select v-model="selectedSeason" placeholder="Select" style="width: 240px">
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
.style {
  position: fixed;   /* 🎯 以瀏覽器視窗為定位基準 */
  bottom: 5%;        /* 釘在距離底部 5% 的地方 */
  left: 50%;         /* 🎯 先把左側邊緣對齊螢幕正中間 */
  
  /* 🎯 藉由平移把元件自己的中心點拉回正中間，達成完美水平置中！ */
  transform: translateX(-50%); 
  
  /* 🎯 寬度設為 fit-content（或 max-content），有多少內容就多寬，才不會拉長變形 */
  width: fit-content; 
  
  display: flex;     /* 讓裡面的兩個選單橫向排列 */
  gap: 10px;         /* 兩個選單之間的間距 */
  z-index: 100000;   /* 🎯 層級調得非常高，確保絕對不會被卡片遮住 */
}

/* 調整裡面的選單，移除原本大範圍的 padding */
.el-select {
  width: 10em !important;
  padding: 0; 
}
</style>
