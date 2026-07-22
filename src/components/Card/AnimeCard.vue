<script setup>
import { gsap } from 'gsap';

const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
});

// 1. 📢 宣告事件：新增 select-anime 點擊事件
const emit = defineEmits(['hover-anime', 'select-anime']);

// 滑鼠移入：放大 + 發送名稱
const enterAnimation = (event) => {
  gsap.to(event.currentTarget, {
    scale: 1.15,
    duration: 0.3,
    ease: 'power2.out'
  });
  emit('hover-anime', props.anime.cn);
};

// 滑鼠移出：縮小 + 清空名稱
const leaveAnimation = (event) => {
  gsap.to(event.currentTarget, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  });
  emit('hover-anime', '');
};

// 🎯 點擊卡片時觸發
const handleClick = () => {
  emit('select-anime', props.anime);
};
</script>

<template>
  <div 
    class="card-container"
    @mouseenter="enterAnimation"
    @mouseleave="leaveAnimation"
    @click="handleClick"
  >
    <!-- 完全保留你原本喜歡的卡片圖片樣式 -->
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
.card {
  width: 100px;
  aspect-ratio: 1/1.414;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.card-container:hover {
  z-index: 10;
}

.image-slot {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>