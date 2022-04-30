<template>
  <div class="singer" v-loading="!singers.length">
    <index-list
      :data="singers"
      @select="selectSinger"
    ></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
  import { getSingerList } from '@/service/singer'
  import IndexList from '@/components/index-list/index-list-copy'
  import storage from 'good-storage'
  import { SINGER_KEY } from '@/assets/js/constant'

  export default {
    name: 'demo',
    components: {
      IndexList
    },
    data() {
      return {
        singers: [],
        selectedSinger: null
      }
    },
    async created() {
      // console.log('selectedSinger: ', this.selectedSinger)
      const result = await getSingerList()
      this.singers = result.singers
    },
    methods: {
      selectSinger(singer) {
        this.selectedSinger = singer

        this.cacheSinger(singer)
        // console.log('singer.mid: ', singer.mid)
        // console.log('selectedSinger: ', this.selectedSinger)
        this.$router.push({
          path: `/singer/${singer.mid}`
        })
      },
      cacheSinger(singer) {
        storage.session.set(SINGER_KEY, singer)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .singer {
    position: relative;
    width: 100%;
    top: 0;
    bottom: 0;
  }
</style>
