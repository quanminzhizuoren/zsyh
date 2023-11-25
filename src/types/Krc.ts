

export interface Lyric {
  type: number;
  /**歌词内容 */
  content: LyricContent[];
  ext: EXT;
  /**歌曲演唱者 */
  ar: string;
  /**歌名 */
  ti: string;
  by: string;
  al: string;
  offset: number;
}

/**歌词的每一句 */
export interface LyricContent {
  /**开始时间 */
  start: number;
  /**歌词时长 */
  duration: number;
  /**歌词内容 */
  content: LyricItemContent[];
}

/**歌词的每一个词 */
export interface LyricItemContent {
  /**开始时间节点 */
  start: number;
  /**歌词时长 */
  duration: number;
  /**歌词内容 */
  content: string;
}

/**额外信息 */
export interface EXT {
  id: string;
  hash: string;
  sign: string;
  qq: string;
  total: string;
  language: string;
  manualoffset: string;
}

/**歌词多语言信息 */
export interface Language {
  /**歌词多语言列表 */
  content: Content[];
  version: number;
}

/**歌词多语言信息内容 */
export interface Content {
  language: number;
  /**多语言歌词 */
  lyricContent: Array<string[]>;
  type: number;
}
