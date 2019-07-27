<template>
  <div>
    <transfer-project
      :appId="data.appId"
      :zIndex="data.zIndex"
      :width="460"
      :close="close"
      :childWin="true"
    >
      <template #name>{{data.title}}</template>
      <template #body-right>
        <div class="transfer-box">
          <div class="transfer-content">
            <el-card class="msg">你可以把项目移交给其他成员管理，同时你将退出项目，不能再对项目做任何操作。请在下方搜素要移交给的成员。</el-card>
            <div class="transfer-search">
              <el-input
                placeholder="搜索成员"
                v-model="filterText">
              </el-input>
            </div>
            <div class="transfer-tree">
              <el-tree
                :data="data.userList"
                :props="props"
                :filter-node-method="filterNode"
                @node-click="selection"
                default-expand-all
                ref="user">
              </el-tree>
            </div>
            <div class="transfer-btn">
              <el-button size="small" @click="cancel">取消</el-button>
              <el-button type="primary" size="small" @click="doTransfer">确定</el-button>
            </div>
          </div>
        </div>
      </template>
    </transfer-project>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import transferProject from '@/components/common/window/Popup'
export default {
  name: 'projectTransfer',
  props: {
    data: Object
  },
  data () {
    return {
      close: false,
      filterText: '',
      recipient: {
        id: '',
        name: ''
      },
      props: {
        children: 'children',
        label: 'name'
      }
    }
  },
  components: {
    transferProject
  },
  watch: {
    filterText (val) {
      this.$refs.user.filter(val)
    }
  },
  mounted () {
    console.log(this.data)
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    cancel () {
      this.close = true
    },
    doTransfer () {
      if (this.recipient.id) {
        this.$confirm('您确定要将项目“' + this.data.projectName + '”移交给“' + this.recipient.name + '”吗').then(() => {
          let userid = localStorage.userid
          axios.post('/api/project/projectTransfer', {user_id: userid, id: this.data.id, transfer_uid: this.recipient.id})
            .then(res => {
              let data = res.data
              if (data.ret) {
                this.$store.commit('project/initList', 1)
                this.$message({
                  message: '成功!'
                })
                this.$store.commit('desktop/changWinStatus', {action: 'close', appId: this.appId})
                this.$store.commit('desktop/changWinStatus', {action: 'close', appId: this.data.appId})
                this.buttonBool = false
                this.close = true
              } else {
                this.$alert(data.data.msg)
              }
            }).catch(() => {
              this.$message({
                message: '失败'
              })
            })
        }).catch(() => {
          this.$message({
            message: '已取消移交'
          })
        })
      } else {
        this.$message('请先选中要移交的成员')
      }
    },
    selection (event, node, el) {
      if (node.data.leaf) {
        Vue.set(this.recipient, 'id', node.data.id)
        Vue.set(this.recipient, 'name', node.data.name)
        this.filterText = this.recipient.name
        console.log(this.recipient)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .transfer-box
    width 100%
    background #FFF
    max-height 100%
    overflow-y auto
    .transfer-content
      padding 20px
      .msg
        line-height 200%
      .transfer-search, .transfer-btn
        margin-top 20px
</style>
