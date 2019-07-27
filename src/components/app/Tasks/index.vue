<template>
  <div>
    <tasks-popup
      :appId="data.appId"
      :zIndex="data.zIndex"
      :resize="true"
    >
      <template #name>{{data.title}}</template>
      <template #body-left>
        <div class="body-left" @contextmenu.prevent>
          <ul class="left-menu">
            <li
              v-for="item of leftList"
              :key="item.name"
              :class="[{'this': item.name == taskList}]"
              @click="taskList = item.name"
            >
              <i :class="item.icon"></i>
              {{item.title}}
            </li>
          </ul>
        </div>
      </template>
      <template #body-right>
        <keep-alive>
          <task-content :is="taskList" :data="data"></task-content>
        </keep-alive>
      </template>
    </tasks-popup>
  </div>
</template>

<script>
import tasksPopup from '@/components/common/window/Popup'
const taskList = () => ({
  component: import('./taskList')
})
const file = () => ({
  component: import('./files')
})
const chat = () => ({
  component: import('./chat')
})
const overview = () => ({
  component: import('./overview')
})
export default {
  name: 'Tasks',
  props: {
    data: Object
  },
  data () {
    return {
      leftList: [
        {name: 'taskList', title: '任务', icon: 'icon-tasks'},
        {name: 'file', title: '文件', icon: 'icon-file'},
        {name: 'chat', title: '群聊', icon: 'icon-chats'},
        {name: 'overview', title: '概览', icon: 'icon-summary'}
      ],
      taskList: 'taskList'
    }
  },
  components: {
    tasksPopup,
    taskList,
    file,
    chat,
    overview
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .body-left
    leftMenu1()
</style>
