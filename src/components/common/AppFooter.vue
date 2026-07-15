<script setup>
import {ref} from 'vue'

const value = ref(0)

</script>

<template>
  <div class="test">
    123
  </div>
  
</template>

<style scoped>

.test {
  width: 100%;
  z-index: 999;
  position: fixed;
  bottom: 0;
}
</style>