<template>
  <div>
    <create-pop
      :appId="data.appId"
      :zIndex="data.zIndex"
      :width="460"
      :height="320"
      :close="close"
      :childWin="true"
    >
      <template #name>{{data.title}}</template>
      <template #body-right>
        <div class="create-box">
          <div class="create-content">
            <el-form label-width="80px" size="small">
              <el-form-item label="项目名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="项目详情">
                <el-input type="textarea" v-model="form.desc"></el-input>
              </el-form-item>
              <el-form-item label="可见范围">
                <el-select v-model="form.type" placeholder="请选择可见范围">
                  <el-option label="公开：所有人可见，仅项目成员可编辑项目" value="2"></el-option>
                  <el-option label="私有：仅项目成员可见" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="closeWin">取消</el-button>
                <el-button type="primary" @click="doCreate" :loading="buttonBool">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>
    </create-pop>
  </div>
</template>

<script>
// import Vue from 'vue'
import axios from 'axios'
import createPop from '@/components/common/window/Popup'
export default {
  name: 'projectCreate',
  props: {
    data: Object
  },
  data () {
    return {
      form: {
        name: '',
        desc: '',
        type: '',
        members: []
      },
      close: false,
      loading: false,
      dataArray: '',
      dataObj: {},
      buttonBool: false
    }
  },
  components: {
    createPop
  },
  methods: {
    closeWin () {
      this.close = true
    },
    doCreate () {
      let userid = localStorage.userid
      if (this.form.name === '') {
        this.$alert('项目名称不能为空！')
      } else if (this.form.type === '') {
        this.$alert('请选择可见范围！')
      } else {
        this.buttonBool = true
        this.loading = true
        axios.post('/api/project/projectAdd', {name: this.form.name, description: this.form.desc, type: this.form.type, user_id: userid})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.loading = false
              this.buttonBool = false
              this.dataArray = this.$store.state.project.projectList
              this.dataObj.name = this.form.name
              this.dataObj.description = this.form.desc
              this.dataObj.type = this.form.type
              this.dataObj.username = this.form.type
              this.dataObj.id = JSON.parse(data.data.id)
              this.dataArray.push(this.dataObj)
              this.$store.commit('project/initList', this.dataArray)
              this.$message('提交创建')
              this.close = true
            } else {
              this.$alert(data.data.msg)
            }
          })
      }
    }
  },
  mounted () {}
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .create-box
    width 100%
    max-height 100%
    background #FFF
    padding 20px
    overflow-y auto
</style>
