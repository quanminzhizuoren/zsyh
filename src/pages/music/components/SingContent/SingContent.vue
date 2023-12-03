<template>
  <div class="tvp" :class="{ 'lyric-unfold': isLyricStyle }">
    <!-- 头部 -->
    <div class="tvp-header"></div>
    <div class="tvp-exhibition">
      <!-- 歌曲封面 -->
      <div class="tvp-cover">
        <div class="tvp-cover-container">
          <img :src="store.coverUri" alt="" />
          <div class="cover_title">
            <div>HAVE A GOOD DAY !</div>
            <span>@{{ new Date().getFullYear() }} KUGOU DESIGN</span>
          </div>
        </div>
      </div>
      <!-- 歌词滚动区域 -->
      <div class="tvp-lyric" @click.stop="lyricClick" @scroll="scroll">
        <Lyric :unfold="isLyricStyle" :style="[isLyricStyle ? {} : { pointerEvents: 'none' }]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { onMounted, onUnmounted, ref } from 'vue'
import Lyric from './Lyric.vue'
const store = useAudioStore()

const isLyricStyle = ref(false)
const lyricClick = () => {
  isLyricStyle.value = !isLyricStyle.value
}
const scroll = () => {
  console.log(store.audio?.currentTime)
}

const setShw = () => {
  isLyricStyle.value = document.body.clientWidth > 992
}
onMounted(() => {
  window.addEventListener('resize', setShw)
  setShw()
})
onUnmounted(() => {
  window.removeEventListener('resize', setShw)
})
</script>

<style lang="less" scoped>
.tvp {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(-20deg, #14e7fa, #8ed3e7, #14e7fa);
  position: absolute;
  top: 0;

  &-header {
    width: 100%;
    height: var(--header-height, 48px);
  }
  &-exhibition {
    width: 100%;
    height: calc(100vh - var(--play-height) - var(--header-height, 48px));
    position: relative;
  }
  &-cover {
    width: 100%;
    height: calc(100% - 70px);
    min-height: 300px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    &-container {
      width: min(60vw, 400px);
      aspect-ratio: 6 / 6.7;
      background-color: #fff;
      margin: 0 auto;
      border-radius: 30px;
      box-sizing: border-box;
      box-shadow: 0 0 0 10px #fff, inset 0 0 10px #00000033;
      padding: 10px;

      img {
        display: block;
        width: 100%;
        aspect-ratio: 1;
        border-radius: 30px;
        // @media screen and(min-width: 800px) {
        //   border-radius: 0;
        // }
      }
      .cover_title {
        margin-top: 3px;
        text-align: center;
        color: #000;
        font-weight: 1000;
        line-height: 1;
        span {
          line-height: 1.5;
          color: #3e3e3e;
          font-size: 0.6em;
        }
      }
    }
  }
  &-lyric {
    width: 100%;
    height: calc(60vh - var(--header-height, 48px));
    height: calc(100vh - var(--play-height) - var(--header-height, 48px));
    height: 100px;
    position: absolute;
    bottom: 0px;
  }
  &-play {
    width: 100%;
    height: 50vh;
    position: absolute;
    bottom: 0;
  }

  // 展开歌词
  .lyric-unfold {
    width: 100%;
    height: 100%;
    top: 0;
    .tvp-lyric {
      width: 100%;
      height: 100%;
    }
  }
}

.lyric-unfold {
  .tvp-cover {
    display: none;
  }
  .tvp-lyric {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
  }
  .lyric-blur();
}
.lyric-blur() {
  &::before {
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    inset: 0;
    background-color: #00000051;
    backdrop-filter: blur(60px);
  }
}

@media (max-width: 767px) {
  .tvp.lyric-unfold {
    .tvp-lyric {
      width: 100%;
      height: 100%;
      top: 0;
    }
    .tvp-cover {
      display: none;
    }
  }
}

@media (min-width: 992px) {
  .tvp {
    .lyric-blur();
    .tvp-header {
      height: calc(var(--header-height) * 2);
    }
    .tvp-lyric {
      height: 100%;
      position: static;
      width: 50%;
    }
    .tvp-cover {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: static;
      .tvp-cover-container {
        border: 0;
        box-shadow: none;
        padding: 0;
        aspect-ratio: 1;

        .cover_title {
          display: none;
        }
      }
    }
    .tvp-exhibition {
      display: flex;
      width: 60vw;
      min-width: 992px;
      margin: 0 auto;
    }
  }
}
</style>
