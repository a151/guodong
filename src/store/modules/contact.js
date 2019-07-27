// import Vue from 'vue'
const state = {
  userList: [],
  infomationData: {}
}
const actions = {}
const mutations = {
  initList (state, data) {
    state.userList = [...data]
  },
  infoData (state, data) {
    state.infomationData = {...data}
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
