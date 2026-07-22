<script setup>
import { ref, watch, nextTick } from 'vue';
import { gsap } from 'gsap';

const props = defineProps({
  footerInfo: {
    type: Object,
    default: () => ({ name: '', total: 0 })
  },
  selectedAnime: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close-modal']);

const footerRef = ref(null);
const isExpanded = ref(false);

// 🎯 新增：控制「詳細資料」是否顯示的開關
const showContent = ref(false);

watch(
  () => props.selectedAnime,
  (newVal) => {
    if (newVal) {
      openModal();
    } else {
      closeModal();
    }
  }
);

// 🚀 展開動畫
const openModal = () => {
  isExpanded.value = true;
  showContent.value = false; // 1. 開始展開前，先隱藏內容

  gsap.to(footerRef.value, {
    width: '480px',
    height: '280px',
    bottom: '50%',
    left: '50%',
    xPercent: -50,
    yPercent: 50,
    borderRadius: '16px',
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    duration: 0.3,
    ease: 'power3.out',
    // 🎯 2. 等 GSAP 位移與形變全部結束後，再顯示資料內容！
    onComplete: async() => {
      showContent.value = true;
      await nextTick(); // 3. 等待 Vue 完成 DOM 繪製
      
      // 4. 讓 modal-body 從 opacity: 0 漸變到 opacity: 1
      gsap.fromTo(
        '.modal-body',
        { opacity: 0, y: 10 }, // 起始狀態：透明且微微下移
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' } // 結束狀態：完全不透明並回位
      );
    }
  });
};

// 🛬 收回動畫
const closeModal = () => {
  // 1. 開始收回時，先立刻把詳細資料隱藏掉
  showContent.value = false;

  gsap.to(footerRef.value, {
    width: '100vw',
    height: '40px',
    bottom: '0px',
    left: '0px',
    xPercent: 0,
    yPercent: 0,
    borderRadius: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    boxShadow: 'none',
    duration: 0.3,
    ease: 'power2.inOut',
    onComplete: () => {
      isExpanded.value = false;
      emit('close-modal');
    }
  });
};
</script>

<template>
  <div ref="footerRef" class="anime-footer">
    <!-- 1. 預設狀態：未展開時顯示 Footer 文字 -->
    <template v-if="!isExpanded">
      <span class="anime-title">
        {{ footerInfo.name || '目前選取 ' + footerInfo.total + ' 部動畫' }}
      </span>
    </template>

    <!-- 2. 展開狀態：必須等定位完成 (showContent === true) 才顯示內容 -->
    <template v-else>
      <div class="modal-body" v-if="selectedAnime && showContent">
        <button class="close-btn" @click="closeModal">✕</button>
        <div class="modal-content">
          <img :src="`@/../animeImages/${selectedAnime.image}`" class="modal-img" />
          <div class="modal-info">
            <h3>{{ selectedAnime.cn }}</h3>
            <p v-if="selectedAnime.jp" class="jp-name">{{ selectedAnime.jp }}</p>
            <p>年份：{{ selectedAnime.year || '未提供' }}</p>
            <p>季節：{{ selectedAnime.season || '未提供' }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* 樣式保持不變 */
.anime-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  box-sizing: border-box;
  padding: 0 20px;
}

.anime-title {
  font-size: 14px;
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-body {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.7;
}

.close-btn:hover {
  opacity: 1;
}

.modal-content {
  display: flex;
  gap: 20px;
  align-items: center;
  height: 100%;
}

.modal-img {
  width: 110px;
  height: 155px;
  object-fit: cover;
  border-radius: 6px;
}

.modal-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.jp-name {
  color: #888;
  font-size: 12px;
  margin-bottom: 8px;
}

.modal-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #ccc;
}
</style>