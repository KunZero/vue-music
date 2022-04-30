<template>
  <div class="singer-detail">
    <musiclistcopy
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></musiclistcopy>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import musiclistcopy from '@/components/music-list/music-list-copy'
import { processSongs } from '@/service/song'

export default {
  name: 'test',
  components: { musiclistcopy },
  data() {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    computedData() {
      let ret = null
      ret = {
        id: 13948,
        mid: '001fNHEf1SFEFN',
        name: 'G.E.M. 邓紫棋',
        pic: 'http://y.gtimg.cn/music/photo_new/T001R800x800M000001fNHEf1SFEFN.jpg'
      }
      return ret
    },
    pic() {
      const data = this.computedData
      return data && data.pic
    },
    title() {
      const data = this.computedData
      return data && (data.name || data.title)
    }
  },
  async created() {
    const data = this.computedData
    if (!data) {
      const path = this.$route.matched[0].path
      this.$router.push({
        path
      })
      return
    }
    const result = await getSingerDetail(data)
    this.songs = await processSongs(result.songs)
    this.loading = false
  }

}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
