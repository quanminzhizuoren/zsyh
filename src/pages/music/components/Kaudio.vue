<template>
  <audio ref="audioRef" :src="store.url" preload="auto" autoplay></audio>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { onMounted, onUnmounted, ref } from 'vue'
import { useAudioEventListener } from '../hooks/useAudioEventListener'
const store = useAudioStore()

const audioRef = ref<HTMLAudioElement>()

const audioEvent = useAudioEventListener(audioRef, store)
onMounted(() => {
  if (!audioRef.value) return
  const audio = audioRef.value
  audioEvent.addEventListener()
  store.audio = audio
})
onUnmounted(() => {
  audioEvent.removeEventListener()
})
</script>
