<template>
  <div
    v-bind="$attrs"
    class="lyric"
    ref="LyricListRef"
    @wheel="onwheel"
    @touchmove="onwheel"
    @touchend="setScolling(false)"
    @scroll="scroll"
    :style="[
      props.unfold ? {} : { padding: '0 2em' },
      { scrollBehavior: scrollBehavior ? 'smooth' : 'auto' }
      // props.unfold
      // ? {}
      // : store.widescreen
      // ? { '--lyric-algin': 'left' }
      // : { '--lyric-algin': 'center' }
    ]"
  >
    <ul class="lyric-list">
      <div :style="{ height: bodyh + 'px' }">
        <!-- <h1>{{ store.krc?.ar }}</h1> -->
      </div>
      <li
        v-for="(item, index) in list"
        :class="{
          'lyric-itemactiv': index === itemIndex,
          'lyric-itembg': unfold && activIndex === index
        }"
        ref="LyricItemRef"
      >
        <LyricItem
          :data="item"
          :progress="currentTime"
          :paly="!store.isPause"
          :activ="index === itemIndex"
        />
      </li>
      <div :style="{ height: bodyh + 'px' }"></div>
    </ul>
  </div>
  <div class="skip" v-if="unfold" v-show="activIndex !== -1" @click.stop="toPlay()">
    <svg
      t="1700996669223"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="11918"
      width="200"
      height="200"
    >
      <path
        d="M861.829969 330.562413L391.150271 33.456576A214.465233 214.465233 0 0 0 62.30358 214.751187V809.248813a214.465233 214.465233 0 0 0 328.846691 181.294611l470.679698-297.105837a214.751187 214.751187 0 0 0 0-362.875174z"
        fill="#231815"
        p-id="11919"
      ></path>
    </svg>
    <span>{{ (progress / 60).toFixed(2).replace('.', ':') }}</span>
  </div>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import type { LyricContent } from '@/types/Krc'
import { nextTick, onMounted, ref, watch } from 'vue'
import LyricItem from './LyricItem.vue'
const props = defineProps<{ unfold: boolean }>()
const store = useAudioStore()
const LyricListRef = ref<HTMLDivElement>()
const LyricItemRef = ref<HTMLDListElement[]>([])

// 歌词
const list = ref<LyricContent[]>([])

/**当前播放歌词下标 */
const itemIndex = ref(-1)

// 开启滚动动画
const scrollBehavior = ref(true)

// 设置滚动歌词距离
const onscroll = () => {
  const item = LyricItemRef.value
  if (!item.length) return
  if (store.currentTime === 0) {
    itemIndex.value = 0
    if (LyricListRef.value) {
      LyricListRef.value.scrollTop = 0
    }
    return
  }
  const progressTime = store.currentTime * 1000
  const endList = list.value.filter((v, index, li) => {
    if (index + 1 < li.length) {
      const item = li[index + 1]
      const num = item.start + item.duration - v.start
      // 开始下一句前滚动到下一句歌词
      return v.start - num * 0.1 < progressTime
    }
    return v.start < progressTime + (index + 1 < li.length ? 220 : 0) //增加当前进度值使歌词提前滚动到下一句
  })
  const activindex = endList.length - 1
  if (itemIndex.value === activindex) return
  // 歌词跳转大于3句时关闭滚动动画直接跳转
  if (Math.abs(activindex - itemIndex.value) > 3) {
    itemIndex.value = activindex
    const itemEl = LyricItemRef.value[itemIndex.value]
    if (LyricListRef.value && itemEl) {
      const h = LyricListRef.value?.clientHeight / 2 - itemEl.clientHeight / 2
      // const st = LyricListRef.value.scrollTop
      scrollBehavior.value = false
      LyricListRef.value.scrollTop = itemEl.offsetTop - (props.unfold ? h : itemEl.clientHeight / 2)
      nextTick(() => {
        scrollBehavior.value = true
      })
    }

    return
  }
  itemIndex.value = activindex

  if (isScolling) return
  ontransition()
}

/**滚动到当前播放进度歌词位置 */
const ontransition = (animation: boolean = true) => {
  activIndex.value = -1
  scrollBehavior.value = animation
  const itemEl = LyricItemRef.value[itemIndex.value]
  nextTick(() => {
    if (LyricListRef.value && itemEl) {
      const h = props.unfold ? LyricListRef.value?.clientHeight / 2 - itemEl.clientHeight / 2 : 0
      LyricListRef.value.scrollTop = itemEl.offsetTop - h
    }
    scrollBehavior.value = true
  })
}

watch(
  () => props.unfold,
  () => ontransition(false)
)

//监听播放 滚动歌词
watch(
  () => store.currentTime,
  (value) => {
    currentTime.value = value
    onscroll()
  }
)

const currentTime = ref(0)

/**获取歌词json */
const changeKrc = () => {
  if (!store.krc) return
  list.value = store.krc.content || []
}
watch(() => store.krc, changeKrc)
onMounted(changeKrc)
onMounted(onscroll)

// 是否手动滑动歌词列表
let isScolling = false

let t: number
// 滚轮事件
const onwheel = () => {
  setScolling(true)
  clearTimeout(t)
  t = setTimeout(() => {
    clearTimeout(t)
    setScolling(false)
  }, 1000)
}

const setScolling = (value: boolean) => {
  if (!value) {
    setTimeout(() => {
      isScolling = false
      ontransition()
    }, 1000)
  } else {
    isScolling = value
  }
}

// 获取列表高度
const bodyh = ref(0)
onMounted(() => {
  nextTick(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      bodyh.value = entries[0].contentRect.height / 2
      nextTick(() => {
        ontransition(false)
        activIndex.value = -1
      })
    })
    LyricListRef.value && resizeObserver.observe(LyricListRef.value)
  })
})

const progress = ref(0)

// 点击跳转进度
const toPlay = () => {
  activIndex.value = -1
  if (LyricListRef.value) {
    if (store.audio) {
      store.audio.currentTime = progress.value
      isScolling = false
      onscroll()
    }
  }
}

// 所要跳转的进度
const activIndex = ref(-1)
// 滚动时获取对应位置歌词的时间进度
const scroll = (e: any) => {
  if (!isScolling || !LyricListRef.value) return
  const scrollTop = LyricListRef.value.scrollTop
  const file = LyricItemRef.value.filter((el) => el.offsetTop - scrollTop <= bodyh.value)
  activIndex.value = Math.max(file.length - 1, 0)
  const item = list.value[activIndex.value]
  if (item) progress.value = (item.start + 10) / 1000
}
</script>

<style lang="less" scoped>
.lyric {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  scrollbar-width: none;
  text-align: var(--lyric-algin);
  box-sizing: border-box;
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
      height: 3em;
      line-height: 3em;
      // box-sizing: border-box;
      padding: 0 10px;
      overflow-x: auto;
      transition: font-size 200ms;
      opacity: 0.5;
      padding: 10px 0;
    }
    .lyric-itemactiv {
      font-size: 1.5em;
      opacity: 1;
    }
    .lyric-itembg {
      opacity: 1;
      font-size: 1.5em;
    }
  }
}
.skip {
  font-size: 0.7em;
  padding: 0.3em 0.5em;
  border-radius: 0.5em;
  top: 50%;
  right: 3px;
  transform: translateY(-50%);
  position: absolute;
  background-color: #fff;
  background-color: var(--lyric-color);
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon {
    width: 1em;
    height: 1em;
    margin-right: 0.3em;
  }
}
</style>
