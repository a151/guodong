<template>
  <div>
    <file-Popup
        :appId="data.appId"
        :zIndex="data.zIndex"
        :resize="true"
        :width="1120"
      >
      <template #name>{{data.title}}</template>
      <template #body-left>
        <div class="body-left" @contextmenu.prevent>
          <ul class="left-menu" v-loading="projectLoading">
            <li
              v-for="item of projectList"
              :key="item.id"
              :class="['project-list', {'this': item.id === current}]"
              @click="projectClick(item.id)"
            >
              {{item.name}}
            </li>
          </ul>
        </div>
      </template>
      <template #body-right>
        <keep-alive>
          <file-content
            v-loading="listLoading"
            :filesList="filesList"
            :breadcrumb="breadcrumb"
            :project_id="current"
            @reloadFiles="reloadFiles"
            @addFolder="addFolder"
            @uploadFile="uploadFile"
            @updataFile="updataFile"
            ref="filesList"
           ></file-content>
        </keep-alive>
      </template>
    </file-Popup>
  </div>
</template>

<script>
import FilePopup from '@/components/common/window/Popup'
import FileContent from './FileList'
export default {
  name: 'Projects',
  props: {
    data: Object
  },
  data () {
    return {
      projectList: [],
      current: '',
      currentFolderId: '',
      filesList: [],
      breadcrumb: [],
      projectLoading: true,
      listLoading: true
    }
  },
  components: {
    FilePopup,
    FileContent
  },
  methods: {
    getProjectsData () {
      this.$axios.post('/api/file/index')
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.projectList = data.data
            this.current = data.data[0].id
            this.getFilesData(this.current)
            this.projectLoading = false
          } else {
            // this.$router.push({path: '/login'})
          }
        })
    },
    getFilesData (id) {
      this.listLoading = true
      this.$axios.post('/api/file/getRootFile', {project_id: id})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.listLoading = false
            this.currentFolderId = ''
            this.current = id
            this.filesList = [...data.data]
            console.log(data)
          }
        })
    },
    projectClick (id) {
      if (id !== this.current || this.currentFolderId) {
        this.getFilesData(id)
      }
    },
    // 重载文件表格数据
    reloadFiles (id) {
      this.listLoading = true
      if (id) {
        this.currentFolderId = id
      }
      if (this.currentFolderId) {
        this.$axios.post('/api/file/getChildFiles', {project_id: this.current, pid: this.currentFolderId})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.listLoading = false
              this.filesList = [...data.data.filelist]
            }
          })
      } else {
        this.getFilesData(this.current)
      }
    },
    // 新建文件夹
    addFolder () {
      this.$prompt('', '新建文件夹', {
        showClose: false,
        inputPlaceholder: '文件夹名称',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        this.listLoading = true
        this.$axios.post('/api/file/createFolder', {project_id: this.current, pid: this.currentFolderId, name: value})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.reloadFiles()
            }
          })
      }).catch(() => {})
    },
    // 上传文件
    uploadFile (file) {
      this.listLoading = true
      let _file = new FormData()
      _file.append('file', file.file)
      _file.append('pid', this.currentFolderId)
      _file.append('project_id', this.current)
      this.$axios.post('/api/file/uploadFile', _file)
        .then(res => {
          if (res.data.ret) {
            this.reloadFiles()
          }
        })
    },
    // 更新文件
    updataFile (file) {
      this.listLoading = true
      let _file = new FormData()
      _file.append('file', file.file)
      _file.append('id', file.data.id)
      this.$axios.post('/api/file/updateFile', _file)
        .then(res => {
          if (res.data.ret) {
            this.reloadFiles()
          }
        })
    }
  },
  created () {
    this.$bus.on('updataFile', file => {
      this.updataFile(file)
    })
  },
  beforeDestroy () {
    this.$bus.off('updataFile')
  },
  mounted () {
    this.getProjectsData()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .body-left >>> .left-menu li
    text-indent 20px!important
  .body-left
    leftMenu1()
</style>
