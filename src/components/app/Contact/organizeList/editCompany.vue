<template>
  <div class="body-right">
    <div class="content-menu" @contextmenu.prevent>
      <el-button type="primary" @click="addCompany" size="mini">添加</el-button>
    </div>
    <div class="companyList" id="companyList">
      <el-table
        :data="companyList"
        border
        style="width: 100%">
        <el-table-column
          prop="key"
          label="编号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="公司名称">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editCompany(scope.row)">编辑</el-button>
            <el-button size="mini" @click="delCompany(scope.row,$event,scope.$index)">删除</el-button>
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
        <p>确定要删除"{{companyName}}"这个公司吗？</p>
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
import axios from 'axios'
export default {
  name: 'Company',
  data () {
    return {
      userid: null,
      companyList: [],
      tipsDeletion: false,
      isLoading: true,
      companyId: NaN,
      companyName: NaN,
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
    getCompanyList () {
      this.companyList = []
      let contactList = this.$store.state.contact.userList
      if (contactList.length) {
        contactList.forEach((data, index) => {
          let company = {}
          Vue.set(company, 'key', index + 1)
          Vue.set(company, 'id', data.id)
          Vue.set(company, 'name', data.name)
          Vue.set(company, 'describe', data.description)
          Vue.set(company, 'status', data.status)
          this.companyList.push(company)
        })
      }
    },
    addCompany () {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        let obj = {}
        let addMessage = {}
        obj.appId = 'companyAdd'
        obj.title = '添加公司'
        obj.name = 'Contact'
        obj.components = 'addModification/companyEdit'
        this.$store.commit('desktop/openApp', obj)
        addMessage.infoStatus = 0
        addMessage.infoJudge = 'add'
        addMessage.infoName = '公司名称'
        addMessage.infoDescribe = '公司描述'
        this.$store.commit('contact/infoData', addMessage)
      }
    },
    editCompany (val) {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        let obj = {}
        let addMessage = {}
        obj.id = val.id
        obj.data = val
        obj.appId = 'companyEdit'
        obj.title = '编辑公司'
        obj.name = 'Contact'
        obj.components = 'addModification/companyEdit'
        this.$store.commit('desktop/openApp', obj)
        addMessage.infoStatus = 0
        addMessage.infoJudge = 'edit'
        addMessage.infoName = '公司名称'
        addMessage.infoDescribe = '公司描述'
        this.$store.commit('contact/infoData', addMessage)
      }
    },
    tipsDeletionDetermine () {
      this.delDataAxios(this.companyId)
    },
    delCompany (val, event, index) {
      this.companyId = val.id
      this.toDeleteIndex = index
      this.companyName = val.name
      this.tipsDeletion = true
      this.deviationY = event.clientY - document.getElementById('companyList').getBoundingClientRect().top - 110
    },
    delDataAxios (id) {
      axios.post('/api/contact/deleteCompany', {id: id})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.isLoading = false
            if (!this.isLoading) {
              this.companyList.splice(this.toDeleteIndex, 1)
              this.tipsDeletion = false
            }
          } else {
            // this.$alert(data.msg)
            this.isLoading = true
          }
        })
    }
  },
  mounted () {
    this.getCompanyList()
  },
  computed: {
    watchUserList () {
      return this.$store.state.contact.userList
    }
  },
  watch: {
    watchUserList () {
      this.getCompanyList()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .companyList
    position relative
    padding 20px
  .el-popper[x-placement^=top] .popper__arrow
    bottom: -6px;
    left: 50%;
    margin-right: 3px;
    border-top-color: #ebeef5;
    border-bottom-width: 0;
  .el-popper .popper__arrow
    border-width: 6px;
    filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
</style>
