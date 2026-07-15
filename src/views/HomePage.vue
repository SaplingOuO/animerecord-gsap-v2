<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import AnimeCard from '@/components/Card/AnimeCard.vue';
import AnimeOption from '@/components/Card/AnimeOption.vue';
import animeData from '@/assets/gamerAcg-List.json';
import { groupAnimeData, filterAnimeData, getRowsPerColumn, totalAnimeCount } from '@/utils/homepage/animeParser';

// 儲存轉換後的vue格式
const groupedAnime = ref({});
onMounted(() => {
  // 將josn格式轉換為Vue使用格式
  groupedAnime.value = groupAnimeData(animeData);
  console.log('--- 分類後的動漫資料 ---', groupedAnime.value);
});

// 建立記錄「目前篩選值」的變數
const currentYear = ref('全部');
const currentSeason = ref('全部');

// 將資料做年份&季節篩選 
const filteredAnime = computed(() => {
  return filterAnimeData(groupedAnime.value, currentYear.value, currentSeason.value);
});

// 建立一個函式，用來接收子組件傳過來的資料
const handleFilterChange = (payload) => {
  currentYear.value = payload.year;
  currentSeason.value = payload.season;
  console.log('目前篩選條件：', currentYear.value, currentSeason.value);
  // 🎯 呼叫時，把 .value 傳進去
  const total = totalAnimeCount(filteredAnime.value);
  console.log('--- 📢 篩選資料總數 ---', total);
};

watch(filteredAnime, (newData) => {
  console.log('--- 📢 watch 偵測到篩選資料更新 ---', newData);
}, { immediate: true }); // immediate: true 代表網頁一載入就先印一次

</script>

<template>
  <div class="container">
    <!-- <div v-for="(seasons, year) in filteredAnime" :key="year" class="year-section">
      <h2>{{ year }} 年</h2>

      <div v-for="(list, season) in seasons" :key="season" class="season-section">
        <h3>{{ season }}</h3>

        <div class="test">
          <AnimeCard v-for="item in list" :key="item.num" :anime="item" />
        </div>
      </div>
    </div> -->
    
      <div class="container">
        <div class="test">
            <AnimeCard/>
        </div>
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