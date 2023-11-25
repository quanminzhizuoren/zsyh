<template>
  <div class="tvp">
    <!-- 头部 -->
    <div class="tvp-header"></div>
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
    <div class="tvp-lyric" :class="{ 'lyric-unfold': isLyricStyle }" @click.stop="lyricClick">
      <Lyric :unfold="isLyricStyle" />
    </div>
    <!-- 播放控制按钮 -->
    <div class="tvp-play"></div>
  </div>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { ref } from 'vue'
import Lyric from './Lyric.vue'
const store = useAudioStore()

const isLyricStyle = ref(true)
const lyricClick = () => {
  store.isPause ? store.audio?.play() : store.audio?.pause()
  // isLyricStyle.value = !isLyricStyle.value
}
</script>

<style lang="less" scoped>
.tvp {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(-20deg, #14e7fa, #8ed3e7, #14e7fa);
  position: relative;
  &-header {
    width: 100%;
    height: var(--header-height, 48px);
  }
  &-cover {
    width: 100%;
    height: calc(50vh - var(--header-height, 48px));
    height: 50vh;
    position: absolute;
    top: var(--header-height, 48px);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    // padding: 30px 0;
    &-container {
      // width: 70%;
      height: 70%;
      aspect-ratio: 6 / 6.7;
      background-color: #fff;
      margin: 0 auto;
      border-radius: 30px;
      box-sizing: border-box;
      box-shadow: 0 0 0 10px #fff, inset 0 0 10px #00000033;
      padding: 10px;

      @media screen and(min-width: 800px) {
        border-radius: 0;
        box-shadow: none;
      }
      img {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 30px;
        @media screen and(min-width: 800px) {
          border-radius: 0;
        }
      }
      .cover_title {
        margin-top: 3px;
        text-align: center;
        // font-size: 30px;
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
    height: var(--lyric-height);
    position: absolute;
    top: 50%;
    // transform: translateY(-50%);
    z-index: 1;
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
    background-color: #00000056;
    backdrop-filter: blur(60px);
  }
}
</style>
