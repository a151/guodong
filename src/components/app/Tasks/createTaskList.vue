<template>
  <div>
    <create-pop
      :appId="data.appId"
      :zIndex="data.zIndex"
      :width="460"
      :height="180"
      :close="close"
      :childWin="true"
    >
      <template #name>{{data.title}}</template>
      <template #body-right>
        <div class="create-box">
          <div class="create-content">
            <el-form label-width="80px" size="small">
              <el-form-item label="列表名称">
                <el-input v-model="form.name"></el-input>
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
import axios from 'axios'
import createPop from '@/components/common/window/Popup'
export default {
  name: 'createTaskList',
  props: {
    data: Object
  },
  data () {
    return {
      form: {
        name: ''
      },
      close: false,
      buttonBool: false
    }
  },
  methods: {
    closeWin () {
      this.close = true
    },
    doCreate () {
      if (this.form.name === '') {
        this.$message({
          showClose: true,
          message: '请输入要创建的列表名称',
          type: 'warning'
        })
      } else {
        this.close = false
        this.buttonBool = true
        let userid = localStorage.userid
        axios.post('/api/task/addTaskList', {user_id: userid, projectid: this.data.id, taskBoxName: this.form.name})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$bus.emit('reload', Date.parse(new Date())) // 像父组件传值
              this.$message({
                type: 'success',
                message: '添加成功!'
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
      }
    }
  },
  components: {
    createPop
  }
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
