<template>
  <div class="tasks">
    <ul v-show="$store.state.desktop.appList.length" class="task-list">
      <li
        v-for="(item) of $store.state.desktop.appList"
        :key="item.appId"
        v-if="item.existence"
        @click="TasksClick(item.appId)"
        @contextmenu.prevent="taskbarTaskContextMenu"
        :class="['task-item', {'this': item.zIndex == $store.state.desktop.winMaxZindex}]"
      >
        <div class="img"><img :src="item.icon" class="task-img" v-if="item.icon" /></div>
        <div class="text">{{item.title}}</div>
      </li>
      <li class="taskBarContextMenu" @contextmenu.prevent="taskbarContextMenu"></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TaskbarTasks',
  data () {
    return {
      appList: this.$store.state.appList,
      showContextmenu: false
    }
  },
  methods: {
    TasksClick (appId) {
      this.$store.commit('desktop/taskBarActivate', appId)
    },
    taskbarTaskContextMenu () {
      this.$message('任务栏任务右键')
    },
    taskbarContextMenu () {
      this.$message('任务栏右键')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .tasks
    flex: 1
    cursor default
    user-select none
    .task-list
      line-height 30px
      position relative
      border-left 1px solid  rgba(11, 12, 16, 1)
      display flex
      flex-direction row
      .task-item
        padding 0 10px
        color #FFFFFF
        border-right 1px solid rgba(11, 12, 16, 1)
        box-shadow -1px 0 0 $LineBlack inset
        display flex
        flex-direction row
        z-index 1
        &.this
          background rgba(255, 255, 255, .08)
        &.taskBarContextMenu
          position absolute
          top 0
          right 0
          bottom 0
          left 0
          z-index 0
        .img
          .task-img
            width 20px
            height 20px
            margin 5px 5px 0 0
</style>
