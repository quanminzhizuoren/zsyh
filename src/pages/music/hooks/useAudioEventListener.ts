
import { useAudioStore } from '@/stores/audio';
import type { Ref } from 'vue';

/**
 * Audio标签添加监听
 * @param el Audio元素
 * @param store 
 * @returns 
 */
export const useAudioEventListener = (el: Ref<HTMLAudioElement | undefined>, store: ReturnType<typeof useAudioStore>) => {

  let t = 0
  const load = () => {
    if (!el.value) return
    const audio = el.value
    const timeRanges = audio.buffered
    const timeBuffered = timeRanges.end(timeRanges.length - 1)
    const bufferPercent = timeBuffered / audio.duration // 获取缓存进度，值为0到1
    store.loadprogress = bufferPercent
  }
  const canplay = () => {
    if (store.loadprogress === 1) return
    clearTimeout(t)
    store.loading = false
    load()
  }
  const waiting = () => {
    if (store.loadprogress === 1) return
    store.loading = true
    console.log('[ store.loading ]-31', store.loading)
    t = setTimeout(() => {
      store.loading = true
    }, 100)
    load()
  }
  const loadedmetadata = () => {
    store.loading = false
  }

  const loadeddata = () => {
    if (!el.value) return
    const audio = el.value
    store.currentTime = audio.currentTime
    store.duration = audio.duration
  }
  const timeupdate = () => {
    if (!el.value) return
    const audio = el.value
    const progress = (audio.currentTime / audio.duration) * 100
    store.progress = progress
    store.currentTime = audio.currentTime
    store.duration = audio.duration
    store.loading = false
  }
  const play = () => {
    store.isPause = false
    store.isPlay = true
    store.loading = false
  }
  const pause = () => {
    store.isPlay = false

  }
  const ended = () => {
    store.isPlay = false

  }




  return {
    addEventListener() {
      if (!el.value) return
      const audio = el.value
      // 音频加载至当前播放进度继续播放时
      audio.addEventListener('canplay', canplay)
      // 因网络问题，加载音频时，音频会先播放几秒，然后暂停，音频加载完成后再继续播放，
      audio.addEventListener('waiting', waiting)
      // 元数据加载完成
      audio.addEventListener('loadedmetadata', loadedmetadata)

      // 媒体的第一帧加载完成。获取音频信息
      audio.addEventListener('loadeddata', loadeddata)

      // 监听进度改变
      audio.addEventListener('timeupdate', timeupdate)

      // 播放
      audio.addEventListener('play', play)
      // 暂停
      audio.addEventListener('pause', pause)

      // 播放结束
      audio.addEventListener('ended', ended)
    },
    removeEventListener() {
      if (!el.value) return
      const audio = el.value
      // 音频加载至当前播放进度继续播放时
      audio.removeEventListener('canplay', canplay)
      // 因网络问题，加载音频时，音频会先播放几秒，然后暂停，音频加载完成后再继续播放，
      audio.removeEventListener('waiting', waiting)
      // 元数据加载完成
      audio.removeEventListener('loadedmetadata', loadedmetadata)

      // 媒体的第一帧加载完成。获取音频信息
      audio.removeEventListener('loadeddata', loadeddata)

      // 监听进度改变
      audio.removeEventListener('timeupdate', timeupdate)

      // 播放
      audio.removeEventListener('play', play)
      // 暂停
      audio.removeEventListener('pause', play)

      // 播放结束
      audio.removeEventListener('ended', ended)
    }
  }
}

