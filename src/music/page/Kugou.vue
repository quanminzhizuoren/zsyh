<template>
  <div class="player_container">
    <ThemeVariationPlayer />
  </div>
</template>

<script setup lang="ts">
import ThemeVariationPlayer from '../components/ThemeVariationPlayer/ThemeVariationPlayer.vue'
import { useAudioStore } from '../stores/audio'

import krcLsit from '../assets/krc.json'

const store = useAudioStore()
store.url =
  'https://webfs.hw.kugou.com/202311231258/194fb4401afbff428840736e3f5dd737/v2/557417eb11500cf68286adcbf7a05c2c/G365/M02/AF/E7/TZUEAGVG6oGANImrADLgrhDjU8o037.mp3'

store.krc = krcLsit
</script>

<style lang="less" scoped>
.player_container {
  width: 100vw;
  height: 100vh;
  --header-height: 48px;
  --lyric-height: 100px;
}
</style>
