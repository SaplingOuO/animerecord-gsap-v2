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
.style{
  width: 100%;
  z-index: 998;
  position: fixed;
  bottom: 5%;
}
.el-select{
    padding: 1em;
}
</style>
