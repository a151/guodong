<template>
  <div class="body-right">
    <el-card>
      <ul class="text">
        <li>添加的用户会收到邀请邮件，通过填写邮箱和默认密码登录，首次登录时需要修改默认密码。</li>
        <li>Excel文件批量导入，需要先下载文件模板（点击下载模板），按照模板填写信息后，上传解析文件即可。</li>
      </ul>
    </el-card>
    <div class="addWay">
      <div class="single">
        <p>方式一：单个添加</p>
        <el-form label-position="right" label-width="70px" size="small">
          <el-form-item label="*公司">
            <el-select v-model="addUser.company" placeholder="请选择" @change="changeCompany">
              <el-option
                v-for="item of companys"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*姓名">
            <el-input  v-model="addUser.name"></el-input>
          </el-form-item>
          <el-form-item label="*邮箱">
            <el-input v-model="addUser.email"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            123456
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="addUser.department" placeholder="请选择" @change="changeDepartment">
              <el-option
                v-for="item of departments"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位">
            <el-select v-model="addUser.post" placeholder="请选择">
              <el-option
                v-for="item of posts"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职级">
            <el-select v-model="addUser.rank" placeholder="请选择">
              <el-option
                v-for="item of ranks"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="addMemberQuick()" type="primary" :loading="btnLoading">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="import">
        <p>方式二：Excel文件批量导入</p>
        <a class="addressBook el-icon-download" href="javascript:;">企业通讯录.csv</a>
        <el-upload
          class="upload-demo"
          :action="api+'/api/Contact/importUser'"
          :on-preview="handlePreview"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :with-credentials="true"
          :on-error="onError"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button class="fileUp" size="small" type="primary" plain>+ 选择文件</el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
export default {
  name: 'addQuick',
  data () {
    return {
      api: process.env.API_ROOT,
      btnLoading: false,
      companys: [],
      departments: [],
      posts: [],
      ranks: [],
      addUser: {
        company: '',
        name: '',
        email: '',
        department: '',
        post: '',
        rank: ''
      },
      fileList: []
    }
  },
  methods: {
    getOrganization () {
      let contactList = this.$store.state.contact.userList
      if (contactList.length) {
        contactList.forEach(data => {
          let company = {}
          Vue.set(company, 'id', data.id)
          Vue.set(company, 'name', data.name)
          this.companys.push(company)
        })
      }
    },
    changeCompany (id) {
      this.emptyData()
      let contactList = this.$store.state.contact.userList
      let company = contactList.filter(com => com.id === id)[0]
      if (company.children.length) {
        company.children.forEach(data => {
          let department = {}
          Vue.set(department, 'id', data.id)
          Vue.set(department, 'name', data.name)
          this.departments.push(department)
        })
      }
      if (company.rank.length) {
        company.rank.forEach(data => {
          let rank = {}
          Vue.set(rank, 'id', data.value)
          Vue.set(rank, 'name', data.label)
          this.ranks.push(rank)
        })
      }
    },
    changeDepartment (id) {
      this.posts = []
      this.addUser.post = ''
      let contactList = this.$store.state.contact.userList
      let company = contactList.filter(com => com.id === this.addUser.company)[0]
      let department = company.children.filter(dep => dep.id === id)[0]
      if (department.postlist.length) {
        department.postlist.forEach(data => {
          let post = {}
          Vue.set(post, 'id', data.id)
          Vue.set(post, 'name', data.name)
          this.posts.push(post)
        })
      }
    },
    emptyData () {
      this.departments = []
      this.posts = []
      this.ranks = []
      this.addUser.department = ''
      this.addUser.post = ''
      this.addUser.rank = ''
    },
    handleRemove (file, fileList) {},
    handlePreview (file) {},
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeUpload (file) {
      let fileName = file.name
      let regex = /(?:csv|xls|xlsx)$/
      let isXls = regex.test(fileName.toLowerCase())
      if (isXls) {
      } else {
        this.$message.error('请选择正确文件格式！上传失败~')
      }
      return isXls
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    onSuccess (response, file, fileList) {
      this.$message.success(response.msg)
    },
    onError (err, file, fileList) {
      this.$message.success(err.msg)
    },
    addMemberQuick () {
      this.btnLoading = true
      let dataUp = {}
      Vue.set(dataUp, 'name', this.addUser.name)
      Vue.set(dataUp, 'email', this.addUser.email)
      Vue.set(dataUp, 'username', this.addUser.name)
      Vue.set(dataUp, 'company_id', this.addUser.company)
      Vue.set(dataUp, 'department_id', this.addUser.department)
      Vue.set(dataUp, 'post_id', this.addUser.post)
      Vue.set(dataUp, 'rank_id', this.addUser.rank)
      axios.post('/api/Contact/editUser', {data: dataUp})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.btnLoading = false
            this.$message({
              showClose: true,
              message: '添加成功！',
              type: 'success'
            })
          } else {
            this.$router.push({path: '/login'})
          }
        })
    },
    /* 邮箱验证 */
    validateEmail (rule, value, callback) {
      if (value === '') {
        callback(new Error('请正确填写邮箱'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (!reg.test(value)) {
            callback(new Error('请输入有效的邮箱'))
          }
        }
        callback()
      }
    }
  },
  mounted () {
    this.getOrganization()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .body-right
    padding 20px
    .text
      li
        margin-left 15px
        line-height 200%
        list-style-type disc
    .addWay
      margin-top 20px
      display flex
      p
        margin-bottom 15px
      .single
        width 350px
      .import
        position relative
        padding-left 120px
        width 40%
        .addressBook
          display: inline-block;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          background: #fff;
          border: 1px solid #dcdfe6;
          color: #606266;
          -webkit-appearance: none;
          text-align: center;
          box-sizing: border-box;
          outline: none;
          margin: 0;
          transition: .1s;
          font-weight: 500;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          padding: 7px 10px;
          font-size: 14px;
          border-radius: 4px;
        .el-icon-download
          position absolute
          left 230px
        .fileUp
          border-radius 33px
</style>
