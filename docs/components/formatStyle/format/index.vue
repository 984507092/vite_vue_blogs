<template>
  <div>
    <ul>
      <li v-for="(item,index) in data" :key="index">
        <span class="c-red">{{item.attr}}</span>：
        <span>{{item.text}}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps } from "vue";
let props = defineProps({
  data: {
    type: Array,
    default: () => {
      return [];
    }
  }
});
</script>

<style lang='scss' scoped>
</style>