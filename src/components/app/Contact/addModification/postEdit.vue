<template>
  <div>
    <set-pop
      :appId="data.appId"
      :zIndex="data.zIndex"
      :width="460"
      :height="360"
      :childWin="true"
    >
      <template #name>{{data.title}}</template>
      <template #body-right>
        <div class="set-content">
          <el-form label-width="70px">
            <el-form-item label="岗位名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="所属公司">
              <el-cascader
                :options="company"
                v-model="selectedOptions"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="form.sort"></el-input>
            </el-form-item>
            <el-form-item label="状态" v-if="$store.state.contact.infomationData.infoJudge === 'edit'">
              <el-select v-model="form.status" placeholder="状态">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="editCompanyNameBtn">
                <el-button type="primary " @click="infDetermina" :loading="btnLoading">确定</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </set-pop>
  </div>
</template>

<script>
import setPop from '@/components/common/window/Popup'
import axios from 'axios'
import Vue from 'vue'
export default {
  name: 'postEdit',
  props: {
    data: Object
  },
  data () {
    return {
      company: [],
      form: {
        id: '',
        name: '',
        sort: '',
        selectedPost: '请选择',
        status: 0
      },
      options: [{
        value: 0,
        label: '正常'
      }, {
        value: 1,
        label: '禁用'
      }],
      btnLoading: false,
      selectedOptions: []
    }
  },
  components: {
    setPop
  },
  methods: {
    getUserList () {
      let userid = localStorage.userid
      axios.post('/api/contact/index', {user_id: userid})
        .then(res => {
          let data = res.data
          if (data.ret && data.data) {
            data.data.reverse().reverse()
            this.$store.commit('contact/initList', data.data)
          } else {
            this.$alert(data.msg)
          }
        })
    },
    getOptionList () {
      let userLIst = this.$store.state.contact.userList
      userLIst.forEach(data => {
        let company = {}
        Vue.set(company, 'value', data.id)
        Vue.set(company, 'name', data.name)
        Vue.set(company, 'label', data.name)
        Vue.set(company, 'status', data.status)
        let children = []
        data.children.forEach(data => {
          let post = {}
          Vue.set(post, 'value', data.id)
          Vue.set(post, 'name', data.name)
          Vue.set(post, 'label', data.name)
          children.push(post)
        })
        Vue.set(company, 'children', children)
        this.company.push(company)
      })
    },
    determineEdit () {
      this.btnLoading = true
      let editStatus = this.$store.state.contact.infomationData.infoJudge
      let data = {}
      Vue.set(data, 'name', this.form.name) // 部门名称
      Vue.set(data, 'company_id', this.selectedOptions[0]) // 所属公司
      Vue.set(data, 'department_id', this.selectedOptions[1]) // 所属部门
      Vue.set(data, 'sort', this.form.sort) // 排序
      Vue.set(data, 'is_delete', this.form.status) // 状态0，正常，1禁用
      if (editStatus === 'edit') { Vue.set(data, 'id', this.form.id) }
      axios.post('/api/contact/editpost', data)
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.getUserList()
            this.btnLoading = false
            this.$store.commit('desktop/changWinStatus', {action: 'close', appId: this.appId})
          } else {
            this.$router.push({path: '/login'})
          }
        })
    },
    infDetermina () {
      this.determineEdit()
    }
  },
  mounted () {
    this.getOptionList()
    if (this.data.data) {
      this.selectedOptions = []
      this.form.id = this.data.data.id
      this.form.name = this.data.data.name
      this.form.sort = this.data.data.key
      this.selectedOptions.push(this.data.data.company_id)
      this.selectedOptions.push(this.data.data.department_id)
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
  .set-content
    width 100%
    max-height 100%
    padding 20px
    background #FFF
    .editCompanyNameBtn
      text-align center
      margin-left -70px
</style>
