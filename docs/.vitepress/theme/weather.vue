<template>
  <div>555555555</div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from "vue";
import { getWeather } from "../../api/index";

onMounted(async () => {
  let data = await getWeather();
  console.log(data, "data");
});
</script>

<style lang='scss' scoped>
</style>