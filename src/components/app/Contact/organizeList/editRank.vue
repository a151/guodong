<template>
  <div class="body-right">
    <div class="content-menu" @contextmenu.prevent>
      <el-button type="primary" @click="addRank" size="mini">添加</el-button>
    </div>
    <div class="rankList" id="rankList">
      <el-table
        :data="rankList"
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
          label="职级名称">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editRank(scope.row)">编辑</el-button>
            <el-button size="mini" @click="delRank(scope.row,$event,scope.$index)">删除</el-button>
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
        <p>确定要删除"{{rankName}}"这个职务吗？</p>
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
  name: 'editRank',
  data () {
    return {
      userid: null,
      rankList: [],
      tipsDeletion: false,
      rankName: NaN,
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
    getRankList () {
      this.rankList = []
      let contactList = this.$store.state.contact.userList
      let index = 1
      if (contactList.length) {
        contactList.forEach(data => {
          let company = data.name
          let companyId = data.id
          if (data.rank.length) {
            data.rank.forEach(data => {
              let rank = {}
              Vue.set(rank, 'key', index++)
              Vue.set(rank, 'id', data.value)
              Vue.set(rank, 'name', data.label)
              Vue.set(rank, 'company', company)
              Vue.set(rank, 'company_id', companyId)
              this.rankList.push(rank)
            })
          }
        })
      }
    },
    addRank () {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        let obj = {}
        let addMessage = {}
        obj.appId = 'rankAdd'
        obj.title = '添加职务'
        obj.name = 'Contact'
        obj.components = 'addModification/rankEdit'
        this.$store.commit('desktop/openApp', obj)
        addMessage.infoStatus = 0
        addMessage.infoJudge = 'add'
        addMessage.infoName = '职务名称'
        addMessage.infoDescribe = '所属公司'
        this.$store.commit('contact/infoData', addMessage)
      }
    },
    editRank (val) {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        let obj = {}
        let addMessage = {}
        obj.id = val.id
        obj.data = val
        obj.appId = 'rankEdit'
        obj.title = '编辑职务'
        obj.name = 'Contact'
        obj.components = 'addModification/rankEdit'
        this.$store.commit('desktop/openApp', obj)
        addMessage.infoStatus = 0
        addMessage.infoJudge = 'edit'
        addMessage.infoName = '职务名称'
        addMessage.infoDescribe = '所属公司'
        this.$store.commit('contact/infoData', addMessage)
      }
    },
    delRank (val, event, index) {
      this.isSignIn()
      if (!this.userid) {
        this.toSignIn()
      } else {
        this.toDeleteIndex = index
        this.rankName = val.name
        this.tipsDeletion = true
        this.deviationY = event.clientY - document.getElementById('rankList').getBoundingClientRect().top - 110
      }
    },
    tipsDeletionDetermine () {
      this.rankList.splice(this.toDeleteIndex, 1)
      this.tipsDeletion = false
    }
  },
  mounted () {
    this.getRankList()
  },
  computed: {
    watchUserList () {
      return this.$store.state.contact.userList
    }
  },
  watch: {
    watchUserList () {
      this.getRankList()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .rankList
     position relative
     padding 20px
</style>
