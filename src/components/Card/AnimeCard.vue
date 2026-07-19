<script setup>
// 1. 📥 引入 GSAP
import { gsap } from 'gsap';

// 接收父元件傳過來的 anime 物件資料（維持原樣）
const props = defineProps({
  anime: {
    type: Object,
    required: true
  }
});

// 2. 🎬 定義動畫函式

// 滑鼠移入：放大
const enterAnimation = (event) => {
  // event.currentTarget 指的是目前觸發事件的那個 HTML 元素
  gsap.to(event.currentTarget, {
    scale: 1.15,      // 放大到 1.15 倍（你可以依喜好調整，例如 1.1 或 1.2）
    duration: 0.3,    // 動畫時間 0.3 秒，看起來流暢不拖泥帶水
    ease: 'power2.out' // 使用 'power2.out' 速度曲線，開頭快結尾慢，很有質感
  });
};

// 滑鼠移出：縮小回原狀
const leaveAnimation = (event) => {
  gsap.to(event.currentTarget, {
    scale: 1,         // 恢復成原始大小 (1 倍)
    duration: 0.3,
    ease: 'power2.out' // 移出時通常使用跟移入一樣的 ease，看起來比較一致
  });
};
</script>

<template>
  <!-- 3. 🎯 綁定事件：將滑鼠移入/移出事件綁定到 <el-image> 上 -->
  <el-image 
    class="card" 
    :src="`@/../animeImages/${props.anime.image}`" 
    fit="cover"
    lazy
    @mouseenter="enterAnimation"
    @mouseleave="leaveAnimation"
  >
  <!-- 為了讓el-image部出現白底使用佔位符來做透明底替換 -->
  <template #placeholder>
      <div class="image-slot"></div>
    </template>
  </el-image>
</template>

<style scoped>
.card {
  width: 100px;
  aspect-ratio: 1/1.414;
  cursor: pointer; /* 💡 順便加上手指游標，告訴使用者這是可以互動的 */
  
  /* ⚠️ 關鍵：確保 GSAP 動畫在最上層，不會被其他卡片遮擋 */
  position: relative; 
  z-index: 1;
}

/* 💡 選用：當滑鼠移入時，稍微提升 z-index，確保放大時一定在最上層 */
.card:hover {
  z-index: 10;
}
/* 💡 設計你的載入中占位樣式 */
.image-slot {
  width: 100%;
  height: 100%;
  /* 填入你網頁背景的顏色，或是帶點透明度的深色（例如 rgba） */
  background-color: rgba(0, 0, 0, 0.2); 
}
</style>