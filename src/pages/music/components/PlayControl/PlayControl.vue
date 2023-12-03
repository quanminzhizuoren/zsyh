<template>
  <div class="play">
    <h1>{{ store.name }}</h1>

    <div></div>
    <div></div>
    <div class="play-btn">
      <div></div>
      <div></div>
      <div class="audioplay" @click="click">
        <svg
          t="1700996669223"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="11918"
          width="200"
          height="200"
          v-if="pause"
        >
          <path
            d="M861.829969 330.562413L391.150271 33.456576A214.465233 214.465233 0 0 0 62.30358 214.751187V809.248813a214.465233 214.465233 0 0 0 328.846691 181.294611l470.679698-297.105837a214.751187 214.751187 0 0 0 0-362.875174z"
            p-id="11919"
          ></path>
        </svg>
        <div v-else class="pauseicon">
          <span></span>
          <span></span>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAudioStore } from '@/stores/audio'
import { computed } from 'vue'
const emit = defineEmits<{
  (e: 'change', value: number): void
}>()
const props = defineProps<{
  title?: string
}>()
const store = useAudioStore()

const pause = computed(() => store.isPause)
const click = () => {
  store.audio?.paused ? store.audio?.play() : store.audio?.pause()
}
</script>

<style lang="less" scoped>
.play {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: var(--play-height);
  box-sizing: border-box;
  padding: 12px;
  @media (min-width: 768px) {
    height: 200px;
  }
  z-index: 999;

  &-btn {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    padding: 15px 0;
    .icon {
      width: 1.5em;
      height: 1.5em;
      fill: #00000096;
    }
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
        padding-left: 3px;
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
</style>
