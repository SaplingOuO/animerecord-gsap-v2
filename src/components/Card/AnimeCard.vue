<script setup>
import { gsap } from 'gsap';

// ==========================================
// 1. 📥 接收外部傳入的屬性 (Props)
// ==========================================
const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
});

// ==========================================
// 2. 📢 事件宣告 (Emits)
// ==========================================
const emit = defineEmits(['hover-anime', 'select-anime']);

// ==========================================
// 3. 🎨 動畫與互動處理 (Methods)
// ==========================================
// 滑鼠移入：卡片放大 + 向外廣播動畫中文名稱
const enterAnimation = (event) => {
  gsap.to(event.currentTarget, {
    scale: 1.15,
    duration: 0.3,
    ease: 'power2.out'
  });
  emit('hover-anime', props.anime.cn);
};

// 滑鼠移出：卡片復原 + 清空頁尾顯示名稱
const leaveAnimation = (event) => {
  gsap.to(event.currentTarget, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  });
  emit('hover-anime', '');
};

// 點擊卡片：向外發送選中的動漫物件資料
const handleClick = () => {
  emit('select-anime', props.anime);
};
</script>

<template>
  <!-- 
    🎯 :data-anime 屬性極為關鍵！
    將物件轉成 JSON 字串掛在 DOM 上，利於 GSAP Draggable 在觸控時精準提取資料 
  -->
  <div 
    class="card-container"
    :data-anime="JSON.stringify(props.anime)" 
    @mouseenter="enterAnimation"
    @mouseleave="leaveAnimation"
    @click="handleClick"
  >
    <!-- 🖼️ 圖片懶加載卡片 -->
    <el-image 
      class="card" 
      :src="`@/../animeImages/${props.anime.image}`" 
      fit="cover" 
      lazy
    >
      <template #placeholder>
        <div class="image-slot"></div>
      </template>
    </el-image>
  </div>
</template>

<style scoped>
/* 🃏 卡片基本比例與游標樣式 */
.card {
  width: 100px;
  aspect-ratio: 1 / 1.414; /* 經典海報比例 */
  cursor: pointer;
  position: relative;
  z-index: 1;
}

/* 懸停時提升 DOM 層級，避免放大時被鄰近卡片遮擋 */
.card-container:hover {
  z-index: 10;
}

/* 🖼️ 圖片載入前的占位骨架色塊 */
.image-slot {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>