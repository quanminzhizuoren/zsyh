<template>
  <div class="player_container" :style="store.style">
    <SingContent />
    <PlayControl />
    <Kaudio />
  </div>
</template>

<script setup lang="ts">
import { useAudioStore } from '../../stores/audio'
import Kaudio from './components/Kaudio.vue'
import PlayControl from './components/PlayControl/PlayControl.vue'
import SingContent from './components/SingContent/SingContent.vue'
const store = useAudioStore()
// 歌曲链接
store.url = '/mp3/Do You Believe.mp3'
// 获取歌词
fetch('/json/krc.json')
  .then((res) => res.json())
  .then((res) => {
    store.krc = res
    store.name = res.ar
  })
</script>

<style lang="less" scoped>
.player_container {
  width: 100vw;
  height: 100vh;
  --header-height: 48px;
  --lyric-height: 100px;
  --play-height: min(40vh, 300px);
  --bg-color: #212121;
  --lyric-activ-color: #fff;
  --lyric-color: #ffffff4a;
  position: relative;
}
.paly {
  width: 100%;
  height: 40vh;
}
</style>
