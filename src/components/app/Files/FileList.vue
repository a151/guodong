<template>
  <div class="body-right" v-loading="loading">
    <div class="content-menu" @contextmenu.prevent>
      <div class="menu-left"></div>
      <div class="menu-center">
        <el-input
          v-model="search"
          size="small"
          icon="search"
          placeholder="搜索"
          suffix-icon="el-icon-search"
          />
      </div>
      <div class="menu-right">
        <el-button size="small" icon="el-icon-folder-add" @click="addFolder">新建文件夹</el-button>
        <el-dropdown>
          <el-button size="small" icon="el-icon-document-add">上传文件</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>上传文件夹</el-dropdown-item>
            <el-dropdown-item>
              <template>
                <el-upload
                  action=""
                  :show-file-list="false"
                  :http-request="uploadFile"
                >
                  上传文件
                </el-upload>
              </template>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="content-container">
      <div class="content">
        <div class="file-list-box">
          <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>全部文件</el-breadcrumb-item>
              <el-breadcrumb-item
                v-for="item of breadcrumb"
                :key="item.id"
              >{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="file-top-btn" v-if="fileSelected.length">
            <el-button type="primary" size="small" @click="fileDown()">下载</el-button>
            <el-button type="primary" size="small" @click="manyMove">移动</el-button>
            <el-button type="primary" size="small" @click="manyCopy">复制</el-button>
            <el-popover
              placement="top"
              width="160"
              v-model="isVisible"
              style="margin-left:11px;"
              @hide="hideVisible">
              <p style="margin-bottom: 10px;">
                <el-select v-model="visibleRange" placeholder="请选择可见范围" size="small">
                  <el-option label="公开：所有人可见" :value="2"></el-option>
                  <el-option label="私有：仅项目成员可见" :value="1"></el-option>
                </el-select>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" @click="isVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="manyVisible">确定</el-button>
              </div>
              <el-button type="primary" size="small" slot="reference" :loading="isVisible">可见范围</el-button>
            </el-popover>
            <el-popover
              placement="top"
              width="160"
              style="margin-left:11px;"
              v-model="isConfirmDel">
              <p style="margin-bottom: 10px;">确定要删除{{operationFileTitle}}吗？删除后不可恢复</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" @click="isConfirmDel = false">取消</el-button>
                <el-button type="primary" size="mini" @click="manyDel">确定</el-button>
              </div>
              <el-button type="primary" size="small" slot="reference" @click="showDelConfirm" :loading="isConfirmDel">删除</el-button>
            </el-popover>
          </div>
          <el-table
            :data="files"
            style="width: 100%"
            ref="fileListTable"
            @cell-dblclick="rowDblclick"
            @selection-change="selsChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column
              label="文件名"
              min-width="300">
              <template slot-scope="scope">
                <span v-if="!scope.row.isRename">{{scope.row.name}}</span>
                <el-input v-model="rename" size="small" ref="rename" v-else placeholder="请输入文件名" @blur="doRename(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="size"
              label="大小"
              width="100">
            </el-table-column>
            <el-table-column
              prop="creator"
              label="创建者"
              width="100">
            </el-table-column>
            <el-table-column
              prop="update_time"
              label="更新时间"
              width="160">
            </el-table-column>
            <el-table-column label="操作" width="170">
              <template slot-scope="scope">
                <el-button plain type="primary" size="mini" icon="icon-down" title="下载" @click="fileDown(scope.row.id)"></el-button>
                <el-button plain type="primary" size="mini" icon="icon-edit-pencil" title="重命名" v-if="scope.row.type === 'folder'" @click="fileRename(scope.row)" style="margin-left: 0;"></el-button>
                <el-upload
                  action=""
                  :show-file-list="false"
                  :http-request="updataFile"
                  :data="{id: scope.row.id}"
                  v-else
                  class="updata-file"
                >
                  <el-button plain type="primary" size="mini" icon="icon-upload" title="更新"></el-button>
                </el-upload>
                <el-dropdown trigger="click">
                  <el-button plain type="primary" size="mini" icon="icon-ellipsis-row"></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="copyLink(scope.row)">复制链接</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.type === 'file'" @click.native="fileRename(scope.row)">重命名</el-dropdown-item>
                    <el-dropdown-item @click.native="fileMove(scope.row)">移动</el-dropdown-item>
                    <el-dropdown-item @click.native="fileCopy(scope.row)">复制</el-dropdown-item>
                    <el-dropdown-item @click.native="fileDel(scope.row)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            :visible="showCopyBox"
            :modal-append-to-body="false"
            :show-close="false"
            width="450px"
            style="position: absolute;"
          >
            <el-form label-width="80px">
              <el-form-item label="复制内容" style="margin-bottom: 0;">
                <el-input v-model="copyContent"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button size="small" @click="showCopyBox = false">取 消</el-button>
              <el-button size="small" type="primary" v-clipboard:copy="copyContent" v-clipboard:success="copySucc" v-clipboard:error="copyErro">复 制</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'FileList',
  props: {
    filesList: Array,
    breadcrumb: Array,
    project_id: [String, Number]
  },
  data () {
    return {
      loading: false,
      breadcrumbs: [],
      files: [],
      fileSelected: [],
      search: '',
      searchResult: [],
      isConfirmDel: false,
      isVisible: false,
      operationFileTitle: '',
      pid: NaN,
      visibleRange: '',
      rename: '',
      copyContent: '',
      showCopyBox: false
    }
  },
  methods: {
    // 文件下载
    fileDown (id) {
      let selectInfo = this.getSelectedFile()
      let ids = id ? [id] : [...selectInfo.ids]
      this.$axios.post('/api/file/downFile', {ids: ids})
        .then(res => {
          let data = res.data
          if (data.ret) {
            window.open(data.data.url)
          }
        })
    },
    // 新建文件夹
    addFolder () {
      this.$emit('addFolder')
    },
    rowDblclick (row, column, cell, event) {
      if (!cell.querySelector('button') && !cell.querySelector('input')) { // 排除复选框和按钮列的双击
        if (row.type === 'file') { // 双击文件行
          let obj = {}
          obj.id = row.id
          obj.data = row
          obj.appId = 'fileDetails' + row.id
          obj.title = '文件详情'
          obj.name = 'Files' // 文件夹名
          obj.components = 'fileDetails' // 组件名
          this.$store.commit('desktop/openApp', obj)
        } else { // 双击夹文件行
          this.$emit('reloadFiles', row.id)
        }
      }
    },
    // 上传文件
    uploadFile (file) {
      this.$emit('uploadFile', file)
    },
    // 获取选中的文件
    selsChange (selection) {
      this.fileSelected = [...selection]
    },
    // 多文件(夹)移动
    manyMove () {
      let selectInfo = this.getSelectedFile()
      let desc = '移动' + this.operationFileTitle + '至'
      this.filesMove(selectInfo.ids, 'move', desc)
    },
    // 多文件(夹)复制
    manyCopy () {
      let selectInfo = this.getSelectedFile()
      let desc = '复制' + this.operationFileTitle + '至'
      this.filesMove(selectInfo.ids, 'copy', desc)
    },
    // 多文件(夹)修改可见范围
    manyVisible () {
      if (this.visibleRange) {
        let val = this.visibleRange
        let selectInfo = this.getSelectedFile()
        this.loading = true
        this.isVisible = false
        this.$axios.post('/api/file/editRange', {ids: selectInfo.ids, visible_range: val})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$message(data.msg)
              this.$refs.fileListTable.clearSelection()
              this.fileSelected = []
              this.loading = false
            }
          })
      }
    },
    // 多文件(夹)删除
    manyDel () {
      this.loading = true
      this.isConfirmDel = false
      let selectInfo = this.getSelectedFile()
      this.$axios.post('/api/file/deleteFile', {ids: selectInfo.ids})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.$message(data.msg)
            this.$emit('reloadFiles')
          }
        })
    },
    // 文件(夹)重命名
    fileRename (row) {
      if (row.type === 'folder') {
        this.rename = row.name
      } else {
        let index = row.name.lastIndexOf('.')
        this.rename = row.name.substr(0, index)
      }
      let target = this.files.filter(file => file.id === row.id)[0]
      Vue.set(target, 'isRename', true)
      this.$nextTick(() => {
        this.$refs.rename.$el.querySelector('input').focus()
      })
    },
    // 编辑框失去焦点保存
    doRename (row) {
      let name = row.type === 'folder' ? this.rename : this.rename + '.' + row.suffix.toLowerCase()
      if (this.rename && name !== row.name) {
        this.$axios.post('/api/file/fileRename', {id: row.id, name: this.rename})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$emit('reloadFiles')
            }
          })
      } else {
        let target = this.files.filter(file => file.id === row.id)[0]
        Vue.set(target, 'isRename', '')
      }
    },
    // 更新文件
    updataFile (file) {
      this.$emit('updataFile', file)
    },
    // 单文件(夹)复制链接
    copyLink (row) {
      this.$axios.post('/api/file/share', {id: row.id})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.copyContent = data.data.url
            this.showCopyBox = true
          }
        })
    },
    // 复制成功
    copySucc () {
      this.$message('复制成功')
      this.showCopyBox = false
    },
    // 复制失败
    copyErro () {
      this.$message('浏览器不支持，请手动选择复制')
    },
    // 单文件(夹)移动
    fileMove (row) {
      let ids = [row.id]
      let type = row.type === 'file' ? '文件' : '文件夹'
      let desc = '移动' + type + ' “' + row.name + '” 至'
      this.filesMove(ids, 'move', desc)
    },
    // 单文件(夹)复制
    fileCopy (row) {
      let ids = [row.id]
      let type = row.type === 'file' ? '文件' : '文件夹'
      let desc = '复制' + type + ' “' + row.name + '” 至'
      this.filesMove(ids, 'copy', desc)
    },
    // 单文件(夹)删除
    fileDel (row) {
      this.$confirm('确定要删除 “' + row.name + '” 吗，删除后不可恢复').then(() => {
        this.loading = true
        this.$axios.post('/api/file/deleteFile', {ids: [row.id]})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$message(data.msg)
              this.$emit('reloadFiles')
            }
          })
      }).catch(() => {})
    },
    // 打开文件移动窗口
    filesMove (ids, operation, desc) {
      let obj = {}
      obj.ids = ids
      obj.desc = desc
      obj.operation = operation
      obj.appId = 'fileMove'
      obj.title = operation === 'move' ? '移动文件' : '复制文件'
      obj.name = 'Files'
      obj.components = 'filesMove'
      this.$store.commit('desktop/openApp', obj)
    },
    // 获得文件选中信息
    getSelectedFile () {
      let result = {}
      let folderNum = 0
      let fileNum = 0
      let ids = []
      this.fileSelected.forEach(file => {
        if (file.type === 'folder') {
          folderNum++
        } else if (file.type === 'file') {
          fileNum++
        }
        ids.push(file.id)
      })
      result.ids = ids
      this.operationFileTitle = folderNum ? fileNum ? folderNum + '个文件夹和' + fileNum + '文件' : folderNum + '个文件夹' : fileNum + '个文件'
      return result
    },
    // 弹出删除确认框
    showDelConfirm () {
      this.getSelectedFile()
    },
    // 隐藏可见范围置空选中值
    hideVisible () {
      this.visibleRange = ''
    }
  },
  watch: {
    filesList (val) {
      this.files = [...val]
      this.search = ''
      this.fileSelected = []
    },
    search (val) {
      this.$refs.fileListTable.clearSelection()
      this.files = this.filesList.filter(data => !val || data.name.toLowerCase().includes(val.toLowerCase()))
    }
  },
  mounted () {}
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .breadcrumb
    padding 15px 14px 5px
    cursor pointer
  .file-top-btn
    padding 5px 14px
  .updata-file
    display inline-block
</style>
