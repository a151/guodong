// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './api/request'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/reset.css'
import './assets/IconFont/style.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueClipboard from 'vue-clipboard2'
import VueBus from './api/bus'
Vue.prototype.$axios = axios
Vue.prototype.$ElementUi = ElementUi
Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.use(VueQuillEditor)
Vue.use(VueClipboard)
Vue.use(VueBus)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  ElementUi,
  // axios,
  components: { App },
  template: '<App/>'
})
