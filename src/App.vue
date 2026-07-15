<script setup>
import AppNavbar from '@/components/common/AppNavbar.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import HomePage from '@/views/HomePage.vue';
</script>

<template>
  <div>
    <AppNavbar />
    <div class="main">
      <HomePage />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped></style>
