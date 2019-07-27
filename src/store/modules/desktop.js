import Vue from 'vue'
const state = {
  appList: [],
  winHeight: 0,
  winMaxZindex: 101
}
const actions = {
  initAppList (ctx, data) {
    data.forEach(function (value) {
      Vue.set(value, 'appId', 'app' + value.id)
      Vue.set(value, 'existence', false)
      Vue.set(value, 'display', false)
      Vue.set(value, 'zIndex', 100)
    })
    ctx.commit('initAppList', data)
  }
}
const mutations = {
  // 初始化程序
  initAppList (state, data) {
    state.appList = [...data]
  },
  // 双击桌面图标打开窗口
  openApp (state, obj) {
    let target = state.appList.filter(app => app.appId === obj.appId)[0]
    if (target) {
      let thisZindex = target.zIndex
      Vue.set(target, 'display', true)
      Vue.set(target, 'existence', true)
      if (thisZindex !== state.winMaxZindex) {
        Vue.set(target, 'zIndex', ++state.winMaxZindex)
      }
    } else {
      Vue.set(obj, 'existence', true)
      Vue.set(obj, 'display', true)
      Vue.set(obj, 'zIndex', ++state.winMaxZindex)
      state.appList.push(obj)
    }
  },
  // 窗口最大化/最小化/恢复
  changWinStatus (state, dataObj) {
    let appId = dataObj.appId
    let action = dataObj.action
    let target = state.appList.filter(app => app.appId === appId)[0]
    let index = state.appList.indexOf(target)
    switch (action) {
      case 'close':
        state.appList.splice(index, 1)
        break
      case 'minimize':
        Vue.set(target, 'display', false)
        if (target.zIndex === state.winMaxZindex) {
          state.winMaxZindex--
        }
        break
      case 'restore':
        Vue.set(target, 'existence', true)
        Vue.set(target, 'display', true)
        break
      default:
        break
    }
  },
  // 点击窗口顶部使窗口最顶部
  winActivate (state, appId) {
    let target = state.appList.filter(app => app.appId === appId)[0]
    let thisZindex = target.zIndex
    if (thisZindex !== state.winMaxZindex) {
      Vue.set(target, 'zIndex', ++state.winMaxZindex)
    }
  },
  // 点击任务栏操作窗口
  taskBarActivate (state, appId) {
    let target = state.appList.filter(app => app.appId === appId)[0]
    let thisZindex = target.zIndex
    let isShow = target.display
    if (isShow) {
      if (thisZindex === state.winMaxZindex) {
        Vue.set(target, 'display', false)
        state.winMaxZindex--
      } else {
        Vue.set(target, 'zIndex', ++state.winMaxZindex)
      }
    } else {
      Vue.set(target, 'zIndex', ++state.winMaxZindex)
      Vue.set(target, 'display', true)
    }
  },
  // 设置打开窗口高度
  setWinHeight (state, data) {
    state.winHeight = data
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
