<template>
  <div>
    <add-user-popup
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
              :class="[{'this': item.name == addMode}]"
              @click="addMode = item.name"
            >
              {{item.title}}
            </li>
          </ul>
        </div>
      </template>
      <template #body-right>
        <keep-alive>
          <add-content :is="addMode" :data="data"></add-content>
        </keep-alive>
      </template>
    </add-user-popup>
  </div>
</template>

<script>
import addUserPopup from '@/components/common/window/Popup'
const addQuick = () => ({
  component: import('./addQuick')
})
const addEmail = () => ({
  component: import('./addEmail')
})
export default {
  name: 'addUser',
  props: {
    data: Object
  },
  data () {
    return {
      leftList: [
        {name: 'addQuick', title: '快速添加'},
        {name: 'addEmail', title: '邮箱邀请'}
      ],
      addMode: 'addQuick'
    }
  },
  components: {
    addUserPopup,
    addQuick,
    addEmail
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .body-left
    leftMenu1()
</style>
