<script setup>
import {ref} from 'vue'

const value = ref(0)

</script>

<template>
  <div class="test">
  </div>
  
</template>

<style scoped>

.test {
  position: fixed;
  bottom: 0;
  left: 0;        /* 🎯 釘死在最左邊 */
  width: 100vw;   /* 🎯 永遠與螢幕畫面同寬 */
  z-index: 999;
}
</style>