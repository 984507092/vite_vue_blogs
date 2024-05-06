<template>
  <div class="wrapper">
    <div class="flex flex-items-center justify-between">
      <h3 class="!m-0 p-0">问题文章：</h3>
      <div>
        一共
        <strong>{{ page.length }}</strong> 篇
      </div>
    </div>
    <div>
      <ul>
        <li
          class="flex flex-items-center justify-between"
          v-for="(item,index) in page"
          :key="index"
        >
          <div class="flex flex-items-center">
            <span>{{index + 1}}、</span>
            <a target="_blank" :href="item.link">{{ item.title }}</a>
          </div>
          <span class="time-str c-#999">{{ item.date }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from "vue";
import { data as page } from "../../common/autoFormatData.data.mjs";
</script>

<style lang='scss' scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
</style>