<template>
  <div class="body-right">
    <div class="content-menu" @contextmenu.prevent>
      <el-button type="primary" @click="addPost" size="mini">添加</el-button>
    </div>
    <div class="postList" id="postList">
      <el-table
        :data="postList"
        border
        style="width: 100%">
        <el-table-column
          prop="key"
          label="编号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="company"
          label="所属公司"
          width="200">
        </el-table-column>
        <el-table-column
          prop="department"
          label="所属部门"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="岗位名称">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editPost(scope.row)">编辑</el-button>
            <el-button size="mini" @click="delPost(scope.row,$event,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-popover
        placement="left"
        width="160"
        visible-arrow="true"
        style="position: absolute;"
        :style="{'right': 200+'px','top': deviationY+'px'}"
        v-model="tipsDeletion">
        <p>确定要删除"{{postName}}"这个岗位吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="tipsDeletion = false">取消</el-button>
          <el-button type="primary" size="mini" @click="tipsDeletionDetermine()">确定</el-button>
          <div x-arrow="" class="popper__arrow" style="bottom: -6px;left: 70%;margin-right: 3px;border-top-color: #fff;border-bottom-width: 0;"></div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'editPost',
  data () {
    return {
      userid: null,
      postList: [],
      tipsDeletion: false,
      postName: NaN,
      deviationY: 0,
      toDeleteIndex: 0
    }
  },
  methods: {
    isSignIn () {
      this.userid = localStorage.userid ? localStorage.userid : false
    },
    toSignIn () {
      this.$alert('请重新登录', '登录失效', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.push({path: '/login'})
        }
      })
    },
    getPostList () {
      this.postList = []
      let contactList = this.$store.state.contact.userList
      let index = 1
      if (contactList.length) {
        contactList.forEach(data => {
          let company = data.name
          let companyId = data.id
          if (data.children.length) {
            data.children.forEach(data => {
              if (data.postlist.length) {
                let department = data.name
                let departmentId = data.id
                data.postlist.forEach(data => {
                  let post = {}
                  Vue.set(post, 'key', index++)
                  Vue.set(post, 'id', data.id)
                  Vue.set(post, 'company', company)
                  Vue.set(post, 'company_id', companyId)
                  Vue.set(post, 'department', department)
                  Vue.set(post, 'department_id', departmentId)
                  Vue.set(post, 'name', data.name)
                  this.postList.push(post)
                })
              }
            })
          }
        })
      }
    },
    addPost () {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        let obj = {}
        let addMessage = {}
        obj.appId = 'postAdd'
        obj.title = '添加岗位'
        obj.name = 'Contact'
        obj.components = 'addModification/postEdit'
        this.$store.commit('desktop/openApp', obj)
        addMessage.infoStatus = 0
        addMessage.infoJudge = 'add'
        addMessage.infoName = '岗位名称'
        addMessage.infoDescribe = '所属岗位'
        this.$store.commit('contact/infoData', addMessage)
      }
    },
    editPost (val) {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        let obj = {}
        let addMessage = {}
        obj.id = val.id
        obj.data = val
        obj.appId = 'postEdit'
        obj.title = '编辑公司'
        obj.name = 'Contact'
        obj.components = 'addModification/postEdit'
        this.$store.commit('desktop/openApp', obj)
        addMessage.infoStatus = 0
        addMessage.infoJudge = 'edit'
        addMessage.infoName = '岗位名称'
        addMessage.infoDescribe = '所属岗位'
        this.$store.commit('contact/infoData', addMessage)
      }
    },
    delPost (val, event, index) {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        this.toDeleteIndex = index
        this.postName = val.name
        this.tipsDeletion = true
        this.deviationY = event.clientY - document.getElementById('postList').getBoundingClientRect().top - 110
      }
    },
    tipsDeletionDetermine () {
      this.postList.splice(this.toDeleteIndex, 1)
      this.tipsDeletion = false
    }
  },
  mounted () {
    this.getPostList()
  },
  computed: {
    watchUserList () {
      return this.$store.state.contact.userList
    }
  },
  watch: {
    watchUserList () {
      this.getPostList()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .postList
    position relative
    padding 20px
</style>
