<template>
  <div>
    <file-details-popup
      :appId="data.appId"
      :zIndex="data.zIndex"
      :width="1000"
    >
      <template #name>{{data.title}}</template>
      <template #body-right>
        <div class="file" v-loading="loading">
          <div class="head">
            <div class="name">{{currentVersion.name}}</div>
            <div class="btns">
              <el-upload
                action=""
                :show-file-list="false"
                :http-request="updataFile"
                :data="{id: data.data.id}"
                class="updata-file"
              >
                <el-button size="small" icon="icon-upload">更新版本</el-button>
              </el-upload>
              <el-button size="small" icon="icon-down" style="margin-left: 0;" @click="fileDown">下载</el-button>
              <el-dropdown @command="fileOperation">
                <el-button size="small" icon="icon-ellipsis-row">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="copyLink" @click.native="copyLink(data.id)">复制链接</el-dropdown-item>
                  <el-dropdown-item command="rename">重命名</el-dropdown-item>
                  <el-dropdown-item command="move" @click.native="fileMove">移动</el-dropdown-item>
                  <el-dropdown-item command="copy" @click.native="fileCopy">复制</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="body">
            <div class="left">
              <div class="preview">
                <iframe class="" :src="previewSrc" width="100%" height="100%" v-if="previewTool === 'iframe'"></iframe>
                <img :src="previewSrc" v-if="previewTool === 'img'" />
                <div class="noPreview" v-if="previewTool === 'other'">
                  <img src="~images/empty.png" />
                  <p>暂无预览</p>
                </div>
              </div>
              <div class="info">
                {{currentVersion.suffix}}<span>·</span>
                {{currentVersion.size}}<span>·</span>
                {{currentVersion.name}}
              </div>
            </div>
            <div class="right">
              <el-form label-width="80px">
                <el-form-item label="备注">
                  <el-button type="text" size="small" icon="icon-add-big" v-if="!editorOldContent" v-show="!remarkAdding" @click="eidtRemark">添加</el-button>
                  <el-button type="text" size="small" icon="icon-edit-pencil" v-else v-show="!remarkAdding" @click="eidtRemark">修改</el-button>
                </el-form-item>
                <el-form-item v-show="!remarkAdding && editorOldContent">
                  <div v-html="editorOldContent"></div>
                </el-form-item>
              </el-form>
              <div v-show="remarkAdding">
                <quill-editor
                  v-model="editorContent"
                  ref="myQuillEditor"
                  :options="editorOption">
                </quill-editor>
                <div class="editor-btn">
                  <el-button size="small" @click="cancelEidtRemark" :disabled="doingEidtRemark">取消</el-button>
                  <el-button type="primary" size="small" @click="doEidtRemark" :loading="doingEidtRemark">保存</el-button>
                </div>
              </div>
              <el-form label-width="80px">
                <el-form-item label="版本信息">
                  <el-button type="text" @click="versionShowAll" v-show="!isVersionShowAll">查看全部</el-button>
                </el-form-item>
              </el-form>
              <ul :class="['version-list', isVersionShowAll ? 'show-all' : 'unshow-all']">
                <li
                  v-for="item of versionList"
                  :key="item.id"
                  :class="{'current': item.id === currentVersion.id}"
                  @click="chooseVersion(item)"
                  >
                  <span>No.{{item.vision}}</span>
                  <span>{{item.creator}}</span>
                  <span>{{item.id === item.own_id ? '上传于' + item.create_time : '更新于' + item.create_time}}</span>
                </li>
              </ul>
              <el-form label-width="80px">
                <el-form-item label="参与者">
                  <el-tag
                    v-for="tag of members"
                    :key="tag.id"
                    closable
                    :disable-transitions="false"
                    @close="delMembers(tag.id)">
                    {{tag.name}}
                  </el-tag>
                  <el-popover
                    placement="right"
                    width="240"
                    trigger="click"
                    @hide="saveEdit('members', members)">
                    <el-tree
                      :data="userList"
                      show-checkbox
                      node-key="tree_id"
                      default-expand-all
                      :style="{height: '300px', overflowY: 'auto'}"
                      :default-checked-keys="membersId"
                      :props="props"
                      ref="userListTree"
                      @check-change="getMembers">
                    </el-tree>
                    <el-button slot="reference" icon="el-icon-plus" circle></el-button>
                  </el-popover>
                </el-form-item>
                <el-form-item label="可见范围">
                  <el-select v-model="visibleRange" placeholder="请选择可见范围" size="small" @change="visibleRangeChange">
                    <el-option label="公开：所有人可见" :value="2"></el-option>
                    <el-option label="私有：仅项目成员可见" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
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
      </template>
    </file-details-popup>
  </div>
</template>

<script>
import fileDetailsPopup from '@/components/common/window/Popup'
import Vue from 'vue'
export default {
  name: 'fileDetails',
  props: {
    data: Object
  },
  data () {
    return {
      loading: true, // 页面加载
      previewTool: '',
      previewSrc: '',
      remarkAdding: false, // 是否正在编辑备注
      editorContent: '', // 备注编辑框双向绑定值
      editorOldContent: '', // 存储备注编辑前的内容
      doingEidtRemark: false, // 是否正在提交备注编辑内容
      versionList: [], // 版本列表
      currentVersion: {}, // 当前版本信息
      members: [], // 参与者
      membersId: [], // 已选中参与者(用户树使用)
      membersIds: [], // 已选中参与者(用户树使用)
      userList: [], // 通讯录人员列表
      visibleRange: NaN, // 可见范围
      isVersionShowAll: false, // 是否显示全部版本
      copyContent: '', // 复制的内容
      showCopyBox: false, // 显示复制框
      props: { // 通讯录树配置
        label: 'name',
        isLeaf: 'leaf'
      },
      editorOption: { // 备注富文本配置
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'], // 加粗，斜体，下划线
            [{'color': []}, 'link'], // 字体颜色，链接
            [{'list': 'ordered'}, { 'list': 'bullet' }, {'align': []}], // 列表、对齐方式
            ['image'] // 上传图片
          ]
        }
      }
    }
  },
  components: {
    fileDetailsPopup
  },
  methods: {
    // 获取文件信息
    getFileData () {
      let id = this.data.data.id
      this.$axios.post('/api/file/fileDetail', {id: id})
        .then(res => {
          this.loading = false
          let data = res.data
          if (data.ret) {
            this.versionPreview(this.currentVersion) // 预览区
            this.editorContent = data.data.remark
            this.editorOldContent = data.data.remark
            this.versionList = data.data.visionList // 版本列表
            console.log(this.versionList)
            this.currentVersion = data.data.visionList[0] // 默认当前版本为最新上传的版本
            Vue.set(this.currentVersion, 'suffix', this.currentVersion.suffix.toUpperCase()) // 后缀转为大写
            this.visibleRange = data.data.visible_range // 可见范围
            // 默认选中的参与者
            let members = JSON.parse(data.data.members)
            if (members) {
              let mid = []
              this.members = members
              members.forEach(mem => {
                mid.push('u' + mem.id)
              })
              this.membersId = mid
            }
          }
        })
    },
    // 更新版本
    updataFile (file) {
      this.$bus.emit('updataFile', file)
    },
    fileDown () {
      let ids = [this.currentVersion.id]
      this.$axios.post('/api/file/downFile', {ids: ids})
        .then(res => {
          let data = res.data
          if (data.ret) {
            window.open(data.data.url)
          }
        })
    },
    // 复制链接
    copyLink (id) {
      this.$axios.post('/api/file/share', {id: id})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.copyContent = data.data.url
            this.showCopyBox = true
          } else {
            // this.$router.push({path: '/login'})
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
    // 文件移动
    fileMove () {},
    // 文件移动
    fileCopy () {},
    // 根据版本选择预览方式
    versionPreview (version) {
      switch (version.ext) {
        case 'pdf':
          this.previewTool = 'iframe'
          this.previewSrc = version.dir
          break
        case 'img':
          this.previewTool = 'img'
          this.previewSrc = version.dir
          break
        default:
          this.previewTool = 'other'
          this.previewSrc = ''
          break
      }
    },
    // 通讯录各级添加tree_id
    initUserList () {
      let userList = this.$store.state.contact.userList
      this.userList = [...userList]
    },
    // 通讯录树选择后动作
    getMembers () {
      let checkedMembers = this.$refs.userListTree.getCheckedNodes(true)
      this.members = []
      this.membersId = []
      if (checkedMembers.length) {
        checkedMembers.forEach(cMem => {
          if (cMem.leaf) {
            let mem = {}
            mem.id = cMem.id
            mem.name = cMem.name
            this.members.push(mem)
            this.membersId.push('u' + cMem.id)
          }
        })
      }
    },
    // 文件操作
    fileOperation () {},
    // 编辑备注
    eidtRemark () {
      this.remarkAdding = true
    },
    // 取消编辑
    cancelEidtRemark () {
      this.editorContent = this.editorOldContent
      this.remarkAdding = false
    },
    // 提交备注修改
    doEidtRemark () {
      let content = this.editorContent
      let oldContent = this.editorOldContent
      if (content === oldContent) {
        this.remarkAdding = false
      } else {
        this.saveEdit('remark', this.editorContent)
      }
    },
    // 保存修改
    saveEdit (item, content) {
      this.loading = true
      let fileId = this.data.data.id
      if (item === 'remark') {
        this.doingEidtRemark = true
      }
      this.$axios.post('/api/file/fileUpdate', {item: item, content: content, file_id: fileId})
        .then(res => {
          this.loading = false
          let data = res.data
          if (data.ret) {
            if (item === 'remark') {
              this.editorOldContent = this.editorContent
              this.remarkAdding = false
              this.doingEidtRemark = false
            }
            this.$message(data.msg)
          } else {
            // this.$router.push({path: '/login'})
          }
        })
    },
    // 显示所有版本
    versionShowAll () {
      this.isVersionShowAll = true
    },
    // 选择版本
    chooseVersion (versionInfo) {
      Vue.set(versionInfo, 'suffix', versionInfo.suffix.toUpperCase()) // 后缀转为大写
      this.currentVersion = versionInfo
      this.versionPreview(versionInfo)
    },
    // 点击标签删除按钮，删除对应参与者
    delMembers (id) {
      let uIndex = this.membersId.indexOf('u' + id)
      let index = this.members.indexOf(this.members.filter(user => user.id === id)[0])
      this.members.splice(index, 1)
      this.membersId.splice(uIndex, 1)
      this.$refs.userListTree.setCheckedKeys(this.membersId)
      this.saveEdit('members', this.members)
    },
    // 选择可见范围
    visibleRangeChange (val) {
      this.saveEdit('fileVisible', val)
    }
  },
  mounted () {
    this.getFileData()
    this.initUserList()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  .el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom 10px
  }
  .file
    width 100%
    height 100%
    background #FFF
    display flex
    flex-direction column
    .head
      min-height 30px
      padding 10px
      background #f8f8f8
      border-bottom 1px solid #ebeef5
      flex none
      display flex
      flex-direction row
      justify-content space-between
      .name
        line-height 30px
      .updata-file
        display inline-block
    .body
      overflow hidden
      flex 1
      display flex
      flex-direction row
      .left
        padding 20px
        box-shadow 1px 0px 0px #E6E6E6
        flex 1
        display flex
        flex-direction column
        .preview
          text-align center
          overflow-y auto
          flex 1
          iframe
            overflow auto
            border 0px
          img
            max-width 100%
        .info
          margin-top 20px
          text-align center
          flex none
          span
            margin 0 8px
      .right
        width 380px
        padding 20px
        overflow-y auto
        flex none
        .editor-btn
          margin-top 15px
          text-align right
        .version-list
          margin-bottom 20px
          border-bottom 1px solid #CCCCCC
          cursor default
          &.unshow-all
            max-height 102px
            overflow hidden
          &.show-all
            max-height 170px
            overflow-y auto
          li
            line-height 34px
            span
              margin 0 10px
              &:last-of-type
                float right
            &.current
              background #F2F2F2
</style>
