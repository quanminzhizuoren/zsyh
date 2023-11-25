<template>
  <div class="lyric" ref="LyricListRef">
    <ul class="lyric-list">
      <div style="height: 50vh">
        <!-- <h1>{{ store.krc?.ar }}</h1> -->
      </div>
      <li
        v-for="(item, index) in list"
        :class="{ 'lyric-itemactiv': index === itemIndex }"
        @click="toPlay(index)"
        ref="LyricItemRef"
      >
        <LyricItem
          :data="item"
          :progress="currentTime"
          :paly="!store.isPause"
          :activ="index === itemIndex"
        />
      </li>
      <div style="height: 50vh"></div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import type { LyricContent } from '@/types/Krc'
import { transitionNumber } from '@/utils/transition'
import { onMounted, ref, watch } from 'vue'

import LyricItem from './LyricItem.vue'
const props = defineProps<{ unfold: boolean }>()
const store = useAudioStore()
const LyricListRef = ref<HTMLDivElement>()
const LyricItemRef = ref<HTMLDListElement[]>([])

// 歌词
const list = ref<LyricContent[]>([])

/**当前播放歌词下标 */
const itemIndex = ref(-1)

// 设置滚动歌词距离
const onscroll = () => {
  const item = LyricItemRef.value
  if (!item.length) return
  const progressTime = store.currentTime * 1000
  const endList = list.value.filter((v) => v.start < progressTime)
  if (itemIndex.value === endList.length - 1) return
  itemIndex.value = endList.length - 1
  const itemEl = LyricItemRef.value[itemIndex.value]
  if (LyricListRef.value && itemEl) {
    const h = LyricListRef.value?.clientHeight / 2 - itemEl.clientHeight / 2
    const st = LyricListRef.value.scrollTop
    transitionNumber(st, itemEl.offsetTop - h, (to) => {
      if (LyricListRef.value) {
        LyricListRef.value.scrollTop = to
      }
    }).start()
  }
}

//监听播放 滚动歌词
watch(
  () => store.currentTime,
  (value) => {
    currentTime.value = value
    onscroll()
  }
)

//监听播放展开 滚动歌词
// watch(
//   () => props.unfold,
//   () => {
//     console.log('[ props.unfold ]-63', props.unfold)
//     onscroll()
//   }
// )

const currentTime = ref(0)

const changeKrc = () => {
  if (!store.krc) return
  list.value = store.krc.content || []
}
onMounted(changeKrc)
onMounted(onscroll)
watch(() => store.krc, changeKrc)

// 点击歌词跳转进度
const toPlay = (index: number) => {
  if (props.unfold && store.audio) {
    const { start } = list.value[index]
    const num = start + 1
    store.audio.currentTime = num / 1000
    onscroll()
  }
}
</script>

<style lang="less" scoped>
.lyric {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
  &-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    min-height: 100%;
    overflow: hidden;
    height: auto;
    li {
      width: 100%;
      min-height: 3em;
      line-height: 3em;
      box-sizing: border-box;
      padding: 0 10px;
      overflow-x: auto;
      transition: font-size 200ms;
    }
    .lyric-itemactiv {
      font-size: 1.7em;
    }
  }
}
</style>
