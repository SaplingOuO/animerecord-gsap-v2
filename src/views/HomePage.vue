<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import AnimeCard from '@/components/Card/AnimeCard.vue';
import AnimeOption from '@/components/Card/AnimeOption.vue';
import animeData from '@/assets/gamerAcg-List.json';
import { groupAnimeData, filterAnimeData, getRowsPerColumn, totalAnimeCount, chunkAnimeList } from '@/utils/homepage/animeParser';

// 1. 📥 引入 GSAP 與 Draggable 外掛
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

// 註冊外掛
gsap.registerPlugin(Draggable);

const groupedAnime = ref(groupAnimeData(animeData));
const currentYear = ref('全部');
const currentSeason = ref('全部');

const filteredAnime = computed(() => {
  return filterAnimeData(groupedAnime.value, currentYear.value, currentSeason.value);
});

const total = computed(() => {
  return totalAnimeCount(filteredAnime.value);
});

const column = computed(() => {
  return getRowsPerColumn(total.value);
});

const finalData = computed(() => {
  return chunkAnimeList(filteredAnime.value, column.value);
});

// 2. 🎬 在網頁掛載後，開啟拖拽功能
onMounted(() => {
  Draggable.create(".container", {
    type: "xy",              // 🎯 限制只能左右（橫向）拖拽
    bounds: ".page-wrapper", // 🎯 限制拖拽邊界，拖到底就不能再拖，不會露出白底
    inertia: true,          // 💡 選用：如果想要有滑順的甩開慣性，可以設為 true（需搭配慣性外掛）
    edgeResistance: 0.65    // 💡 邊緣阻力，拉到底時會有像彈簧一樣的拉扯感
  });
});

const handleFilterChange = (payload) => {
  currentYear.value = payload.year;
  currentSeason.value = payload.season;
};
</script>

<template>
  <div class="page-wrapper">
    <div class="container">
      <!-- 外層迴圈：遍歷每一列 (row) 數據 -->
      <div v-for="(row, rowIndex) in finalData" :key="'row-' + rowIndex" class="test">
        <!-- 內層迴圈：遍歷該列裡面的每一部動漫 (item) -->
        <AnimeCard v-for="item in row" :key="item.num" :anime="item" />
      </div>

    </div>
    <AnimeOption @filter-change="handleFilterChange" />
  </div>
</template>

<style scoped>

/* 📦 固定的大相框 */
.page-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;       
  height: 100vh;      
  overflow: hidden;   /* 依然要隱藏預設滾動條 */
}

/* 🏄‍♂️ 變成可以被拖動的長畫布 */
.container {
  display: flex;
  width: max-content; /* 🎯 確保容器寬度由卡片總長度撐開，Draggable 才能計算正確的邊界 */
}

.test {
  width: min-content;
}
</style>