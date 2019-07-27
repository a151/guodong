<template>
  <div class="desk-top-taskbar">
    <start></start>
    <tasks></tasks>
    <icons></icons>
  </div>
</template>

<script>
import Start from './DeskTopTaskbar/Start'
import Tasks from './DeskTopTaskbar/Tasks'
import Icons from './DeskTopTaskbar/Icons'
export default {
  name: 'DeskTopTaskbar',
  components: {
    Start,
    Tasks,
    Icons
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .desk-top-taskbar
    height 30px
    border-top 1px solid $borderBlack
    border-bottom 1px solid $borderBlack
    background linear-gradient($gradienBlacktLight, $gradientBlackDark)
    box-shadow 0 1px 0 $LineBlack inset
    display flex
    flex-direction row
    justify-content space-between
    z-index 200
</style>
