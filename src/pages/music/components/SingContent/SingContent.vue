<template>
  <div class="tvp" :class="{ 'lyric-unfold': isLyric }">
    <!-- 头部 -->
    <div class="tvp-header"></div>
    <div class="tvp-exhibition">
      <!-- 歌曲封面 -->
      <div class="tvp-cover">
        <div class="tvp-cover-container">
          <img :src="store.coverUri" alt="" />
        </div>
      </div>
      <!-- 歌词滚动区域 -->
      <div class="tvp-lyric" @click.stop="lyricClick">
        <Lyric
          :unfold="isLyric"
          :style="[isLyric || store.widescreen ? {} : { pointerEvents: 'none' }]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { onMounted, onUnmounted, ref } from 'vue'
import Lyric from './Lyric.vue'
const store = useAudioStore()

const isLyric = ref(false)
const lyricClick = () => {
  isLyric.value = !isLyric.value
}
const setShw = () => {
  store.widescreen = document.body.clientWidth > 992
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
  background: #212121;
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
    height: 70%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;

    &-container {
      max-width: 350px;
      height: 100%;
      aspect-ratio: 1;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        display: block;
        width: 100%;
        aspect-ratio: 1;
        border-radius: 30px;
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

    height: 100px;
    height: 8em;
    height: 30%;
    position: absolute;
    bottom: 0px;
    box-sizing: border-box;
    padding: 0 20px;
  }
  &-play {
    width: 100%;
    height: 50vh;
    position: absolute;
    bottom: 0;
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

@media (min-width: 992px) {
  .tvp.lyric-unfold {
    .tvp-lyric {
      position: static;
      width: 40%;
      min-width: 300px;
      font-size: 20px;
      height: 100%;
    }
  }
  .tvp {
    .lyric-blur();
    .tvp-header {
      height: calc(var(--header-height) * 2);
    }
    .tvp-lyric {
      position: static;
      width: 50%;
      min-width: 300px;
      font-size: 20px;
      height: 100%;
      box-sizing: border-box;
      padding: 3em 0;
      height: 70%;
      height: 300px;
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
        img {
          border-radius: 10px;
        }
        .cover_title {
          display: none;
        }
      }
    }
    .tvp-exhibition {
      display: flex;
      align-items: center;
      width: 60vw;
      min-width: 992px;
      margin: 0 auto;
    }
  }
}
</style>
