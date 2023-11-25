<script setup lang="ts">
import { RouterView } from 'vue-router'
import Kaudio from './components/Kaudio.vue'
</script>

<template>
  <RouterView />
  <Kaudio />
</template>
<style lang="less">
#app,
body {
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  width: 0; /* 滚动条宽度 */
  height: 0; /* 滚动条高度 */
}

* {
  scrollbar-width: none; /* 隐藏滚动条 */
}

@media screen and (device-type: tablet) {
  /* 平板设备的样式 */

  ::-webkit-scrollbar {
    width: auto; /* 滚动条宽度 */
    height: auto; /* 滚动条高度 */
  }

  * {
    scrollbar-width: auto; /* 隐藏滚动条 */
  }
}

@media screen and (device-type: phone) {
  /* 手机设备的样式 */

  ::-webkit-scrollbar {
    width: auto; /* 滚动条宽度 */
    height: auto; /* 滚动条高度 */
  }

  * {
    scrollbar-width: auto; /* 隐藏滚动条 */
  }
}
</style>
