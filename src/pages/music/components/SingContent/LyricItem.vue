<template>
  <div class="lyriclist" ref="lyriclistRef">
    <div class="lyriclist-container" :style="activ ? {} : { overflowX: 'hidden' }">
      <span v-for="(item, index) in list" class="lyricitem" ref="lyricitemRef"
        ><span
          class="lyricitem-content"
          :class="{
            'lyric-activ': activ && (activIndex === list.length || activIndex > index)
          }"
          >{{ item.content }}</span
        ><span
          v-if="activ"
          class="lyricitem-activ"
          :style="{
            'animation-duration': `${item.duration}ms`,
            'animation-play-state': !paly ? 'paused' : activIndex == index ? 'running' : 'paused'
          }"
          :data-animation="activIndex > index - 1 || activIndex === list.length ? 'true' : 'false'"
          >{{ item.content }}</span
        ></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LyricContent, LyricItemContent } from '@/types/Krc'
import { transitionNumber } from '@/utils/transition'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  data: LyricContent
  /**进度时间 */
  progress: number
  /**是否播放 */
  paly: boolean
  /**是否歌词进度滚动 */
  activ: boolean
}>()
// 歌词列表
const list = ref<LyricItemContent[]>([])
/**当前词进度 */
const activIndex = ref(-1)
watch(
  () => props.activ,
  () => {
    activIndex.value = -1
  }
)

// 监听进度 设置当前所唱的词下标
watch(
  () => props.progress,
  (progress) => {
    const { start, duration } = props.data
    const dataStart = start / 1000
    const dataDuration = duration / 1000
    if (progress < dataStart || progress > dataDuration + dataStart) {
      return
    }
    const newProgress = progress - dataStart
    // 已完成的歌词
    const item = list.value.filter((v) => {
      const num = v.start / 1000
      return num - num * 0.1 < newProgress
    })
    // 最新词位置
    activIndex.value = item.length - 1
  }
)

const lyriclistRef = ref<HTMLDivElement>()
const lyricitemRef = ref<HTMLSpanElement[]>([])
let intransition: any = null
// 使溢出的歌词横向滚动显示
watch(
  () => activIndex.value,
  () => {
    const el = lyricitemRef.value[activIndex.value]
    if (lyriclistRef.value && el) {
      const w = lyriclistRef.value.clientWidth * 0.8
      const left = el.offsetLeft + el.offsetWidth * 2
      intransition && intransition.stop() // 停止之前的动画
      const form = lyriclistRef.value.scrollLeft
      if (left > w) {
        intransition = transitionNumber(
          form,
          left - w,
          (t) => {
            if (lyriclistRef.value) lyriclistRef.value.scrollLeft = t
          },
          600
        )
        intransition.start()
      }
    }
  }
)

/**获取歌词信息 */
const setData = () => {
  if (!props.data.content.length) return
  const data = props.data.content || []
  list.value = data.map((v, index, list) => {
    if (v.content === ' ' && list[index - 1]?.content !== ' ') {
      return { ...v, start: v.start + v.duration, duration: 0 }
    }
    const data = list[index + 1]
    if (data && data.content === ' ') {
      return { ...v, duration: v.duration + data.duration }
    }
    return v
  })
}
watch(() => props.data, setData)
onMounted(setData)
</script>
<style lang="less" scoped>
.lyriclist {
  width: 100%;
  overflow-x: auto;
  // text-align: center;
  display: flex;
  justify-content: center;
  flex: 1 1 auto;
  flex-wrap: nowrap;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  &-container {
    min-width: 100%;
    white-space: nowrap;
    // text-align: center;
    align-items: flex-start;
    width: fit-content;
  }
}
.lyricitem {
  position: relative;
  width: fit-content;
  &-content {
    color: var(--lyric-color);
    overflow: hidden;
  }
  .lyric-activ {
    color: var(--lyric-activ-color, #fff);
    text-align: left;
  }
  &-activ {
    position: absolute;
    left: 0;
    color: var(--lyric-activ-color, #fff);
    width: 0%;
    overflow: hidden;
    animation-name: lyricactiv;
    animation-fill-mode: forwards;
    animation-timing-function: ease-out;
    text-align: left;
  }
  .lyricitem-activ[data-animation='false'] {
    animation: none;
  }
  .animation-none {
    animation: none;
    position: absolute;
    left: 0;
    color: var(--lyric-activ-color, #fff);
    width: 100%;
    overflow: hidden;
  }
}
@keyframes lyricactiv {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
