<template>
  <div>
    <projects-Popup
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
              :key="item.type"
              :class="[{'this': item.type == listType}]"
              @click="listType = item.type"
            >
              <i :class="item.icon"></i>
              {{item.title}}
            </li>
          </ul>
        </div>
      </template>
      <template #body-right>
        <keep-alive>
          <project-content :type="listType"></project-content>
        </keep-alive>
      </template>
    </projects-Popup>
  </div>
</template>

<script>
import ProjectsPopup from '@/components/common/window/Popup'
import ProjectContent from './ProjectList'
export default {
  name: 'Projects',
  props: {
    data: Object
  },
  data () {
    return {
      listType: 'created',
      leftList: [
        {title: '我创建的', type: 'created', icon: 'icon-created'},
        {title: '我参与的', type: 'join', icon: 'icon-join'},
        {title: '已归档的', type: 'filing', icon: 'icon-finished'},
        {title: '回收站', type: 'deleted', icon: 'icon-project-del'}
      ]
    }
  },
  components: {
    ProjectsPopup,
    ProjectContent
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .body-left
    leftMenu1()
  .icon
    color #FFF
</style>
