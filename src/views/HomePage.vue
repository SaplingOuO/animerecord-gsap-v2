<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import AnimeCard from '@/components/Card/AnimeCard.vue';
import AnimeOption from '@/components/Card/AnimeOption.vue';
import animeData from '@/assets/gamerAcg-List.json';
import { groupAnimeData, filterAnimeData, getRowsPerColumn, totalAnimeCount,  chunkAnimeList} from '@/utils/homepage/animeParser';

// 將josn格式轉換為Vue使用格式
const groupedAnime = ref(groupAnimeData(animeData));

// 建立記錄「目前篩選值」的變數
const currentYear = ref('全部');
const currentSeason = ref('全部');

// 篩選後的資料
const filteredAnime = computed(() => {
  // 將資料做年份&季節篩選 
  return filterAnimeData(groupedAnime.value, currentYear.value, currentSeason.value);
});

// 資料篩選後的總數
const total = computed(() => {
  return totalAnimeCount(filteredAnime.value);
});

// 每行需要幾部
const column = computed(() => { 
  return getRowsPerColumn(total.value);
});

// 將篩選後的資料切分每行需要的數量給v-for使用
const finalData = computed(() => {
  return chunkAnimeList(filteredAnime.value, column.value);
}) 

const animeList = ref();

// 建立一個函式，用來接收子組件傳過來的資料
const handleFilterChange = (payload) => {
  currentYear.value = payload.year;
  currentSeason.value = payload.season;
  console.log('目前篩選條件：', currentYear.value, currentSeason.value);
  console.log('--- 📢 篩選資料總數 ---', total.value);
  console.log('--- 📢 被篩選的動漫資料 ---', filteredAnime);
  console.log('--- 📐 計算出的最方正行數 (y) ---', column.value);
  console.log('--- 給v-for使用的資料 ---', finalData.value);
};


</script>

<template>
  <div class="container">
    <!-- 外層迴圈：遍歷每一列 (row) 數據 -->
    <div 
      v-for="(row, rowIndex) in finalData" 
      :key="'row-' + rowIndex" 
      class="test"
    >
      <!-- 內層迴圈：遍歷該列裡面的每一部動漫 (item) -->
      <AnimeCard 
        v-for="item in row" 
        :key="item.num" 
        :anime="item" 
        class="card-item"
      />
    </div>

    <AnimeOption @filter-change="handleFilterChange" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
}

.test {
  width: min-content;
}
</style>