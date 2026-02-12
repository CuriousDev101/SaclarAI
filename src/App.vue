<script setup lang="ts">
import NavBar from './components/NavBar.vue';

</script>

<template>
  <div class="min-h-screen bg-base-200 text-white">
    <NavBar />
    <RouterView />
  </div>
</template>

<style scoped></style>
