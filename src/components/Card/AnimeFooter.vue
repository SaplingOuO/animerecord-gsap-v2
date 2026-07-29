<script setup>
import { ref, watch, nextTick } from 'vue';
import { gsap } from 'gsap';

// ==========================================
// 1. 📥 元件屬性與事件 (Props & Emits)
// ==========================================
const props = defineProps({
  // 底部頁尾預設顯示的提示資訊
  footerInfo: {
    type: Object,
    default: () => ({ name: '', total: 0 })
  },
  // 當前被選中的動漫物件（null 表示關閉彈窗）
  selectedAnime: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close-modal']);

// ==========================================
// 2. 🎯 響應式狀態與 DOM 參照 (State & Refs)
// ==========================================
const footerRef = ref(null);   // 底欄 / 彈窗容器 DOM
const overlayRef = ref(null);  // 全螢幕遮罩 DOM

const isExpanded = ref(false);  // 切換模式：false (底部頁尾) / true (中央彈窗)
const showContent = ref(false); // 控制彈窗內部詳細內容的渲染
const isAnimating = ref(false); // 動畫狀態鎖：防止過渡期間點擊觸發二次動畫

// ==========================================
// 3. 👁️ 監聽器 (Watchers)
// ==========================================
// 監聽傳入資料：有資料則展開，無資料則關閉
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

// ==========================================
// 4. 🚀 展開動畫流程 (Open Modal)
// ==========================================
const openModal = async () => {
  // 🛡️ 動畫進行中直接攔截，避免點擊觸發衝突
  if (isAnimating.value) return;

  // ① 切換至展開模式，啟動狀態鎖並隱藏舊內容
  isExpanded.value = true;
  showContent.value = false;
  isAnimating.value = true;

  // ② 等待 DOM 繪製完成以取得 overlayRef
  await nextTick();

  // ③ 遮罩即時淡入（直接覆蓋全螢幕，阻擋後方卡片的 hover 與點擊）
  gsap.fromTo(overlayRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.1, ease: 'power2.out' }
  );

  // ④ 執行 Footer 展開變形動畫
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
    duration: 0.4,
    ease: 'power3.out',
    onComplete: async () => {
      // ⑤ 變形完成後顯示內部詳細結構
      if (isExpanded.value) {
        showContent.value = true;
        await nextTick();

        // ⑥ 執行內容文字淡入與微幅上浮動畫
        gsap.fromTo('.modal-body',
          { opacity: 0, y: 10 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.3, 
            ease: 'power2.out',
            onComplete: () => {
              // 🔓 所有動畫完全結束，解除狀態鎖
              isAnimating.value = false;
            }
          }
        );
      } else {
        isAnimating.value = false;
      }
    }
  });
};

// ==========================================
// 5. 🛬 收回動畫流程 (Close Modal)
// ==========================================
const closeModal = () => {
  // 🛡️ 動畫進行中直接攔截
  if (isAnimating.value) return;

  // ① 立刻隱藏詳細內容並啟動狀態鎖
  showContent.value = false;
  isAnimating.value = true;

  // ② 遮罩淡出
  if (overlayRef.value) {
    gsap.to(overlayRef.value, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut'
    });
  }

  // ③ 彈窗縮回至底部 Footer
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
      // ④ 完全縮回後切回頁尾模式、解鎖並發送關閉事件
      isExpanded.value = false;
      isAnimating.value = false;
      emit('close-modal');
    }
  });
};
</script>

<template>
  <!-- 🛡️ 全螢幕黑色半透明遮罩（不加 disabled，確保第一時間阻擋背景互動） -->
  <div 
    v-if="isExpanded" 
    ref="overlayRef" 
    class="modal-overlay" 
    @click="closeModal"
  ></div>

  <!-- 📦 底部列 / 彈窗本體 (動畫中加上 disabled 避免觸發內部關閉按鈕) -->
  <div 
    ref="footerRef" 
    class="anime-footer" 
    :class="{ 'disabled': isAnimating }"
  >
    <!-- 情況 A：頁尾提示模式 -->
    <template v-if="!isExpanded">
      <span class="anime-title">
        {{ footerInfo.name || '目前 ' + footerInfo.total + ' 部動畫' }}
      </span>
    </template>

    <!-- 情況 B：中央彈窗詳細資料模式 -->
    <template v-else>
      <div class="modal-body" v-if="selectedAnime && showContent">
        <!-- 關閉按鈕 -->
        <button class="close-btn" @click="closeModal">✕</button>

        <!-- 詳細內容區塊 -->
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
/* 🛡️ 遮罩樣式：固定全螢幕，層級 998 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 998;
  cursor: pointer;
}

/* 📦 底部列 / 彈窗容器：層級 999 (高於遮罩) */
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

/* 🎯 彈窗內部佈局樣式 */
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

/* 🔒 動畫播放中停用內部元素點擊 */
.disabled {
  pointer-events: none !important;
}
</style>