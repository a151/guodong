<template>
  <div>
    <div
      :class="['start-icon', {'icon-bg': showMenu}]"
      @click="showStarMenu"
      @contextmenu.prevent="Contextmenu"
    >
      <img src="~images/start-icon.png" />
    </div>
    <div
      class="start-menu-wrapper"
      v-show="showMenu"
      @click="closeStartMenu"
     >
      <div class="menu-container">
        <div class="menu-top">
          <div
            @mouseleave="leftMenuNarrowed"
            :class="['menu-left', isExpansion ? 'wide' : 'narrow']"
          >
            <div class="bar" @click="leftMenuToggle">
              <div class="icon">
                <i class="icon-menu"></i>
              </div>
              <div class="text">切换</div>
            </div>
            <div class="start-icon-list">
              <ul>
                <li
                  v-for="item of $store.state.startMenu.leftMenu"
                  :key="item.id"
                  @click="openWindow"
                  class="list-item"
                >
                  <div class="img">
                    <img :src="item.icon" >
                  </div>
                  <div class="text">{{item.title}}</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="menu-right">
            <ul class="menu-list">
              <li
                v-for="item of $store.state.startMenu.rightMenu"
                :key="item.id"
                @click="openWindow"
              >
                <div class="img"><img :src="item.icon" /></div>
                <div class="text">{{item.title}}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="menu-bottom">
          <button class="login-out-btn" @click="logout"><i class="icon-logout"></i> 注销</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'StartMenu',
  data () {
    return {
      showMenu: false,
      isExpansion: false
    }
  },
  methods: {
    showStarMenu () {
      this.showMenu = !this.showMenu
    },
    closeStartMenu (e) {
      if (this.showMenu === true) {
        if (!document.querySelector('.menu-container').contains(e.target)) {
          this.showMenu = false
        }
      }
    },
    leftMenuToggle () {
      this.isExpansion = !this.isExpansion
    },
    leftMenuNarrowed () {
      this.isExpansion = false
    },
    openWindow () {
      this.$message({
        message: '开发中...',
        center: true
      })
    },
    Contextmenu () {
      return false
    },
    logout () {
      this.showMenu = false
      this.$confirm('确定退出?', {
        showClose: false,
        closeOnClickModal: false
      }).then(() => {
        axios.post('/api/user/logout')
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$router.push({path: '/'})
            }
          })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .start-icon
    width 50px
    height 30px
    text-align center
    border-right 1px solid rgba(11, 12, 16, 0)
    &.icon-bg{
      background rgba(255, 255, 255, .05)
      // border-right 1px solid rgba(11, 12, 16, 1)
      box-shadow 1px 0 0 rgba(11, 12, 16, 1)
    }
    img
      margin-top 10px
  .start-menu-wrapper
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    color #FFF
    .menu-container
      width 300px
      height 70%
      overflow hidden
      padding-top 1px
      position fixed
      left 3px
      bottom 35px
      border 1px solid #0d1015
      border-radius 2px
      background $bgBlackDark
      display flex
      flex-direction column
      .menu-top
        border-bottom 1px solid #18181a
        background #2b2b2d
        position relative
        flex 1
        display flex
        flex-direction row
        cursor default
        user-select none
        .menu-left
          &.wide
            width 270px
          &.narrow
            width 48px
          overflow hidden
          border-right 1px solid #18181a
          background $bgBlackLight
          box-shadow 0 0 20px rgba(0, 0, 0, .3)
          z-index 99
          display flex
          flex-direction column
          justify-content space-between
          .bar
            line-height 56px
            text-indent 5px
            display flex
            flex-direction row
            &:hover
              background $bgBlackDark
            .icon
              width 48px
              font-size 20px
              flex none
            .text
              flex auto
              white-space nowrap
          .start-icon-list
            .list-item
              height 56px
              line-height 56px
              overflow hidden
              display flex
              flex-direction row
              &:hover
                background $bgBlackDark
              .img
                width 48px
                text-align center
                flex none
                img
                  width 23px
                  height 23px
                  margin-top 15px
              .text
                text-indent 15px
                flex auto
        .menu-right
          position absolute
          top 0
          left 50px
          right 0
          bottom 0
          li
            height 56px
            line-height 56px
            overflow hidden
            display flex
            flex-direction row
            &:hover
              background $bgBlackLight
            .img
              width 50px
              text-align center
              img
                width 30px
                height 30px
                box-sizing border-box
                margin-top 15px
      .menu-bottom
        height 50px
        box-sizing border-box
        background linear-gradient($gradienDarkBlacktLight, $gradientDarkBlackDark)
        box-shadow 0 1px 0 $LineBlack inset
        text-align right
        padding 15px
        .login-out-btn
          btn-black()
</style>
