<template>
  <div>
    <app
      :data="data"
    ></app>
  </div>
</template>

<script>
export default {
  name: 'appWin',
  props: {
    data: Object
  },
  data () {
    return {
      id: this.data.appId
    }
  },
  created () {
    let com = this.data.components ? '/' + this.data.components : '/'
    this.$options.name = this.data.appId
    this.$options.components['app'] = () => import('@/components/app/' + this.data.name + com) // 动态挂载组件
  }
}
</script>

<style>
</style>
