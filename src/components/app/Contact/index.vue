<template>
  <div>
    <contact-popup
        :appId="data.appId"
        :zIndex="data.zIndex"
        :resize="true"
      >
      <template #name>{{data.title}}</template>
      <template #body-left>
        <div class="body-left" @contextmenu.prevent>
          <div class="left-content">
            <div class="left-top">
              <div class="search">
                <el-input
                  placeholder="搜索联系人"
                  size="mini"
                  v-model="searchText">
                </el-input>
              </div>
              <div class="title">
                <div class="name">组织架构</div>
                <div class="button">
                  <span class="icon-add-big" @click="addUser"></span>
                  <span class="icon-ellipsis-row" @click="contactManage"></span>
                </div>
              </div>
            </div>
            <div class="left-tree">
              <el-tree
                :props="props"
                :data="$store.state.contact.userList"
                :filter-node-method="filterNode"
                ref="userTree"
                @node-click="showUserInfo"
              >
              </el-tree>
            </div>
          </div>
        </div>
      </template>
      <template #body-right>
        <keep-alive>
          <contact-content :user="userInfo" :post="postInfo" :rank="rankList" :show="true" ></contact-content>
        </keep-alive>
      </template>
    </contact-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import ContactPopup from '@/components/common/window/Popup'
import ContactContent from './Contact'
export default {
  name: 'Contack',
  props: {
    data: Object
  },
  data () {
    return {
      props: {
        label: 'name',
        isLeaf: 'leaf'
      },
      searchText: '',
      userList: [],
      userInfo: {},
      postInfo: [],
      rankList: []
    }
  },
  components: {
    ContactPopup,
    ContactContent
  },
  watch: {
    searchText (val) {
      this.$refs.userTree.filter(val)
    }
  },
  computed: {},
  methods: {
    showUserInfo (event, node, el) {
      if (node.data.leaf) {
        // 获取部门&岗位列表
        this.postInfo = []
        let componyId = node.data.company_id
        let compony = this.$store.state.contact.userList.filter(compony => compony.id === componyId)[0] // 所属公司
        let departmentList = []
        departmentList = [...compony.children] // 部门列表
        if (departmentList.length) {
          departmentList.forEach(data => {
            let department = {}
            department.value = data.id
            department.label = data.name
            department.children = []
            if (data.postlist.length) {
              data.postlist.forEach(data => {
                let post = {}
                post.value = data.id
                post.label = data.name
                department.children.push(post)
              })
            }
            this.postInfo.push(department)
          })
        }
        // 获取用户所属部门&岗位&职级名称
        let department = departmentList.filter(department => department.id === node.data.department_id)[0] // 所属部门信息
        let userPost = department.postlist.filter(post => post.id === node.data.post_id)[0] ? department.postlist.filter(post => post.id === node.data.post_id)[0].name : '' // 岗位名称
        let userDepartment = department.name // 所属部门名称
        let rank = compony.rank.filter(rank => rank.value === node.data.position_id)[0] ? compony.rank.filter(rank => rank.value === node.data.position_id)[0].label : '' // 职级名称
        this.userInfo = node.data
        Vue.set(this.userInfo, 'department', userDepartment)
        Vue.set(this.userInfo, 'post', userPost)
        Vue.set(this.userInfo, 'rank', rank)
        // 获取所属公司职级列表
        this.rankList = compony.rank
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    addUser () {
      let userid = localStorage.userid ? localStorage.userid : false
      if (!userid) {
        this.$alert('请重新登录', '登录失效', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({path: '/login'})
          }
        })
      } else {
        let obj = {}
        obj.appId = 'addUser'
        obj.title = '添加成员'
        obj.name = 'Contact'
        obj.components = 'addUser'
        this.$store.commit('desktop/openApp', obj)
      }
    },
    contactManage () {
      let userid = localStorage.userid ? localStorage.userid : false
      if (!userid) {
        this.$alert('请重新登录', '登录失效', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({path: '/login'})
          }
        })
      } else {
        let obj = {}
        obj.appId = 'eidtContact'
        obj.title = '通讯录管理'
        obj.name = 'Contact'
        obj.components = 'editContact'
        this.$store.commit('desktop/openApp', obj)
      }
    }
  },
  mounted () {}
}
</script>

<style lang="stylus" scoped>
  >>> .el-tree
    background none
    .is-current
      background #EAF6FF
      border-right 4px solid #009dff
  @import '~styles/mixin.styl'
  .body-left
    leftMenu1()
    .left-content
      height 100%
      overflow hidden
      display flex
      flex-direction column
      .left-top
        padding 15px
        border-bottom 1px solid #e5e5e5
        .search
          margin-bottom 10px
        .title
          font-size 16px
          display flex
          flex-direction row
          justify-content space-between
          .button
            span
              margin 0 10px
              cursor pointer
              &:hover
                color $colorMain
      .left-tree
        flex 1
        overflow-y auto
</style>
