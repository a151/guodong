<template>
  <div class="body-right">
    <div class="content-menu" @contextmenu.prevent>
      <el-button v-if="!isEidt && !isEmpty" @click="editUser" type="primary" plain>编辑</el-button>
    </div>
    <div class="content-container">
      <div class="content">
        <div class="file-list-box">
          <div class="user-content">
            <div class="urser-info">
              <el-form label-position="right" label-width="70px" v-if="!isEidt && !isEmpty" size="mini">
                <el-form-item label="头像">
                  <img :src="userInfo.head_img" />
                </el-form-item>
                <el-form-item label="姓名">
                  {{userInfo.name}}
                </el-form-item>
                <el-form-item label="员工编号">
                  {{userInfo.number}}
                </el-form-item>
                <el-form-item label="性别">
                  {{userInfo.sex ? '女' : '男'}}
                </el-form-item>
                <el-form-item label="部门">
                  {{userInfo.department}}
                </el-form-item>
                <el-form-item label="岗位">
                  {{userInfo.post}}
                </el-form-item>
                <el-form-item label="职级">
                  {{userInfo.rank}}
                </el-form-item>
                <el-form-item label="邮箱">
                  {{userInfo.email}}
                </el-form-item>
                <el-form-item label="电话">
                  {{userInfo.phone}}
                </el-form-item>
                <el-form-item label="个性签名">
                  {{userInfo.signature}}
                </el-form-item>
                <el-form-item label="在职状态">
                  {{userInfo.is_work===0?'离职' : userInfo.is_work === 1 ? '在职' : '禁用' }}
                </el-form-item>
              </el-form>
              <el-form :model="editInfo" label-width="80px" label-position="right" v-if="isEidt && !isEmpty" size="small">
                <el-form-item label="头像">
                  <!--<img :src="editInfo.head_img" />-->
                  <el-upload
                    class="avatar-uploader"
                    action=""
                    :show-file-list="false"
                    :http-request="imgPreview">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="姓名">
                  <el-input v-model="editInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="员工编号">
                  <el-input v-model="editInfo.number"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio v-model="editInfo.sex" :label="0">男</el-radio>
                  <el-radio v-model="editInfo.sex" :label="1">女</el-radio>
                </el-form-item>
                <el-form-item label="部门/岗位">
                  <el-cascader
                    :options="post"
                    v-model="selectedPost"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="职级">
                  <el-cascader
                    :options="rank"
                    v-model="selectedRank"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="电话">
                  <el-input v-model="editInfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="在职状态">
                  <el-radio-group v-model="editInfo.is_work" size="mini">
                    <el-radio-button label="0" >离职</el-radio-button>
                    <el-radio-button label="1" >在职</el-radio-button>
                    <el-radio-button label="2" >禁用</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button @click="cancelEdit" :disabled="btnLoading">取消</el-button>
                  <el-button @click="determineEdit" type="primary" :loading="btnLoading">确定</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="empty" v-if="isEmpty">
              <img src="~images/empty.png" />
              <p>请选择左侧成员</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
export default {
  name: 'ContactContent',
  props: {
    user: Object,
    post: Array,
    rank: Array,
    show: Boolean
  },
  data () {
    return {
      isEidt: false,
      isEmpty: true,
      btnLoading: false,
      imageUrl: '',
      ext: '',
      userInfo: {},
      editInfo: {},
      selectedPost: [],
      selectedRank: []
    }
  },
  methods: {
    urlToBase64 (url) {
      return new Promise((resolve, reject) => {
        let image = new Image()
        image.onload = function () {
          let canvas = document.createElement('canvas')
          canvas.width = this.naturalWidth
          canvas.height = this.naturalHeight
          // 将图片插入画布并开始绘制
          canvas.getContext('2d').drawImage(image, 0, 0)
          // result
          let result = canvas.toDataURL('image/png')
          resolve(result)
        }
        // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
        image.setAttribute('crossOrigin', 'Anonymous')
        image.src = url
        // 图片加载失败的错误处理
        image.onerror = () => {
          reject(new Error('图片流异常'))
        }
      })
    },
    editUser () {
      if (!this.isEidt) {
        this.isEidt = true
        this.editInfo = {...this.userInfo}
        this.imageUrl = this.editInfo.head_img
      }
    },
    cancelEdit () {
      this.isEidt = false
      this.editInfo = {...this.userInfo}
      this.setHierarchy()
    },
    determineEdit () {
      this.btnLoading = true
      let dataUp = {}
      Vue.set(dataUp, 'head_img', this.imageUrl)
      Vue.set(dataUp, 'ext', this.ext)
      Vue.set(dataUp, 'id', this.editInfo.id)
      Vue.set(dataUp, 'name', this.editInfo.name)
      Vue.set(dataUp, 'username', this.editInfo.username)
      Vue.set(dataUp, 'company_id', this.editInfo.company_id)
      Vue.set(dataUp, 'department_id', this.selectedPost[0])
      Vue.set(dataUp, 'post_id', this.selectedPost[1])
      Vue.set(dataUp, 'sex', this.editInfo.sex)
      Vue.set(dataUp, 'email', this.editInfo.email)
      Vue.set(dataUp, 'phone', this.editInfo.phone)
      Vue.set(dataUp, 'number', this.editInfo.number)
      Vue.set(dataUp, 'signature', this.editInfo.signature)
      Vue.set(dataUp, 'rank_id', this.selectedRank[0])
      Vue.set(dataUp, 'is_work', parseInt(this.editInfo.is_work))
      let department = this.post.filter(department => department.value === this.selectedPost[0])[0] // 所属部门
      let post = department.children.filter(post => post.value === this.selectedPost[1])[0] // 所属岗位
      let position = this.rank.filter(position => position.value === this.selectedRank[0])[0] // 所属职级
      this.editInfo.label = this.editInfo.name
      this.editInfo.department = department.label
      this.editInfo.post = post.label
      this.editInfo.rank = position.label
      this.editInfo.rank = position.label
      axios.post('/api/Contact/editUser', {data: dataUp})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.btnLoading = false
            this.isEidt = false
            this.userInfo = {...this.editInfo}
            this.userInfo.department_id = dataUp.department_id
            this.userInfo.post_id = dataUp.post_id
            this.userInfo.rank_id = dataUp.rank_id
            this.userInfo.head_img = dataUp.head_img
            this.userInfo.is_work = parseInt(this.editInfo.is_work)
            this.getChildData()
          } else {
            this.$router.push({path: '/login'})
          }
        })
    },
    getChildData () {
      let lists
      lists = this.$store.state.contact.userList
      let editList = lists.filter(compony => compony.id === this.userInfo.company_id)[0].children.filter(pos => pos.company_id === this.userInfo.department_id)[0].children.filter(p => p.id === this.userInfo.id)[0]
      editList.name = this.userInfo.name
      editList.label = this.userInfo.label
      editList.department = this.userInfo.department
      editList.post = this.userInfo.post
      editList.rank = this.userInfo.rank
      editList.username = this.userInfo.username
      editList.department_id = this.userInfo.department_id
      editList.post_id = this.userInfo.post_id
      editList.company_id = this.userInfo.company_id
      editList.sex = this.userInfo.sex
      editList.email = this.userInfo.email
      editList.phone = this.userInfo.phone
      editList.number = this.userInfo.number
      editList.signature = this.userInfo.signature
      editList.rank_id = this.userInfo.rank_id
      editList.is_work = this.userInfo.is_work
      this.$store.commit('contact/initList', lists)
    },
    setHierarchy () {
      this.selectedPost = []
      this.selectedPost.push(this.user.department_id)
      this.selectedPost.push(this.user.post_id)
      this.selectedRank = []
      this.selectedRank.push(this.user.rank_id)
    },
    imgPreview (file) {
      let fileName = file.file.name
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/
      if (regex.test(fileName.toLowerCase())) {
        let urlLink = URL.createObjectURL(file.file)
        this.ext = file.file.name
        this.urlToBase64(urlLink).then(res => {
          // 转化后的base64图片地址
          this.imageUrl = res
        })
      } else {
        this.$message.error('请选择图片文件')
      }
    }
  },
  watch: {
    user (val) {
      this.isEmpty = false
      this.isEidt = false
      this.userInfo = {...val}
      this.setHierarchy()
    }
  },
  mounted () {}
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .user-content
    .urser-info
      img
        width 50px
        height 50px
    .el-upload
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    .el-upload:hover
      border-color: #409EFF;
    .avatar-uploader-icon
      border: 1px dashed #d9d9d9;
      font-size: 28px;
      color: #8c939d;
      width: 78px;
      height: 78px;
      line-height: 78px;
      text-align: center;
    .avatar
      width: 78px;
      height: 78px;
      display: block;
    padding 15px
    empty()
</style>
