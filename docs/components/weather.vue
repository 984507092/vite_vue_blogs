<template>
  <div class="mt-5" v-if="setData.isShow">
    <div v-for="(item,index) in setData.weather.lives" :key="index">
      <span>城市：{{item.province + item.city}}</span>
      <span class="ml-5">天气：{{item.weather}}</span>
      <span class="ml-5">温度：{{item.temperature}}</span>
      <span class="ml-5">风向：{{item.winddirection}}</span>
      <span class="ml-5">湿度：{{item.humidity}}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getWeather } from "../api/index";

let setData = reactive({
  isShow: false,
  weather: {}
});

const weatherData = async () => {
  let res = await getWeather();
  if (res.code == 200) {
    setData.isShow = true;
    setData.weather = res.data;
  }
};

onMounted(() => {
  weatherData();
});
</script>

<style lang='scss' scoped>
</style>