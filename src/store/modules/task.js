import Vue from 'vue'
const state = {
  tasks: []
}
const actions = {}
const mutations = {
  addTask (state, data) {
    state.tasks = data
    // let target = state.tasks.filter(task => task.id === data.id)[0]
    // if (!target) {
    //   state.tasks.push(data)
    // }
  },
  editTask (state, data) {
    let taskProject = state.tasks.filter(obj => obj.id === data.project_id)[0].list
    let taskTeam = taskProject.filter(obj => obj.id === data.task_list_id)[0].list
    let task = taskTeam.filter(obj => obj.id === data.id)[0]
    Vue.set(task, data.term, data.value)
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
