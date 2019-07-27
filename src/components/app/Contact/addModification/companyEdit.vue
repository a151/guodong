<template>
  <div>
    <set-pop
      :appId="data.appId"
      :zIndex="data.zIndex"
      :width="460"
      :height="$store.state.contact.infomationData.infoJudge === 'add'? 260 : 350"
      :childWin="true"
    >
      <template #name>{{data.title}}</template>
      <template #body-right>
        <div class="set-content">
          <el-form label-width="70px">
            <el-form-item :label="$store.state.contact.infomationData.infoName">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item :label="$store.state.contact.infomationData.infoDescribe">
              <el-input v-model="form.describe"></el-input>
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
                <el-button type="primary" @click="infDetermina" :loading="btnLoading">确定</el-button>
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
import Vue from 'vue'
import axios from 'axios'
export default {
  name: 'companyEdit',
  props: {
    data: Object
  },
  data () {
    return {
      form: {
        id: '',
        name: '',
        describe: '',
        status: 0
      },
      options: [{
        value: 0,
        label: '正常'
      }, {
        value: 1,
        label: '禁用'
      }],
      btnLoading: false
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
            this.$store.commit('contact/initList', data.data)
          } else {
            this.$alert(data.msg)
          }
        })
    },
    determineEdit () {
      this.btnLoading = true
      let editStatus = this.$store.state.contact.infomationData.infoJudge
      let data = {}
      Vue.set(data, 'name', this.form.name) // 公司名称
      Vue.set(data, 'description', this.form.describe) // 公司描述
      Vue.set(data, 'status', this.form.status) // 状态0，正常，1禁用
      if (editStatus === 'edit') { Vue.set(data, 'id', this.form.id) }
      axios.post(editStatus === 'add' ? '/api/contact/addCompany' : '/api/contact/updateCompany', data)
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
    if (this.data.data) {
      this.form.id = this.data.data.id
      this.form.name = this.data.data.name
      this.form.describe = this.data.data.describe
      this.form.status = this.data.data.status
    } else {

    }
  }
}
</script>

<style lang="stylus" scoped>
  .set-content
    width 100%
    max-height 100%
    background #FFF
    padding 20px
  .editCompanyNameBtn
    text-align center
    margin-left -70px
</style>
