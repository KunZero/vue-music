import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    // 重置初始化，避免切歌导致歌词播放异常
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0

    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {
      // 解构赋值传参，key-value一致时可以简写为value的变量名
      song: newSong,
      lyric
    })
    // 因为getLyric是一个异步操作，假如异步操作过程中切歌导致currentSong发生变化，则直接return； 由currentSong触发的getLyric进行操作
    if (currentSong.value.lyric !== lyric) {
      // 可以快速切换歌曲暴力触发debugger
      // debugger
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric)
    console.log('currentLyric.value ', currentLyric.value)
    window.currentLyric = currentLyric.value
    // 当只有时间[00:00.00] 纯音乐无歌词提醒时，这里的lines返回是0
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        // 当songReady，但是currentLyricVal不满足，会等待这一异步getLyric操作满足才触发playLyric（异步操作二） （两个异步操作当songReady和getLyric）
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  function playLyric() {
    const currentLyricVal = currentLyric.value
    // 即使songReady，也得满足currentLyricVal存在才触发
    if (currentLyricVal) {
      // currentLyricVal 依据 当前时间播放
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      // time是滚动一次所需时间，1秒会自然很多，过快会突兀，过慢会跟不上歌词播放速度
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric
  }
}
