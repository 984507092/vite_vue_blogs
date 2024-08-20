<template>
  <div class="wrapper">
    <div class="flex flex-items-center justify-between">
      <h3 class="!m-0 p-0">杂谈系列文章：</h3>
      <div>
        一共
        <strong>{{ page.length }}</strong> 篇
      </div>
    </div>
    <div>
      <div class="mt-5 mb-5 w-180 ml-5">
        <n-input-group>
          <n-input v-model:value="formValue.title" @input="handleInputSearch" placeholder="输入标题"
            :style="{ width: '85%' }" />
          <n-button type="primary" @click="handleFormSearch" ghost>搜索</n-button>
        </n-input-group>
      </div>
      <ul>
        <li class="flex flex-items-center justify-between" v-for="(item, index) in listData" :key="index">
          <div class="flex flex-items-center">
            <span>{{ index + 1 }}、</span>
            <a target="_blank" :href="item.link">{{ item.title }}</a>
          </div>
          <span class="time-str c-#999">{{ item.date }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang='ts'>
import _ from 'lodash'
import { ref, reactive, onMounted, defineProps, withDefaults, inject } from 'vue'
import { data as page } from '../../common/autoFormatData.data.mjs'

// props 方式
// const props = withDefaults(defineProps<{
//   vueList?: Array<any>,
//   tsList?: Array<any>,
// }>(), {
//   vueList: [],
//   tsList: [],
// })

// inject 方式 需要在 onMounted 接受
let vueList = inject('vueList')
let tsList = inject('tsList')



let listData = ref([])
let formValue = reactive({
  title: ''
})

const handleFormSearch = () => {
  listData.value = page.filter(item =>
    item.title.toLocaleLowerCase().includes(formValue.title.toLocaleLowerCase())
  )
}

const handleInputSearch = _.debounce(() => {
  handleFormSearch()
}, 200)

onMounted(() => {
  listData.value = page
})
</script>

<style lang='scss' scoped>
.wrapper {
  width: 100%;
  height: 100%;
}
</style>