<script setup>
import { ref, watch, nextTick } from 'vue';
import { gsap } from 'gsap';

// ==========================================
// 1. 📥 接收外部傳入的資料 (Props)
// ==========================================
const props = defineProps({
    // 底部列預設要顯示的文字與總數
    footerInfo: {
        type: Object,
        default: () => ({ name: '', total: 0 })
    },
    // 當前被點擊選中的動漫資料（為 null 時代表關閉彈窗）
    selectedAnime: {
        type: Object,
        default: null
    }
});

// ==========================================
// 2. 📢 定義向父組件發送的事件 (Emits)
// ==========================================
const emit = defineEmits(['close-modal']);

// ==========================================
// 3. 🎯 響應式狀態與 DOM 元素參照 (Refs)
// ==========================================
const footerRef = ref(null);   // 對應底部列/彈窗本體 HTML 元素
const overlayRef = ref(null);  // 對應全螢幕遮罩 HTML 元素
const isExpanded = ref(false); // 標記目前是「展開彈窗模式」還是「底部頁尾模式」
const showContent = ref(false); // 控制彈窗內部的詳細文字與圖片是否渲染
const isAnimating = ref(false);  // 標記目前動畫是否被執行
// ==========================================
// 4. 👁️ 監聽器 (Watch)
// ==========================================
// 監聽傳進來的 selectedAnime：有資料就開啟彈窗，沒資料就關閉
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
// 5. 🚀 展開動畫 (Open Modal)
// ==========================================
const openModal = async () => {
    if (isAnimating.value) return;
    // ① 切換狀態為「展開模式」，並先隱藏詳細內容（避免變形過程內容擠在一起）
    isExpanded.value = true;
    showContent.value = false;
    isAnimating.value = true;

    // ② 等待 Vue 將 overlayRef (遮罩) 渲染到 DOM 上
    await nextTick();

    // ③ 執行遮罩淡入動畫
    gsap.fromTo(overlayRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    // ④ 執行 Footer 變身為中央彈窗的變形動畫
    gsap.to(footerRef.value, {
        width: '480px',
        height: '280px',
        bottom: '50%',
        left: '50%',
        xPercent: -50, // 搭配 left:50% 達成水平置中
        yPercent: 50,  // 搭配 bottom:50% 達成垂直置中
        borderRadius: '16px',
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        duration: 0.4,
        ease: 'power3.out',
        // ⑤ 變形成型後觸發的回調函式 (onComplete)
        onComplete: async () => {
            if (isExpanded.value) {
                // 顯示詳細資料結構
                showContent.value = true;
                // 等待 DOM 繪製完成
                await nextTick();
                // 執行詳細資料內容淡入與微微上浮的動畫
                gsap.fromTo('.modal-body',
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', 
                        onComplete: () => {
                            isAnimating.value = false;
                        }
                    }
                );
            }else{
                isAnimating.value = false;
            }
        }
    });
};

// ==========================================
// 6. 🛬 收回動畫 (Close Modal)
// ==========================================
const closeModal = () => {
    if (isAnimating.value) return;
    // ① 開始收回時，立刻把詳細資料隱藏
    showContent.value = false;
    isAnimating.value = true;

    // ② 執行遮罩淡出動畫
    if (overlayRef.value) {
        gsap.to(overlayRef.value, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut'
        });
    }

    // ③ 執行彈窗縮回成底部 Footer 的過渡動畫
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
        // ④ 完全縮回底部後觸發的回調函式
        onComplete: () => {
            isExpanded.value = false; // 切回底部模式
            isAnimating.value = false;
            emit('close-modal');       // 通知父組件將 selectedAnime 清空
        }
    });
};
</script>

<template>
    <!-- 🛡️ 全螢幕黑色半透明遮罩：只有在展開時存在，點擊背景可關閉視窗 -->
    <div v-if="isExpanded" ref="overlayRef" class="modal-overlay" @click="closeModal"
        :class="{ 'disabled': isAnimating }"></div>

    <!-- 📦 底欄 / 彈窗本體 -->
    <div ref="footerRef" class="anime-footer" :class="{ 'disabled': isAnimating }">
        <!-- 情況 A：未展開時，顯示預設的 Footer 提示文字 -->
        <template v-if="!isExpanded">
            <span class="anime-title">
                {{ footerInfo.name || '目前 ' + footerInfo.total + ' 部動畫' }}
            </span>
        </template>

        <!-- 情況 B：展開後，等定位完成 (showContent 為 true) 顯示動漫詳細資料 -->
        <template v-else>
            <div class="modal-body" v-if="selectedAnime && showContent">
                <!-- 關閉按鈕 -->
                <button class="close-btn" @click="closeModal">✕</button>

                <!-- 詳細資訊布局 -->
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
/* 🛡️ 遮罩樣式：全螢幕半透明黑，層級 998 */
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

/* 📦 底部列 / 彈窗容器：預設固定底部，層級 999 (高於遮罩) */
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

.disabled {
    pointer-events: none !important;
}
</style>