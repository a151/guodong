<template>
  <div>
    <files-move-pop
      :appId="data.appId"
      :zIndex="data.zIndex"
      :width="800"
      :height="570"
      :close="close"
      :childWin="true"
    >
      <template #name>{{data.title}}</template>
      <template #body-right>
        <div class="move" v-loading="loading">
          <div class="move-box">
            <div class="project">
              <header class="title">云文件</header>
              <ul class="list">
                <li
                  v-for="project of projectList"
                  :key="project.id"
                  :class="['item', {'current': project.id === currentProjectId}]"
                  :title="project.name"
                  @click="getFolder(project.id)"
                >{{project.name}}</li>
              </ul>
            </div>
            <div class="folder">
              <div class="folder-wrap">
                <div
                  v-for="folderBox of folderBoxList"
                  :key="folderBox.id"
                  class="folder-box"
                  v-loading="folderBox.loading"
                >
                  <div class="addFolder">
                    <el-button type="text" size="small" icon="el-icon-folder-add" v-if="!folderBox.isAdd" @click="addFolderShow(folderBox.id)">新建文件夹</el-button>
                    <el-input v-model="addFolderName" size="small" v-if="folderBox.isAdd" placeholder="按 Enter 新建文件夹" @blur="doAddFolder(folderBox.id)" @keyup.enter.native="doAddFolder(folderBox.id)" ref="addFolderInput"></el-input>
                  </div>
                  <ul class="list">
                    <li
                      v-for="folderList of folderBox.list"
                      :key="folderList.id"
                      :title="folderList.name"
                      :class="['item', {'current': folderList.id === folderBox.current}, {'disable': data.ids.includes(folderList.id)}]"
                      @click="!data.ids.includes(folderList.id) && getFolder(folderList.id, folderBox.id)"
                    >
                      {{folderList.name}}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="tips">{{data.desc}}</div>
            <div class="btn">
              <el-button size="small" @click="closeWin">取消</el-button>
              <el-button type="primary" size="small" @click="doMove">确定</el-button>
            </div>
          </div>
        </div>
      </template>
    </files-move-pop>
  </div>
</template>

<script>
import filesMovePop from '@/components/common/window/Popup'
import axios from 'axios'
import Vue from 'vue'
export default {
  name: 'filesMove',
  props: {
    data: Object
  },
  data () {
    return {
      loading: true,
      close: false,
      projectList: [],
      folderBoxList: [],
      currentProjectId: NaN,
      currentFolderId: NaN,
      addFolderName: ''
    }
  },
  components: {
    filesMovePop
  },
  methods: {
    // 获取项目列表
    getProjectList () {
      axios.post('/api/file/fileDir')
        .then(res => {
          this.loading = false
          let data = res.data
          if (data.ret) {
            this.projectList = data.data
            this.currentProjectId = this.projectList[0].id // 默认当前选中项目为第一个项目
            this.getFolder(this.currentProjectId) // 获取第一个项目下的文件夹
          } else {
            // this.$router.push({path: '/login'})
          }
        })
    },
    // 获取下一级文件夹
    getFolder (id, pid) {
      let folderBox = {}
      folderBox.id = ''
      folderBox.current = NaN
      folderBox.isAdd = false
      folderBox.loading = true
      folderBox.list = []
      if (pid) {
        let tBox = this.folderBoxList.filter(fBox => fBox.id === pid)[0] // 获取点击文件夹所在的列表对象
        let index = this.folderBoxList.indexOf(tBox) // 文件夹所在的列表对象在数组中的位置
        let len = this.folderBoxList.length - index // 获取文件夹所在对象后面的个数
        tBox.current = id
        this.folderBoxList.splice(index + 1, len, folderBox) // 删除数组中点击文件夹所在对象后的内容，插入新的内容
        this.currentFolderId = id // 当前选中的文件夹id
        this.getFolderList(id, id)
      } else {
        this.folderBoxList = [] // 清空数组
        this.folderBoxList.push(folderBox)
        this.currentProjectId = id // 当前选中的项目id
        this.getFolderList(id)
      }
    },
    // 获取文件夹列表
    getFolderList (id, pid) {
      let type = pid ? 'folder' : 'project'
      axios.post('/api/file/fileDir', {type: type, id: id})
        .then(res => {
          this.loading = false
          let data = res.data
          if (data.ret) {
            if (pid) {
              let len = this.folderBoxList.length - 1
              let folderBox = this.folderBoxList[len] // 新插入的数组对象
              folderBox.id = 'f' + id
              folderBox.loading = false
              folderBox.current = id
              folderBox.list = data.data
            } else {
              let folderBox = this.folderBoxList[0]
              folderBox.id = 'p' + id
              folderBox.loading = false
              folderBox.list = data.data
            }
          } else {
            // this.$router.push({path: '/login'})
          }
        })
    },
    // 显示新建文件夹
    addFolderShow (id) {
      this.folderBoxList.forEach(fBox => {
        Vue.set(fBox, 'isAdd', false)
      })
      let thisBox = this.folderBoxList.filter(thisBox => thisBox.id === id)[0]
      Vue.set(thisBox, 'isAdd', true)
      this.$nextTick(() => {
        this.$refs.addFolderInput[0].$el.querySelector('input').focus()
      })
    },
    // 执行新建文件夹
    doAddFolder (id) {
      let fid = id.substr(0, 1) === 'p' ? '' : id.substr(1)
      let thisBox = this.folderBoxList.filter(thisBox => thisBox.id === id)[0]
      if (this.addFolderName.trim()) {
        this.$nextTick(() => {
          this.$refs.addFolderInput[0].$el.querySelector('input').disabled = true
        })
        axios.post('/api/file/createFolder', {project_id: this.currentProjectId, pid: fid, name: this.addFolderName})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.addFolderName = ''
              this.$message(data.msg)
              Vue.set(thisBox, 'isAdd', false)
              let tBox = this.folderBoxList.filter(fBox => fBox.id === id)[0] // 获取点击文件夹所在的列表对象
              tBox.list.splice(0, 0, data.data)
              this.getFolder(data.data.id, tBox.id)
            } else {
              // this.$router.push({path: '/login'})
            }
          })
      } else {
        Vue.set(thisBox, 'isAdd', false)
      }
    },
    // 取消文件移动(关闭窗口)
    closeWin () {
      this.close = true
    },
    // 执行移动
    doMove () {
      this.loading = true
      console.log(this.data.operation)
      axios.post('/api/file/operateFile', {
        fileIds: this.data.ids,
        project_id: this.currentProjectId,
        folder_id: this.currentFolderId,
        operation: this.data.operation})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.$message(data.msg)
            this.close = true
          } else {
            // this.$router.push({path: '/login'})
          }
        })
    }
  },
  mounted () {
    this.getProjectList()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .move
    width 100%
    height 100%
    background #FFF
    overflow hidden
    display flex
    flex-direction column
    .list
      flex 1
      overflow-y auto
      .item
        line-height 40px
        text-indent 15px
        border-right 4px solid transparent
        cursor pointer
        max-width 200px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        &:hover
          background #e6e6e6
        &.current
          background #d7eaf6
          border-color $colorMain
        &.disable
          color #ccc
          cursor not-allowed
          &:hover
            background none
    .move-box
      width 100%
      overflow hidden
      flex 1
      display flex
      flex-direction row
      .project
        width 220px
        height 100%
        background #f7f7f7
        display flex
        flex-direction column
        .title
          background #eee
          padding 10px 15px
          font-weight bold
          cursor default
      .folder
        overflow-x auto
        flex 1
        display flex
        flex-direction row
        flex-wrap nowrap
        .folder-wrap
          display flex
          justify-content stretch
          .folder-box
            width 200px
            border-right 1px solid #eee
            flex 1 1 200px
            display flex
            flex-direction column
            .addFolder
              border-bottom 1px solid #eee
              padding 10px
            .list
              overflow-y auto
              flex 1
    .footer
      min-height 30px
      padding 10px
      background #f8f8f8
      border-top 1px solid #ebeef5
      display flex
      flex-direction row
      justify-content space-between
      .tips
        font-size 16px
        line-height 32px
</style>
