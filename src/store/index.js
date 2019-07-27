import Vue from 'vue'
import Vuex from 'vuex'
import desktop from './modules/desktop.js'
import startMenu from './modules/startMenu.js'
import contact from './modules/contact.js'
import project from './modules/project.js'
import task from './modules/task.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    desktop,
    startMenu,
    contact,
    project,
    task
  }
})
