<template>
  <div>
  
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, createApp, onMounted } from "vue";

onMounted(() => {
  console.log("componentsContext", createApp());
});
</script>

<style lang='scss' scoped>
</style>