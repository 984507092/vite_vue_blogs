<template>
  <div class="mt-5" v-if="setData.isShow">
    <div class="flex items-center" v-for="(item,index) in setData.weather.lives" :key="index">
      <div>
        <span>城市：</span>
        <span class="c-#0ea5e9 font-size-6">{{item.province + item.city}}</span>
      </div>
      <div class="ml-5 flex items-center">
        <span>天气：</span>
        <span class="c-#0ea5e9 font-size-6">{{item.weather}}</span>
        <n-icon size="40">
          <svg t="1715829970137" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4367" width="32"
            height="32">
            <path d="M814.8 602.8L783 571c-3.7-3.7-3.7-9.9 0-13.6 3.7-3.7 9.9-3.7 13.6 0l31.8 31.8c3.7 3.7 3.7 9.9 0 13.6-3.7 3.8-9.9 3.8-13.6 0z"
              fill="#F4BA64" p-id="4368" />
            <path d="M674.3 457.4m-138.2 0a138.2 138.2 0 1 0 276.4 0 138.2 138.2 0 1 0-276.4 0Z" fill="#F7931E" p-id="4369" />
            <path
              d="M656.6 579.5c-78.8 0-143-64.1-143-143s64.1-143 143-143c41.2 0 61 12.6 72.9 20.2l1.2 0.8c4.5 2.8 5.8 8.8 3 13.3-2.9 4.5-8.8 5.8-13.3 3l-1.2-0.8c-11.4-7.2-27-17.2-62.5-17.2-68.2 0-123.7 55.5-123.7 123.7s55.5 123.7 123.7 123.7 123.7-55.5 123.7-123.7c0-39.8-17.4-65.8-30.5-81.8-3.4-4.1-2.8-10.2 1.4-13.6 4.1-3.4 10.2-2.8 13.6 1.4 8.6 10.6 34.9 42.7 34.9 94-0.2 78.8-64.4 143-143.2 143z"
              fill p-id="4370" />
            <path d="M886.4 446.1h-45c-5.3 0-9.6-4.3-9.6-9.6s4.3-9.6 9.6-9.6h45c5.3 0 9.6 4.3 9.6 9.6s-4.3 9.6-9.6 9.6z" fill="#FFDB69" p-id="4371" />
            <path d="M832 279.6l-31.8 31.8c-3.7 3.7-9.9 3.7-13.6 0-3.7-3.7-3.7-9.9 0-13.6l31.8-31.8c3.7-3.7 9.9-3.7 13.6 0 3.8 3.7 3.8 9.9 0 13.6z"
              fill="#F4BA64" p-id="4372" />
            <path d="M675.9 200.3v45c0 5.3-4.3 9.6-9.6 9.6s-9.6-4.3-9.6-9.6v-45c0-5.3 4.3-9.6 9.6-9.6 5.2 0 9.6 4.3 9.6 9.6z" fill="#FFDB69"
              p-id="4373" />
            <path d="M509.4 254.6l31.8 31.8c3.7 3.7 3.7 9.9 0 13.6-3.7 3.7-9.9 3.7-13.6 0l-31.8-31.8c-3.7-3.7-3.7-9.9 0-13.6 3.7-3.7 9.8-3.7 13.6 0z"
              fill="#F4BA64" p-id="4374" />
            <path
              d="M688.2 552.8c-1.4 0-2.7 0.1-4.1 0.1-0.7 0-1.3-0.1-2-0.1h-65.5c-10.4-77.5-76.8-137.2-157.1-137.2-78.3 0-143.4 56.8-156.2 131.5-74.6 5.1-133.5 67.1-133.5 143 0 79.2 64.2 143.3 143.3 143.3 3 0 6.1-0.1 9.1-0.3 2 0.2 4.1 0.3 6.2 0.3h353.8c0.7 0 1.3-0.1 2-0.1 1.4 0 2.7 0.1 4.1 0.1 77.5 0 140.3-62.8 140.3-140.3-0.1-77.5-62.9-140.3-140.4-140.3z"
              fill="#FFECB6" p-id="4375" />
            <path
              d="M656.1 823.7c-1.1 0-2.2 0-3.2-0.1h-1.1c-0.5 0.1-1.1 0.1-1.8 0.1H422c-5.3 0-9.6-4.3-9.6-9.6s4.3-9.6 9.6-9.6l231.5-0.1c0.9 0 1.7 0.1 2.6 0.1 72 0 130.7-58.6 130.7-130.7 0-72-58.6-130.6-130.7-130.6-0.9 0-1.7 0-2.6 0.1h-1.2l-1.8-0.1h-74.4l-1.1-8.4c-9.9-73.5-73.3-128.9-147.6-128.9-72.7 0-134.4 51.9-146.7 123.5l-1.3 7.5-7.6 0.5c-69.8 4.7-124.5 63.3-124.5 133.3 0 73.6 59.8 133.6 133.5 133.7 0.7-0.1 1.4-0.2 2.3-0.3 5.5-0.4 9.9 3.7 10.2 9 0.3 5.3-3.6 9.8-8.9 10.2-1 0.2-2.1 0.3-3.4 0.3-84.4 0-153-68.6-153-153 0-77.6 58.7-143 135-151.9 16.7-77.1 84.7-132.2 164.3-132.2 81 0 150.6 58.4 165.3 137.2H650c0.6 0 1.2 0 1.8 0.1h1.1c1.1 0 2.2-0.1 3.2-0.1 82.7 0 149.9 67.3 149.9 149.9s-67.2 150.1-149.9 150.1z"
              fill p-id="4376" />
            <path d="M344.9 823.7h-16.5c-5.3 0-9.6-4.3-9.6-9.6s4.3-9.6 9.6-9.6h16.5c5.3 0 9.6 4.3 9.6 9.6s-4.3 9.6-9.6 9.6z" fill p-id="4377" />
          </svg>
        </n-icon>
      </div>
      <div class="ml-5 flex items-center">
        <span>温度：</span>
        <span class="c-#0ea5e9 font-size-6">{{item.temperature}}</span> ℃
      </div>
      <div class="ml-5 flex items-center">
        <span>风向：</span>
        <span class="c-#0ea5e9 font-size-6">{{item.winddirection}}</span>
      </div>
      <div class="ml-5 flex items-center">
        <span>湿度：</span>
        <span class="c-#0ea5e9 font-size-6">{{item.humidity}}</span>
      </div>
      <div class="ml-5 flex items-center">
        <span>风强：</span>
        <span class="c-#0ea5e9 font-size-6">{{item.windpower}}</span>
      </div>
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
  // weatherData();
});
</script>

<style lang='scss' scoped>
</style>