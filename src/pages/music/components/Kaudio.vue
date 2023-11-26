<template>
  <audio ref="audioRef" :src="store.url" controls preload="auto"></audio>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { onMounted, ref } from 'vue'

const store = useAudioStore()

const audioRef = ref<HTMLAudioElement>()

onMounted(() => {
  if (!audioRef.value) return
  const audio = audioRef.value
  audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100
    store.progress = progress
    store.currentTime = audio.currentTime
    store.duration = audio.duration
  })

  audio.addEventListener('play', () => {
    store.isPause = false
    store.isPlay = true
  })
  audio.addEventListener('pause', () => {
    store.isPause = true
  })

  audio.addEventListener('ended', () => {
    store.isPlay = false
    audio.play()
  })

  store.audio = audio
})
</script>

<style>
audio {
  display: none;
}
</style>
