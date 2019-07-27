<template>
  <div class="win-resize">
    <div class="border-top" @mousedown.prevent="resize('Top')"></div>
    <div class="border-right" @mousedown.prevent="resize('Right')"></div>
    <div class="border-bottom" @mousedown.prevent="resize('Bottom')"></div>
    <div class="border-left" @mousedown.prevent="resize('Left')"></div>
    <div class="horn-top-left" @mousedown.prevent="resize('TopLeft')"></div>
    <div class="horn-top-right" @mousedown.prevent="resize('TopRight')"></div>
    <div class="horn-bottom-right" @mousedown.prevent="resize('BottomRight')"></div>
    <div class="horn-bottom-left" @mousedown.prevent="resize('BottomLeft')"></div>
  </div>
</template>

<script>
export default {
  name: 'winResize',
  methods: {
    resize (direction) {
      this.$emit('resize', direction)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .win-resize
    z-index 101
    .border-top
      width 98%
      height 2px
      position absolute
      top 0
      left 1%
      cursor n-resize
    .border-right
      width 2px
      height 98%
      position absolute
      top 1%
      right 0
      cursor w-resize
    .border-bottom
      width 98%
      height 2px
      position absolute
      bottom 0
      left 1%
      cursor n-resize
    .border-left
      width 2px
      height 98%
      position absolute
      top 1%
      left 0
      cursor w-resize
    .horn-top-left
      width 4px
      height 4px
      position absolute
      top 0
      left 0
      cursor se-resize
    .horn-top-right
      width 4px
      height 4px
      position absolute
      top 0
      right 0
      cursor ne-resize
    .horn-bottom-right
      width 4px
      height 4px
      position absolute
      bottom 0
      right 0
      cursor se-resize
    .horn-bottom-left
      width 4px
      height 2px
      position absolute
      bottom 0
      left 0
      cursor ne-resize
</style>
