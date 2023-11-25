<template>
  <div class="lyriclist" ref="lyriclistRef">
    <div class="lyriclist-container">
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
import { onMounted, ref, watch } from 'vue'
import type { LyricContent, LyricItemContent } from '../../types/Krc'
import { transitionNumber } from '../../utils/transition'

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
    const item = list.value.filter((v) => v.start / 1000 < newProgress)
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

// 不处于歌词滚动时 设置原来初始的横向滚动位置0
watch(
  () => props.activ,
  () => {
    if (lyriclistRef.value) lyriclistRef.value.scrollLeft = 0
  }
)

/**获取歌词信息 */
const setData = () => {
  if (!props.data.content.length) return
  list.value = props.data.content
}
watch(() => props.data, setData)
onMounted(setData)
</script>
<style lang="less" scoped>
.lyriclist {
  width: 100%;
  overflow-x: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  flex: 1 1 auto;
  flex-wrap: nowrap;
  &-container {
    min-width: 100%;
    // display: flex;
    // justify-content: center;
    white-space: nowrap;
    text-align: center;
    align-items: flex-start;
    width: fit-content;
  }
}
.lyricitem {
  position: relative;
  width: fit-content;
  &-content {
    color: #ffffffaa;
    overflow: hidden;
  }
  .lyric-activ {
    color: black;
    text-align: left;
  }
  &-activ {
    position: absolute;
    left: 0;
    color: black;
    width: 0%;
    overflow: hidden;
    animation-name: lyricactiv;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.21, 0.58, 0.66, 0.97);
    text-align: left;
  }
  .lyricitem-activ[data-animation='false'] {
    animation: none;
  }
  .animation-none {
    animation: none;
    position: absolute;
    left: 0;
    color: black;
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
