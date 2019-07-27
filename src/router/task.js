import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/task',
      name: 'task',
      component: () => import('@/components/Tasks/components/tasks')
    }
  ]
})
