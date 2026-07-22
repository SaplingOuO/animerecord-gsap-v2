<script setup>
import { onMounted, ref, computed } from 'vue';
import AnimeCard from '@/components/Card/AnimeCard.vue';
import AnimeOption from '@/components/Card/AnimeOption.vue';
import AnimeFooter from '@/components/Card/AnimeFooter.vue';
import animeData from '@/assets/gamerAcg-List.json';
import { groupAnimeData, filterAnimeData, getRowsPerColumn, totalAnimeCount, chunkAnimeList } from '@/utils/homepage/animeParser';

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const groupedAnime = ref(groupAnimeData(animeData));
const currentYear = ref('全部');
const currentSeason = ref('全部');
const hoveredAnimeName = ref('');

// 📝 新增：記錄目前被點擊選中的動漫
const selectedAnime = ref(null);

const handleAnimeHover = (name) => {
  hoveredAnimeName.value = name;
};

// 🎯 處理卡片點擊事件
const handleAnimeSelect = (anime) => {
  selectedAnime.value = anime;
};

// ❌ 處理關閉視窗事件
const handleCloseModal = () => {
  selectedAnime.value = null;
};

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

const footerData = computed(() => {
  return {
    name: hoveredAnimeName.value,
    total: total.value
  };
});

onMounted(() => {
  Draggable.create(".container", {
    type: "xy",
    bounds: ".page-wrapper",
    inertia: true,
    edgeResistance: 0.65
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
      <div v-for="(row, rowIndex) in finalData" :key="'row-' + rowIndex" class="test">
        <AnimeCard 
          v-for="item in row" 
          :key="item.num" 
          :anime="item"
          @hover-anime="handleAnimeHover" 
          @select-anime="handleAnimeSelect"
        />
      </div>
    </div>

    <AnimeOption @filter-change="handleFilterChange" />
    
    <!-- 傳入選中的動漫資料，並監聽關閉事件 -->
    <AnimeFooter 
      :footer-info="footerData" 
      :selected-anime="selectedAnime"
      @close-modal="handleCloseModal"
    />
  </div>
</template>

<style scoped>
.page-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;       
  height: 100vh;      
  overflow: hidden;
}

.container {
  display: flex;
  width: max-content;
}

.test {
  width: min-content;
}
</style>