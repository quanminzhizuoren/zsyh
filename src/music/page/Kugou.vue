<template>
  <div class="player_container">
    <ThemeVariationPlayer />
  </div>
</template>

<script setup lang="ts">
import ThemeVariationPlayer from '../components/ThemeVariationPlayer/ThemeVariationPlayer.vue'
import { useAudioStore } from '../stores/audio'

const store = useAudioStore()
// 歌曲链接
store.url = '/mp3/Do You Believe.mp3'
// 获取歌词
fetch('/json/krc.json')
  .then((res) => res.json())
  .then((res) => {
    store.krc = res
  })
</script>

<style lang="less" scoped>
.player_container {
  width: 100vw;
  height: 100vh;
  --header-height: 48px;
  --lyric-height: 100px;
}
</style>
