<template>
  <div
    class="window-wrapper"
    ref="window"
    :style="{width: winWidth + 'px', height: winHeight + 'px', top: winTop + 'px', left: winLeft + 'px', zIndex: zIndex}"
    @mousedown="winActivate"
  >
    <div class="container">
      <win-resize @resize="winRisize" v-if="resize"></win-resize>
      <div :class="['header', childWin ? 'child-bg' : 'app-bg']">
        <div class="top-bar">
          <div
            class="name"
            @dblclick="winClose"
            @contextmenu.prevent="winTopContextMenu"
          ><slot name="name">Null</slot></div>
          <div
            class="move-bar"
            @mousedown.prevent="windowMove"
            @dblclick="Maximization"
            @contextmenu.prevent="winTopContextMenu"
          ></div>
          <slot name="headerMenu"></slot>
          <ul class="resize-tools" @contextmenu.prevent>
            <li @click="minimize"><i class="el-icon-minus"></i></li>
            <li @click.prevent="Maximization" v-if="resize"><i class="el-icon-news"></i></li>
            <li @click="winClose"><i class="el-icon-close"></i></li>
          </ul>
        </div>
        <slot name="tool-bar"></slot>
        <slot name="menu-bar"></slot>
      </div>
      <div class="body">
        <slot name="body-left"></slot>
        <slot name="body-right"></slot>
      </div>
      <div class="footer">
        <slot name="body-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import WinResize from './WinResize'
export default {
  name: 'Popup',
  props: {
    appId: String,
    zIndex: Number,
    width: Number,
    height: Number,
    resize: Boolean,
    close: Boolean,
    childWin: Boolean
  },
  components: {
    WinResize
  },
  data () {
    return {
      isMax: false,
      winTop: NaN,
      winLeft: NaN,
      winWidth: NaN,
      winHeight: NaN
    }
  },
  watch: {
    close (isClose) {
      if (isClose) {
        this.winClose()
      }
    }
  },
  methods: {
    windowMove (e) { // 窗口拖动
      if (!this.isMax) {
        let window = this.$refs.window // 获取窗口元素
        let disX = e.clientX - window.offsetLeft
        let disY = e.clientY - window.offsetTop
        let docWidth = document.body.clientWidth
        document.onmousemove = (e) => {
          let left = e.clientX - disX
          let top = e.clientY - disY
          if (top < 0) {
            top = 0
          }
          if (e.clientX > docWidth) {
            document.onmousemove = null
            document.onmouseup = null
          }
          this.positionX = this.winTop = top
          this.positionY = this.winLeft = left
          window.style.left = left + 'px'
          window.style.top = top + 'px'
        }
        document.onmouseup = (e) => {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    },
    winActivate () { // 激活窗口
      this.$store.commit('desktop/winActivate', this.appId)
    },
    minimize () { // 窗口最小化
      this.$store.commit('desktop/changWinStatus', {action: 'minimize', appId: this.appId})
    },
    winClose () { // 窗口关闭
      this.$store.commit('desktop/changWinStatus', {action: 'close', appId: this.appId})
    },
    winTopContextMenu () {
      this.$message('窗口顶部右键')
    },
    Maximization () { // 窗口最大化
      if (this.resize) {
        let window = this.$refs.window
        if (this.isMax) {
          window.style.left = this.winLeft + 'px'
          window.style.top = this.winTop + 'px'
          window.style.width = this.winWidth + 'px'
          window.style.height = this.winHeight + 'px'
        } else {
          window.style.left = 0
          window.style.top = 0
          window.style.width = 100 + '%'
          window.style.height = 100 + '%'
        }
        this.isMax = !this.isMax
      }
    },
    winRisize (direction, e) {
      let winBox = this.$refs.window
      let winTop = winBox.offsetTop
      let winLeft = winBox.offsetLeft
      let initialWidth = winBox.clientWidth
      let initialHeight = winBox.clientHeight
      if (!this.isMax) {
        document.onmousemove = (e) => {
          let clientT = e.clientY > 0 ? e.clientY : 0
          let clientR = e.clientX > document.body.clientWidth ? document.body.clientWidth : e.clientX
          // let clientB = e.clientY > document.body.clientWidth - 30 ? document.body.clientWidth - 30 : e.clientY
          let clientL = e.clientX > 0 ? e.clientX : 0
          let winWidth = clientR - winLeft
          let winHeight = clientT - winTop
          switch (direction) {
            case 'Top':
              let winHTop = initialHeight + winTop - clientT < 350 ? 350 : initialHeight + winTop - clientT
              let winTTop = winHTop > 350 ? clientT : this.winTop
              winBox.style.top = winTTop + 'px'
              winBox.style.height = winHTop + 'px'
              this.winTop = winTTop
              this.winHeight = winHTop
              break
            case 'Right':
              let winHRight = winWidth < 460 ? 460 : winWidth
              winBox.style.width = winHRight + 'px'
              this.winWidth = winHRight
              break
            case 'Bottom':
              let winHBottom = winHeight < 350 ? 350 : winHeight
              winBox.style.height = winHBottom + 'px'
              this.winHeight = winHBottom
              break
            case 'Left':
              let winWLeft = initialWidth + winLeft - clientL < 460 ? 460 : initialWidth + winLeft - clientL
              let winLLeft = winWLeft > 460 ? clientL : this.winLeft
              winBox.style.left = winLLeft + 'px'
              winBox.style.width = winWLeft + 'px'
              this.winLeft = winLLeft
              this.winWidth = winWLeft
              break
            case 'TopLeft':
              break
            case 'TopRight':
              break
            case 'BottomRight': // 右下角
              if (winWidth < 460) {
                winWidth = 460
              } else {
                winBox.style.width = winWidth + 'px'
              }
              if (winHeight < 350) {
                winHeight = 350
              } else {
                winBox.style.height = winHeight + 'px'
              }
              winBox.style.width = winWidth + 'px'
              winBox.style.height = winHeight + 'px'
              this.winWidth = winWidth
              this.winHeight = winHeight
              break
            case 'BottomLeft':
              break
          }
          document.onmouseup = (e) => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  created () {
    this.$options.name = this.appId + this.$options.name
    let docWidth = document.body.clientWidth
    let docHeight = this.$store.state.desktop.winHeight
    this.winWidth = this.width ? this.width : docWidth * 3 / 5
    this.winLeft = this.width ? (docWidth - this.width) / 2 : docWidth / 5
    this.winHeight = this.height ? this.height : docHeight * 7 / 10
    this.winTop = this.height ? (docHeight - this.height) / 2 : docHeight * 3 / 20
    this.winZindex = this.$store.state.desktop.winZindex
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .window-wrapper
    width 700px
    height 350px
    overflow hidden
    position absolute
    top 50px
    left 100px
    border-bottom $borderBlack
    border-radius 3px
    box-shadow 0 0 5px rgba(0, 0, 0, .8)
    display flex
    .container
      width 100%
      position relative
      flex 1
      display flex
      flex-direction column
      .header
        z-index 100
        .top-bar
          padding 0 10px
          display flex
          flex-direction row
          justify-content space-between
          user-select none
          .name
            font-weight 200
            font-size 16px
            line-height 36px
          .move-bar
            flex 1
          .resize-tools
            display flex
            flex-direction row
            li
              width 22px
              height 22px
              margin 7px 3px
              border-radius 2px
              line-height 22px
              text-align center
      .app-bg
        color #FFF
        background linear-gradient($gradienDarkBlacktLight, $gradientDarkBlackDark)
        .top-bar
          box-shadow 0 1px 0 $LineBlack inset
          .resize-tools
            li
              &:hover
                background $borderBlack
      .child-bg
        color #333
        background linear-gradient($gradientWhiteLight, $gradientWhiteDark)
        .top-bar
          box-shadow 0 1px 0 $LineWhite inset
          .resize-tools
            li
              &:hover
                background #ddd
      .body
        flex 1
        display flex
        flex-direction row
        z-index 100
</style>
