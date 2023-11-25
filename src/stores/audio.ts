
import type { Lyric } from '@/types/Krc'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAudioStore = defineStore('audio', () => {
  const audio = ref<HTMLAudioElement>()


  /**歌曲名称 */
  const name = ref('')
  /**歌曲链接 */
  const url = ref('')

  /**播放进度 */
  const progress = ref(0)
  const currentTime = ref(0)
  const duration = ref(0)
  /**歌曲封面图片 */

  const coverUri = ref('https://imgessl.kugou.com/stdmusic/20200909/20200909133336958965.jpg')


  /**歌词信息 */

  const krc = ref<Lyric | null>(null)

  /**是否暂停 */
  const isPause = ref(true)
  /**是否播放 */
  const isPlay = ref(false)


  return {
    name,
    krc,
    isPlay,
    isPause,
    coverUri,
    audio,
    url,
    progress,
    currentTime,
    duration
  }
})
