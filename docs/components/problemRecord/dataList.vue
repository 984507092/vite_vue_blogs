<template>
  <div class="wrapper">
    <div class="flex flex-items-center justify-between">
      <h3 class="!m-0 p-0">文章总数：</h3>
      <div>
        一共
        <strong>{{ page.length }}</strong> 篇
      </div>
    </div>
    <div>
      <ul>
        <li v-for="(item,index) in page">
          <span>{{index + 1}}、</span>
          <a :href="item.url">{{item.title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from "vue";
import { data as page } from "../../common/autoFormatData.data.mjs";
</script>

<style lang='scss' scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
</style>