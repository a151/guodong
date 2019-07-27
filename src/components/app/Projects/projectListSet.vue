<template>
  <div>
    <set-pop
      :appId="data.appId"
      :zIndex="data.zIndex"
      :width="460"
      :close="close"
      :childWin="true"
    >
      <template #name>{{data.title}}</template>
      <template #body-right>
        <div class="set-box">
          <div class="set-content">
            <el-form label-width="80px" size="small">
              <el-form-item label="项目名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="项目详情">
                <el-input type="textarea" v-model="form.desc"></el-input>
              </el-form-item>
              <el-form-item label="可见范围">
                <el-select v-model="form.type" placeholder="请选择可见范围" @change="selectChange">
                  <el-option label="公开：所有人可见，仅项目成员可编辑项目" value="2"></el-option>
                  <el-option label="私有：仅项目成员可见" value="1"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="项目成员">
                <el-tree
                  :data="userList"
                  show-checkbox
                  node-key="tree_id"
                  default-expand-all
                  :default-checked-keys="form.members"
                  :props="props">
                </el-tree>
              </el-form-item> -->
              <el-form-item label="项目成员">
                <el-tag
                  v-for="tag in taskForm.members"
                  :key="tag.id"
                  closable
                  :disable-transitions="false"
                  @close="delMembers(tag.id)">
                  {{tag.name}}
                </el-tag>
                <el-popover
                  placement="right"
                  width="240"
                  trigger="click">
                  <el-tree
                    :data="userList"
                    show-checkbox
                    node-key="tree_id"
                    default-expand-all
                    :style="{height: '300px', overflowY: 'auto'}"
                    :default-checked-keys="taskForm.membersId"
                    :props="props"
                    ref="projectMembersTree"
                    @check-change="getMembers">
                  </el-tree>
                  <el-button slot="reference" icon="el-icon-plus" circle></el-button>
                </el-popover>
              </el-form-item>
              <el-form-item label="拥有者">
                {{data.data.username}}
              </el-form-item>
              <el-form-item label="项目操作">
                <el-row>
                  <el-button type="primary" plain :disabled="false" @click="exit">退出项目</el-button>
                  <el-button type="primary" plain :disabled="operation.transfer" @click="transfer">移交项目</el-button>
                </el-row>
                <el-row>
                  <el-button type="primary" plain :disabled="operation.activate" @click="activate" v-if="data.data.status === 2">激活项目</el-button>
                  <el-button type="primary" plain :disabled="operation.filing" @click="filing" v-else>归档项目</el-button>
                  <el-button type="primary" plain :disabled="operation.restore" @click="restore" v-if="data.data.status === 0">恢复项目</el-button>
                  <el-button type="primary" plain :disabled="operation.delete" @click="del" v-else>删除项目</el-button>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button @click="closeWin">取消</el-button>
                <el-button type="primary" @click="doSet" :loading="buttonBool">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>
    </set-pop>
  </div>
</template>

<script>
// import Vue from 'vue'
import axios from 'axios'
import setPop from '@/components/common/window/Popup'
export default {
  name: 'projectListSet',
  props: {
    data: Object
  },
  data () {
    return {
      props: {
        label: 'name',
        isLeaf: 'leaf'
      },
      form: {
        name: '',
        desc: '',
        type: NaN,
        members: []
      },
      userList: [],
      operation: {
        exit: true,
        transfer: true,
        filing: true,
        activate: true,
        delete: true,
        restore: true
      },
      close: false,
      buttonBool: false,
      taskForm: {
        name: '',
        executor: '',
        executor_id: NaN,
        members: [],
        membersId: [],
        projectMembers: [],
        start_date: '',
        end_date: '',
        priorityOptions: [
          {
            value: 1,
            label: '非紧急'
          },
          {
            value: 2,
            label: '普通'
          },
          {
            value: 3,
            label: '紧急'
          }
        ],
        priority: '',
        task_time: NaN
      }
    }
  },
  components: {
    setPop
  },
  methods: {
    initForm () {
      let userid = localStorage.userid ? parseInt(localStorage.userid) : false
      let projectInfo = this.data.data
      this.form.name = projectInfo.name
      this.form.desc = projectInfo.description
      this.form.type = projectInfo.type === 2 ? '公开：所有人可见，仅项目成员可编辑项目' : '私有：仅项目成员可见'
      // 项目参与人员
      let members = projectInfo.members
      // console.log(projectInfo)
      if (members.length) {
        members.forEach(mem => {
          let per = {}
          per.id = mem.id
          per.name = mem.name
          this.taskForm.members.push(per)
          this.taskForm.membersId.push('u' + mem.id)
        })
      }
      if (userid === projectInfo.user_id && projectInfo.status === 1) { // 本人创建且进行中的可移交、归档、删除
        this.operation.transfer = false
        this.operation.filing = false
        this.operation.delete = false
      }
      if (userid !== projectInfo.user_id && projectInfo.status === 1) { // 非本人创建且进行中可退出
        this.operation.exit = false
      }
      if (userid === projectInfo.user_id && projectInfo.status === 2) { // 本人创建且归档的可激活、删除
        this.operation.activate = false
        this.operation.delete = false
      }
      if (userid === projectInfo.user_id && projectInfo.status === 0) { // 本人创建且删除的仅可恢复
        this.operation.restore = false
      }
    },
    initUserList () {
      let userList = []
      userList = [...this.$store.state.contact.userList]
      // if (userList.length) {
      //   userList.forEach(com => {
      //     Vue.set(com, 'tree_id', 'c' + com.id)
      //     if (com.children.length) {
      //       com.children.forEach(dep => {
      //         Vue.set(dep, 'tree_id', 'd' + dep.id)
      //         if (dep.children.length) {
      //           dep.children.forEach(user => {
      //             Vue.set(user, 'tree_id', 'u' + user.id)
      //           })
      //         }
      //       })
      //     }
      //   })
      this.userList = [...userList]
      // }
    },
    // 取消设置
    closeWin () {
      this.close = true
    },
    // 确认提交
    doSet () {
      let userid = localStorage.userid
      let projectInfo = this.data.data
      this.buttonBool = true
      if (this.form.type === '公开：所有人可见，仅项目成员可编辑项目' || this.form.type === '2') {
        this.form.type = 2
      } else {
        this.form.type = 1
      }
      axios.post('/api/project/projectEdit', {id: projectInfo.id, user_id: userid, name: this.form.name, description: this.form.desc, type: this.form.type, members: this.taskForm.members})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.$store.commit('project/initList', 1)
            this.$message({
              message: '成功!'
            })
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
      this.$message('提交修改')
      this.close = true
    },
    // 退出项目
    exit () {
      this.$confirm('一旦退出项目，你将不能查看项目信息，也不能收到项目通知。如果想重新加入，请联系项目管理员。').then(() => {
        this.$message({
          message: '退出!'
        })
      }).catch(() => {
        this.$message({
          message: '取消'
        })
      })
    },
    // 移交项目
    transfer () {
      let obj = {}
      obj.id = this.data.data.id
      obj.projectName = this.data.data.name
      obj.userList = this.userList
      obj.appId = 'transferProject'
      obj.title = '移交项目'
      obj.name = 'Projects' // 文件夹名
      obj.components = 'transferProject'
      this.$store.commit('desktop/openApp', obj)
    },
    // 激活项目
    activate () {
      this.$confirm('该项目已归档，如果需要继续使用，请重新激活它，确定激活项目吗？').then(() => {
        let userid = localStorage.userid
        let projectInfo = this.data.data
        axios.post('/api/project/projectArchive', {id: projectInfo.id, status: 1, user_id: userid})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$store.commit('project/initList', 1)
              this.$message({
                message: '激活成功!'
              })
              this.close = true
            } else {
              this.$alert(data.data.msg)
            }
          })
      }).catch(() => {
        this.$message({
          message: '取消激活'
        })
      })
    },
    // 归档项目
    filing () {
      this.$confirm('项目归档后，可以在“已归档的” 项目中激活该项目并继续使用。').then(() => {
        let userid = localStorage.userid
        let projectInfo = this.data.data
        axios.post('/api/project/projectArchive', {id: projectInfo.id, status: 2, user_id: userid})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$store.commit('project/initList', 1)
              this.$message({
                message: '归档成功!'
              })
              this.close = true
            } else {
              this.$alert(data.data.msg)
            }
          })
      }).catch(() => {
        this.$message({
          message: '取消归档'
        })
      })
    },
    // 恢复项目
    restore () {
      this.$confirm('该项目已被删除，如果需要继续使用，请重新恢复它，确定恢复项目吗？').then(() => {
        let userid = localStorage.userid
        let projectInfo = this.data.data
        axios.post('/api/project/projectDelete', {id: projectInfo.id, status: 1, user_id: userid})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$store.commit('project/initList', 1)
              this.$message({
                message: '恢复成功!'
              })
              this.close = true
            } else {
              this.$alert(data.data.msg)
            }
          })
      }).catch(() => {
        this.$message({
          message: '取消恢复'
        })
      })
    },
    // 删除项目
    del () {
      this.$confirm('项目删除后，可以在“回收站” 中恢复后才能继续使用。').then(() => {
        let userid = localStorage.userid
        let projectInfo = this.data.data
        axios.post('/api/project/projectDelete', {id: projectInfo.id, status: 0, user_id: userid})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$store.commit('project/initList', 1)
              this.$message({
                message: '删除成功!'
              })
              this.close = true
            } else {
              this.$alert(data.data.msg)
            }
          })
      }).catch(() => {
        this.$message({
          message: '取消'
        })
      })
    },
    getMembers () {
      let checkedMembers = this.$refs.projectMembersTree.getCheckedNodes(true)
      // console.log(checkedMembers)
      this.taskForm.members = []
      this.taskForm.membersId = []
      if (checkedMembers.length) {
        console.log(checkedMembers)
        checkedMembers.forEach(cMem => {
          if (cMem.leaf) {
            let mem = {}
            mem.id = cMem.tree_id.replace('u', '')
            mem.name = cMem.name
            mem.headimg = cMem.head_img
            mem.username = cMem.username
            this.taskForm.members.push(mem)
            console.log(this.taskForm.members)
            // console.log(this.taskForm.members)
            this.taskForm.membersId.push(cMem.tree_id)
            console.log(this.taskForm.membersId)
          }
        })
      }
    },
    delMembers (id) {
      let uIndex = this.taskForm.membersId.indexOf('u' + id)
      let index = this.taskForm.members.indexOf(this.taskForm.members.filter(user => user.id === id)[0])
      this.taskForm.members.splice(index, 1)
      this.taskForm.membersId.splice(uIndex, 1)
      this.$refs.projectMembersTree.setCheckedKeys(this.taskForm.membersId)
    },
    selectChange (val) {
      this.form.type = val
    }
  },
  mounted () {
    this.initForm()
    this.initUserList()
  }
}
</script>
<style>
.el-tag {
    margin: 3px 4px;
}
</style>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .set-box
    width 100%
    max-height 100%
    background #FFF
    overflow-y auto
    padding 20px
    .set-content
      width 100%
      .el-row
        margin-bottom 15px
</style>
