<template>
  <div class="desk-top-content" ref="DesktopContent">
    <icons
      :list="iconList"
    ></icons>
    <app-win
      v-for="item of $store.state.desktop.appList"
      :key="item.appId"
      :data="item"
      v-if="item.existence"
      v-show="item.display"
    ></app-win>
  </div>
</template>

<script>
import Icons from './DeskTopContent/Icons'
const appWin = () => ({
  component: import('common/appWin')
})
export default {
  name: 'DeskTopContent',
  props: {
    iconList: Array
  },
  data () {
    return {}
  },
  components: {
    Icons,
    appWin
  },
  watch: {
  },
  methods: {
    Contextmenu () {
      // return false
    }
  },
  mounted () {
    let dtHeight = this.$refs.DesktopContent.clientHeight
    this.$store.commit('desktop/setWinHeight', dtHeight)
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .desk-top-content
    flex 1
    position relative
    z-index 0
    bg-image('~images/desk-top-bg01.png')
    background-size 100% 100%
</style>
