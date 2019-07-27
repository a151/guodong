<template>
  <div class="login-page">
    <el-container>
      <el-header></el-header>
      <el-main>
        <!-- 登录 -->
        <div class="login-box" v-if="loginModel">
          <h1 class="title">登录</h1>
          <el-form :model="userinfo" :rules="rules" ref="loginForm">
            <!-- <el-form-item style="margin-bottom: 0;text-align: center;font-size: 16px;" class="">您将加入“协作系统”</el-form-item> -->
            <el-form-item>
              <el-input
                v-model="userinfo.phone"
                placeholder="手机号"
                maxlength="11"
                minlength="11"
                prefix-icon="el-icon-mobile-phone"
                @input="handleClick"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                type="password"
                v-model="userinfo.pwd"
                placeholder="密码"
                maxlength="20"
                autocomplete="off"
                prefix-icon="el-icon-unlock"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 0">
              <el-row type="flex" justify="space-between">
                <el-col :span="12">
                  <el-input
                    type="text"
                    v-model="userinfo.code"
                    placeholder="图形验证码"
                    autocomplete="off"
                    maxlength="6"
                    minlength="6"
                    prefix-icon="el-icon-picture-outline"
                    width="100px"
                  ></el-input>
                </el-col>
                <img :src="userinfo.verifi"  @click="userinfo.verifi = userinfo.verifi + Math.random(100)" />
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-row type="flex" justify="space-between">
                <el-checkbox v-model="userinfo.remember">记住密码</el-checkbox>
                <el-button type="text" @click="clickReset">忘记密码？</el-button>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%;" type="primary" @click="doLogin('loginForm')" :loading="buttonBool">登 录</el-button>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%;" type="text" @click="clickReg">注册账号</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 注册 -->
        <div class="login-box" v-if="regModel">
          <h1 class="title">新用户注册</h1>
          <el-form :model="userinfo" :rules="rules">
            <el-form-item>
              <el-input
                v-model="reginfo.phone"
                placeholder="手机号"
                maxlength="11"
                minlength="11"
                prefix-icon="el-icon-mobile-phone"
                @input="handleClick"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-row type="flex" justify="space-between">
                <el-col :span="14">
                  <el-input
                    type="text"
                    v-model="reginfo.code"
                    placeholder="验证码"
                    autocomplete="off"
                    maxlength="6"
                    minlength="6"
                    prefix-icon="el-icon-picture-outline"
                    width="100px"
                  ></el-input>
                </el-col>
                <el-button type="primary" plain @click="getCode" :disabled="buttonStatus">{{buttonText}}</el-button>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-input
                type="password"
                v-model="reginfo.pwd"
                placeholder="设置密码，6-20位数字加字母组合"
                maxlength="20"
                autocomplete="off"
                prefix-icon="el-icon-unlock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                type="password"
                v-model="reginfo.confirmpwd"
                placeholder="确认密码"
                maxlength="20"
                autocomplete="off"
                prefix-icon="el-icon-unlock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-row type="flex">
                <el-checkbox v-model="reginfo.agree"></el-checkbox><span style="margin-left:-20px;">同意用户协议</span>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%;" type="primary" @click="doReg" :loading="buttonBool">注 册</el-button>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%;" type="text" @click="clickLogin">已有账号？请登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 忘记密码 -->
        <div class="login-box" v-if="resetModel">
          <h1 class="title">通过手机号重置密码</h1>
          <el-form :model="userinfo" :rules="rules" ref="loginForm">
            <el-form-item>
              <el-input
                v-model="resetinfo.phone"
                placeholder="输入注册手机号"
                maxlength="11"
                minlength="11"
                prefix-icon="el-icon-mobile-phone"
                @input="handleClick"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-row type="flex" justify="space-between">
                <el-col :span="14">
                  <el-input
                    type="text"
                    v-model="resetinfo.codeone"
                    placeholder="图形验证码"
                    autocomplete="off"
                    maxlength="6"
                    minlength="6"
                    prefix-icon="el-icon-picture-outline"
                    width="100px"
                  ></el-input>
                </el-col>
                <img :src="userinfo.verifi" @click="userinfo.verifi = userinfo.verifi + Math.random(100)" />
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-row type="flex" justify="space-between">
                <el-col :span="14">
                  <el-input
                    type="text"
                    v-model="resetinfo.codetwo"
                    placeholder="验证码"
                    autocomplete="off"
                    maxlength="6"
                    minlength="6"
                    prefix-icon="el-icon-picture-outline"
                    width="100px"
                  ></el-input>
                </el-col>
                <el-button type="primary" plain>获取验证码</el-button>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-input
                type="password"
                v-model="resetinfo.pwd"
                placeholder="设置密码，6-20位数字加字母组合"
                maxlength="20"
                autocomplete="off"
                prefix-icon="el-icon-unlock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                type="password"
                v-model="resetinfo.confirmpwd"
                placeholder="确认密码"
                maxlength="20"
                autocomplete="off"
                prefix-icon="el-icon-unlock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%;" type="primary" @click="doPwd" :loading="buttonBool">找回密码</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 完善资料 -->
        <div class="login-box" v-if="completeModel">
          <h1 class="title">完善资料</h1>
          <el-form :model="userinfo" :rules="rules">
            <el-form-item>
              <el-input
                v-model="complete.teamName"
                placeholder="团队名称"
                prefix-icon="el-icon-mobile-phone"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="complete.companyName"
                placeholder="公司名称"
                prefix-icon="el-icon-mobile-phone"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="complete.realName"
                placeholder="真实姓名"
                prefix-icon="el-icon-mobile-phone"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="complete.department"
                placeholder="所在部门（非必填）"
                prefix-icon="el-icon-mobile-phone"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%;" type="primary" @click="doComplete" :loading="buttonBool">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      api: 'http://192.168.1.12:8081',
      userinfo: {
        phone: '',
        pwd: '',
        code: '',
        verifi: 'http://192.168.1.32:8080/api/user/getImgCode?',
        remember: ''
      },
      rules: {
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
        pwd: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      inpNum: '',
      loginModel: true,
      regModel: false,
      resetModel: false,
      completeModel: false,
      buttonBool: false,
      reginfo: {
        phone: '',
        pwd: '',
        code: '111111',
        confirmpwd: '',
        agree: ''
      },
      complete: {
        teamName: '',
        companyName: '',
        realName: '',
        department: ''
      },
      resetinfo: {
        phone: '',
        pwd: '',
        confirmpwd: '',
        codeone: '',
        codetwo: '111111'
      },
      buttonText: '获取验证码',
      buttonStatus: false
    }
  },
  methods: {
    doLogin (loginForm) {
      this.buttonBool = true
      this.$refs[loginForm].validate(valid => {
        if (valid) {
          // this.userinfo.verifi = 'http://192.168.1.22:8686/api/user/getImgCode?' + Math.random(100)
          if (this.userinfo.phone === '') {
            this.$message.error('手机号不能为空')
            this.buttonBool = false
          } else if (this.userinfo.pwd === '') {
            this.$message.error('密码不能为空')
            this.buttonBool = false
          } else if (this.userinfo.code === '') {
            this.$message.error('验证码不能为空')
            this.buttonBool = false
          } else {
            axios.post('/api/user/login', {phone: this.userinfo.phone, password: this.userinfo.pwd, code: this.userinfo.code})
              .then(res => {
                let data = res.data
                if (data.ret) {
                  this.buttonBool = false
                  this.$message.success('登录成功')
                  localStorage.setItem('userid', data.data.id)
                  if (data.data.team_id) {
                    this.$router.push({path: '/desktop'})
                  } else {
                    this.loginModel = false
                    this.completeModel = true
                  }
                } else {
                  this.userinfo.verifi = 'http://192.168.1.32:8080/api/user/getImgCode?' + Math.random(100)
                  this.$message.error(data.msg)
                  this.buttonBool = false
                }
              })
              .catch(() => {
                this.userinfo.verifi = 'http://192.168.1.32:8080/api/user/getImgCode?' + Math.random(100)
                this.$message.error('登录失败')
                this.buttonBool = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 注册
    doReg () {
      this.buttonBool = true
      if (this.reginfo.phone === '') {
        this.$message.error('手机号不能为空')
        this.buttonBool = false
      } else if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(this.reginfo.phone))) {
        this.$message.error('请输入正确的手机号')
        this.buttonBool = false
      } else if (this.reginfo.code === '') {
        this.$message.error('验证码不能为空')
        this.buttonBool = false
      } else if (this.reginfo.pwd === '') {
        this.$message.error('密码不能为空')
        this.buttonBool = false
      } else if (this.reginfo.pwd.length < 6 || this.reginfo.pwd.length > 20) {
        this.$message.error('密码长度有误')
        this.buttonBool = false
      } else if (this.reginfo.confirmpwd === '') {
        this.$message.error('请再次确认密码')
        this.buttonBool = false
      } else if (!this.reginfo.agree) {
        this.$message.error('请勾选用户协议')
        this.buttonBool = false
      } else if (this.reginfo.pwd !== this.reginfo.confirmpwd) {
        this.$message.error('密码输入不一致')
        this.buttonBool = false
      } else {
        axios.post('/api/user/registerFirstStep', {phone: this.reginfo.phone, phone_code: this.reginfo.code, pwd_one: this.reginfo.pwd, pwd_two: this.reginfo.confirmpwd, is_agree: this.reginfo.agree})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$message.success('注册成功')
              localStorage.setItem('userid', data.data.userid)
              this.buttonBool = false
              this.loginModel = false
              this.regModel = false
              this.completeModel = true
              // if (data.data.team_id) {
              //   this.$router.push({path: '/desktop'})
              // } else {
              //   this.loginModel = false
              //   this.completeModel = true
              // }
            } else {
              this.$message.error(data.msg)
              this.userinfo.verifi = 'http://192.168.1.32:8080/api/user/getImgCode?' + Math.random(100)
              this.buttonBool = false
            }
          })
          .catch(() => {
            this.$message.error('注册失败')
            this.buttonBool = false
          })
      }
    },
    // 完善资料
    doComplete () {
      this.buttonBool = true
      if (this.complete.teamName === '') {
        this.$message.error('请输入团队名称')
        this.buttonBool = false
      } else if (this.complete.companyName === '') {
        this.$message.error('请输入公司名称')
        this.buttonBool = false
      } else if (this.complete.realName === '') {
        this.$message.error('请输入真实姓名')
        this.buttonBool = false
      } else {
        axios.post('/api/user/registerSecondStep', {team_name: this.complete.teamName, company_name: this.complete.companyName, real_name: this.complete.realName, department_name: this.complete.department})
          .then(res => {
            let data = res.data
            if (data.ret) {
              // if (data.data.team_id) {
              this.$message.success('提交成功')
              this.$router.push({path: '/desktop'})
              // } else {
              //   this.loginModel = false
              //   this.completeModel = true
              // }
            } else {
              this.$message.error(data.msg)
              this.buttonBool = false
            }
          })
          .catch(() => {
            this.$message.error('填写失败')
            this.buttonBool = false
          })
      }
    },
    // 找回密码
    doPwd () {
      this.buttonBool = true
      if (this.resetinfo.phone === '') {
        this.$message.error('手机号不能为空')
        this.buttonBool = false
      } else if (this.resetinfo.pwd === '') {
        this.$message.error('密码不能为空')
        this.buttonBool = false
      } else if (this.resetinfo.pwd.length < 6 || this.resetinfo.pwd.length > 20) {
        this.$message.error('密码长度有误')
        this.buttonBool = false
      } else if (this.resetinfo.confirmpwd === '') {
        this.$message.error('确认密码不能为空')
        this.buttonBool = false
      } else if (this.resetinfo.pwd !== this.resetinfo.confirmpwd) {
        this.$message.error('确认密码不一致 ')
        this.buttonBool = false
      } else if (this.resetinfo.codeone === '') {
        this.$message.error('请输入图形验证码')
        this.buttonBool = false
      } else if (this.resetinfo.codetwo === '') {
        this.$message.error('请输入短信验证码')
        this.buttonBool = false
      } else {
        axios.post('/api/user/forgetPwd', {phone: this.resetinfo.phone, img_code: this.resetinfo.codeone, phone_code: this.resetinfo.codetwo, pwd_one: this.resetinfo.pwd, pwd_two: this.resetinfo.confirmpwd})
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$message.success('找回成功,快来登录吧！')
              // localStorage.setItem('userid', data.data.userid)
              this.buttonBool = false
              this.loginModel = true
              this.regModel = false
              this.completeModel = false
              this.resetModel = false
              // if (data.data.team_id) {
              //   this.$router.push({path: '/desktop'})
              // } else {
              //   this.loginModel = false
              //   this.completeModel = true
              // }
            } else {
              this.$message.error(data.msg)
              this.buttonBool = false
            }
          })
          .catch(() => {
            this.$message.error('找回失败')
            this.buttonBool = false
          })
      }
    },
    handleClick () {
      this.userinfo.phone = this.userinfo.phone.replace(/[^\d]/g, '')
      this.reginfo.phone = this.reginfo.phone.replace(/[^\d]/g, '')
    },
    // 点击去注册
    clickReg () {
      this.loginModel = false
      this.regModel = true
      this.resetModel = false
    },
    // 点击去登录
    clickLogin () {
      this.loginModel = true
      this.regModel = false
      this.resetModel = false
    },
    // 点击忘记密码
    clickReset () {
      this.loginModel = false
      this.regModel = false
      this.resetModel = true
    },
    // 获取验证码
    getCode () {
      this.buttonStatus = true
      let time = 60
      this.buttonText = '（' + time + 's）重新发送'
      let setTim
      if (time > 0) {
        setTim = window.setInterval(() => {
          if (time < 1) {
            window.clearInterval(setTim)
            this.buttonText = '获取验证码'
            this.buttonStatus = false
          } else {
            time--
            this.buttonText = '（' + time + 's）重新发送'
          }
        }, 1000)
      }
    }
  },
  mounted () {
    // this.getCaptcha()
  }
}
</script>

<style lang="stylus">
  html,body,#app,.login-page
    background #f2f2f2
    height 100%
  .el-container
    height 100%
    display flex
    flex-direction column
    .el-main
      flex 1
      display flex
      flex-direction column
      justify-content center
      .login-box
        width 450px
        padding 50px
        background #FFF
        box-sizing border-box
        margin 0 auto
        img
          height 40px
        .title
          font-size 28px
          font-weight 400
          text-align center
          margin-bottom 30px
</style>
