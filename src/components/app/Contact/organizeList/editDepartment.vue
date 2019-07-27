<template>
  <div class="body-right">
    <div class="content-menu" @contextmenu.prevent>
      <el-button type="primary" @click="addDepartment" size="mini">添加</el-button>
    </div>
    <div class="departmentList" id="departmentList">
      <el-table
        :data="departmentList"
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
          prop="name"
          label="部门名称">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editDepartment(scope.row)">编辑</el-button>
            <el-button size="mini" @click="delDepartment(scope.row,$event,scope.$index)">删除</el-button>
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
        <p>确定要删除"{{departmentName}}"这个部门吗？</p>
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
  name: 'editDepartment',
  data () {
    return {
      userid: null,
      departmentList: [],
      tipsDeletion: false,
      departmentName: NaN,
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
    getDepartmentList () {
      this.departmentList = []
      let contactList = this.$store.state.contact.userList
      let index = 1
      if (contactList.length) {
        contactList.forEach(data => {
          let company = data.name
          let companyId = data.id
          if (data.children.length) {
            data.children.forEach(data => {
              let department = {}
              Vue.set(department, 'key', index++)
              Vue.set(department, 'id', data.id)
              Vue.set(department, 'name', data.name)
              Vue.set(department, 'company', company)
              Vue.set(department, 'company_id', companyId)
              this.departmentList.push(department)
            })
          }
        })
      }
    },
    addDepartment () {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        let obj = {}
        let addMessage = {}
        obj.appId = 'departmentAdd'
        obj.title = '添加部门'
        obj.name = 'Contact'
        obj.components = 'addModification/departmentEdit'
        this.$store.commit('desktop/openApp', obj)
        addMessage.infoStatus = 0
        addMessage.infoJudge = 'add'
        addMessage.infoName = '部门名称'
        addMessage.infoDescribe = '所属公司'
        this.$store.commit('contact/infoData', addMessage)
      }
    },
    editDepartment (val) {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        let obj = {}
        let addMessage = {}
        obj.appId = 'departmentEdit'
        obj.data = val
        obj.title = '编辑部门'
        obj.name = 'Contact'
        obj.components = 'addModification/departmentEdit'
        this.$store.commit('desktop/openApp', obj)
        addMessage.infoStatus = 0
        addMessage.infoJudge = 'edit'
        addMessage.infoName = '部门名称'
        addMessage.infoDescribe = '所属公司'
        this.$store.commit('contact/infoData', addMessage)
      }
    },
    tipsDeletionDetermine () {
      this.departmentList.splice(this.toDeleteIndex, 1)
      this.tipsDeletion = false
    },
    delDepartment (val, event, index) {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        this.toDeleteIndex = index
        this.departmentName = val.name
        this.tipsDeletion = true
        this.deviationY = event.clientY - document.getElementById('departmentList').getBoundingClientRect().top - 110
      }
    }
  },
  mounted () {
    this.getDepartmentList()
  },
  computed: {
    watchUserList () {
      return this.$store.state.contact.userList
    }
  },
  watch: {
    watchUserList () {
      this.getDepartmentList()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .departmentList
    position relative
    padding 20px
</style>
