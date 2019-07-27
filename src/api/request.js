import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.1.32:8080'
axios.defaults.crossDomain = true
axios.defaults.withCredentials = true // 让ajax携带cookie
Vue.prototype.$axios = axios
// 添加全局拦截
axios.interceptors.response.use(function (response) {
  let rps = response.data
  if (rps.ret) {
  } else if (rps.ret === 2) {
    Vue.prototype.$router.push({path: '/login'})
  } else {
    Vue.prototype.$message({message: rps.data.msg})
  }
  return response
}, function (err) {
  Vue.prototype.$message({message: err + '系统错误，请联系管理~'})
})
export default axios
