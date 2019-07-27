<template>
  <div class="desk-top-icon-container">
    <ul class="desktop-icon-list">
      <li
        :to="item.appUrl"
        v-for="(item, index) of list"
        :key="item.appId"
        :class="['icon-item', {select: index==current}]"
        @click="addClass(index, $event)"
        @dblclick="OpenWindow(item)"
        @contextmenu.prevent="desktopIconMenu"
      >
        <img :src="item.icon" class="icon-img" />
        <p class="icon-text">{{item.title}}</p>
      </li>
      <li class="desktop" @contextmenu.prevent="desktopMenu"></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DeskTopIcons',
  props: [
    'list'
  ],
  data () {
    return {
      current: NaN
    }
  },
  methods: {
    // 单击添加背景
    addClass (index, event) {
      this.current = index
    },
    // 双击打开窗口
    OpenWindow (obj) {
      let userid = localStorage.userid ? localStorage.userid : false
      if (!userid) {
        this.$alert('请重新登录', '登录失效', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({path: '/login'})
          }
        })
      } else {
        obj.appId = 'app' + obj.id
        this.$store.commit('desktop/openApp', obj)
        this.current = NaN
      }
    },
    // 图标右键菜单
    desktopIconMenu () {
      this.$message('图标右键')
    },
    // 桌面右键菜单
    desktopMenu () {
      this.$message('桌面右键')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .desk-top-icon-container
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    z-index 0
    .desktop-icon-list
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      display flex
      flex-flow column wrap
      align-content flex-start
      .icon-item
        width 64px
        margin 10px
        text-align center
        box-sizing border-box
        border 1px solid
        border-color transparent
        user-select none
        z-index 1
        &:hover
          border 1px solid rgba(255, 255, 255 , .5)
          border-radius 3px
          background rgba(255, 255, 255, .1)
        &.select
          border 1px solid rgba(255, 255, 255 , .5)
          border-radius 3px
          background rgba(255, 255, 255, .2)
        .icon-img
          width 90%
        .icon-text
          color #FFFFFF;
          line-height 24px
          text-shadow #000 1px 1px 3px
      .desktop
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        z-index 0
</style>
