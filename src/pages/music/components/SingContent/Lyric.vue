<template>
  <div
    v-bind="$attrs"
    class="lyric"
    ref="LyricListRef"
    @wheel="onwheel"
    @touchmove="onwheel"
    @touchend="setScolling(false)"
    @scroll="scroll"
  >
    <ul class="lyric-list" :style="{ textAlign: props.unfold ? lyricalign : 'center' }">
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
  <div class="lyric-align" @click.stop="cahngeAlgin" v-if="props.unfold">
    <iconLeft v-if="lyricalign === 'left'" />
    <iconCenter v-if="lyricalign === 'center'" />
    <iconRight v-if="lyricalign === 'right'" />
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
import iconCenter from '@/components/icons/center.vue'
import iconLeft from '@/components/icons/left.vue'
import iconRight from '@/components/icons/right.vue'
import { useAudioStore } from '@/stores/audio'
import type { LyricContent } from '@/types/Krc'
import { transitionNumber } from '@/utils/transition'
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
const alLi: ('center' | 'left' | 'right')[] = ['center', 'left', 'right']
const lyricalign = ref<'center' | 'left' | 'right'>('center')
const cahngeAlgin = () => {
  const index = alLi.findIndex((v) => lyricalign.value === v)
  lyricalign.value = alLi[Math.abs(index) < alLi.length - 1 ? index + 1 : 0]
}

// 设置滚动歌词距离
const onscroll = () => {
  const item = LyricItemRef.value
  if (!item.length) return
  const progressTime = store.currentTime * 1000
  const endList = list.value.filter((v, index, li) => {
    if (index + 1 < li.length) {
      const item = li[index + 1]
      const num = item.start + item.duration - v.start
      // 开始下一句前滚动到下一句歌词
      return v.start - num * 0.1 < progressTime
    }
    return v.start < progressTime + (index + 1 < li.length ? 220 : 0)
  })
  if (itemIndex.value === endList.length - 1) return
  itemIndex.value = endList.length - 1
  if (isScolling) return
  ontransition()
}

const ontransition = () => {
  activIndex.value = -1
  const itemEl = LyricItemRef.value[itemIndex.value]
  if (LyricListRef.value && itemEl) {
    const h = LyricListRef.value?.clientHeight / 2 - itemEl.clientHeight / 2
    const st = LyricListRef.value.scrollTop
    transitionNumber(
      st,
      itemEl.offsetTop - (props.unfold ? h : itemEl.clientHeight / 2),
      (to, _, { stop }) => {
        isScolling && stop()
        if (LyricListRef.value) {
          LyricListRef.value.scrollTop = to
        }
      }
    ).start()
  }
}

watch(() => props.unfold, onscroll)

//监听播放 滚动歌词
watch(
  () => store.currentTime,
  (value) => {
    currentTime.value = value
    onscroll()
  }
)

const currentTime = ref(0)

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
const onwheel = (e: TouchEvent | WheelEvent) => {
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
        const itemEl = LyricItemRef.value[itemIndex.value]
        if (LyricListRef.value && itemEl) {
          const h = props.unfold
            ? LyricListRef.value?.clientHeight / 2 - itemEl.clientHeight / 2
            : 0
          LyricListRef.value.scrollTop = itemEl.offsetTop - h

          activIndex.value = -1
        }
      })
    })
    LyricListRef.value && resizeObserver.observe(LyricListRef.value)
  })
})

const progress = ref(0)

// 点击跳转进度
const toPlay = () => {
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
      min-height: 1em;
      line-height: 2em;
      box-sizing: border-box;
      padding: 0 10px;
      overflow-x: auto;
      transition: font-size 200ms;
      opacity: 0.5;
      padding: 10px 0;
    }
    .lyric-itemactiv {
      font-size: 1.7em;
      opacity: 1;
    }
    .lyric-itembg {
      opacity: 1;
      font-size: 1.7em;
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
.lyric-align {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 0.3em;
  background-color: var(--bg-color);
  color: var(--lyric-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.3em;
  .icon {
    fill: var(--lyric-color);
    width: 0.7em;
    height: 0.7em;
  }
  .icon + .icon {
    margin-left: 0.3em;
  }
}
</style>
