<template>
  <div>
    <edit-contact-popup
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
              :class="[{'this': item.name == editTarget}]"
              @click="editTarget = item.name"
            >
              {{item.title}}
            </li>
          </ul>
        </div>
      </template>
      <template #body-right>
        <keep-alive>
          <edit-content :is="editTarget" :data="data"></edit-content>
        </keep-alive>
      </template>
    </edit-contact-popup>
  </div>
</template>

<script>
import editContactPopup from '@/components/common/window/Popup'
const editCompany = () => ({
  component: import('./organizeList/editCompany')
})
const editUser = () => ({
  component: import('./organizeList/editUser')
})
const editDepartment = () => ({
  component: import('./organizeList/editDepartment')
})
const editRank = () => ({
  component: import('./organizeList/editRank')
})
const editPost = () => ({
  component: import('./organizeList/editPost')
})
export default {
  name: 'eidtContact',
  props: {
    data: Object
  },
  data () {
    return {
      leftList: [
        {name: 'editCompany', title: '公司'},
        // {name: 'editUser', title: '成员'},
        {name: 'editDepartment', title: '部门'},
        {name: 'editRank', title: '职级'},
        {name: 'editPost', title: '岗位'}
      ],
      editTarget: 'editCompany'
    }
  },
  components: {
    editContactPopup,
    editCompany,
    editUser,
    editDepartment,
    editRank,
    editPost
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .body-left
    leftMenu1()
</style>
