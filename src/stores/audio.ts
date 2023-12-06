
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
  /**当前播放进度时间 */
  const currentTime = ref(0)
  /**总长度 */
  const duration = ref(0)

  /**歌曲封面图片 */
  const coverUri = ref('https://imgessl.kugou.com/stdmusic/20200909/20200909133336958965.jpg')


  /**歌词信息 */
  const krc = ref<Lyric | null>(null)

  /**是否暂停 */
  const isPause = ref(true)
  /**是否播放 */
  const isPlay = ref(false)
  /**暂停加载 */
  const loading = ref(false)
  /**缓存进度 */
  const loadprogress = ref(0)

  /**样式变量 */
  const style = ref({
    /**歌词对齐方式 */
    '--lyric-algin': 'center',
  })

  /**是否宽屏幕 */
  const widescreen = ref(false)
  return {
    name,
    krc,
    isPlay,
    isPause,
    coverUri,
    audio,
    loading,
    loadprogress,
    style,
    widescreen,
    url,
    progress,
    currentTime,
    duration
  }
})
