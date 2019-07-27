// import Vue from 'vue'
const state = {
  leftMenu: [],
  rightMenu: []
}
const actions = {}
const mutations = {
  initMenuList (state, data) {
    let leftArr = []
    let rightArr = []
    data.forEach(function (value) {
      if (value.type === 'startleft') {
        leftArr.push(value)
      } else if (value.type === 'startright') {
        rightArr.push(value)
      }
    })
    state.leftMenu = [...leftArr]
    state.rightMenu = [...rightArr]
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
