<template>
  <div class="play">
    <h1 style="text-align: center">{{ store.name }}</h1>
    <!-- 歌词对齐方式按钮 -->
    <div class="lyric-align">
      <div @click.stop="cahngeAlgin">
        <iconLeft v-if="store.style['--lyric-algin'] === 'left'" />
        <iconCenter v-if="store.style['--lyric-algin'] === 'center'" />
        <iconRight v-if="store.style['--lyric-algin'] === 'right'" />
      </div>
    </div>
    <div class="play-control">
      <!-- 进度条 -->
      <div class="sing-progress-bar">
        <div class="sing-progress-bar-time">{{ (progress / 60).toFixed(2).replace('.', ':') }}</div>
        <ProgressBar :max="store.duration" v-model="progress" @input="input" />
        <div class="sing-progress-bar-time">
          {{ (store.duration / 60).toFixed(2).replace('.', ':') }}
        </div>
      </div>
      <div class="play-btn">
        <div></div>
        <div></div>
        <div class="audioplay" @click="click">
          <!-- 等待加载 -->
          <div class="loader" v-if="store.loading"></div>
          <template v-else>
            <!-- 暂停 -->
            <iconPlay v-if="!store.isPlay" />
            <!-- 播放 -->
            <div v-else class="pauseicon">
              <span></span>
              <span></span>
            </div>
          </template>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import iconCenter from '@/components/icons/center.vue'
import iconLeft from '@/components/icons/left.vue'
import iconPlay from '@/components/icons/play.vue'
import iconRight from '@/components/icons/right.vue'
import { useAudioStore } from '@/stores/audio'
import { ref, watch } from 'vue'
import ProgressBar from './ProgressBar.vue'
const emit = defineEmits<{
  (e: 'change', value: number): void
}>()
const props = defineProps<{
  title?: string
}>()
const store = useAudioStore()

/**当前进度 */
const progress = ref(0)

// 设置进度
watch(
  () => store.currentTime,
  (value) => {
    progress.value = value
  }
)

// 滑块进度条改变
const input = (value: number) => {
  if (store.audio) {
    if (value >= store.duration) {
      store.audio.currentTime = 0
      store.audio.pause()
    } else {
      store.audio.currentTime = value
    }
  }
}

// 播放暂停按钮
const click = () => {
  store.audio?.paused ? store.audio?.play() : store.audio?.pause()
}

// 改变歌词对齐方式
const alLi: ('center' | 'left' | 'right')[] = ['center', 'left', 'right']
const cahngeAlgin = () => {
  const index = alLi.findIndex((v) => store.style['--lyric-algin'] === v)
  store.style['--lyric-algin'] = alLi[Math.abs(index) < alLi.length - 1 ? index + 1 : 0]
}
</script>

<style lang="less" scoped>
.play {
  h1 {
    font-style: italic;
  }
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  height: var(--play-height);
  box-sizing: border-box;
  padding: 12px;
  color: #ffffff5b;
  @media (min-width: 768px) {
    height: 200px;
  }
  z-index: 999;
  &-control {
    @media (min-width: 992px) {
      display: flex;
      // grid-template-columns: 1fr 1fr;
      flex-direction: row-reverse;
      align-items: center;
      width: 100%;
    }
  }
  &-btn {
    width: 100%;
    display: flex;
    justify-content: space-evenly;

    box-sizing: border-box;
    padding: 15px 0;
    @media (min-width: 992px) {
      width: 300px;
    }
    .icon {
      width: 1.5em;
      height: 1.5em;
      fill: #00000096;
    }
    /* 播放暂停按钮 */
    .audioplay {
      border-radius: 100px;
      aspect-ratio: 1;
      background: #ffffff5b;
      height: 100%;
      padding: 1em;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        box-sizing: border-box;
      }
      .pauseicon {
        width: 100%;
        height: 100%;
        width: 1.5em;
        height: 1.5em;
        display: flex;
        justify-content: space-between;

        span {
          background: #00000096;
          height: 100%;
          width: 8px;
          border-radius: 3px;
        }
      }
    }
  }
}
.sing-progress-bar {
  @media (min-width: 992px) {
    width: calc(100% - 300px);
  }
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #ffffff5b;
  .progress-bar {
    width: 100%;
  }
  &-time {
    width: 4em;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.lyric-align {
  height: 30px;
  border-radius: 0.3em;
  color: var(--lyric-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .icon {
    fill: var(--lyric-color);
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .icon + .icon {
    margin-left: 0.3em;
  }
}

/* 动画-正在加载 */
.loader {
  width: 1.5em;
  box-sizing: border-box;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #00000096;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}
</style>
