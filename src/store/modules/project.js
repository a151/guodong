// import Vue from 'vue'
const state = {
  projectList: []
}
const actions = {}
const mutations = {
  initList (state, data) {
    state.projectList = [...data]
  },
  clearList (state) {
    let len = state.projectList.length
    state.projectList.splice(0, len)
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
