<template>
  <div class="desk-top"
    v-loading="loading"
    element-loading-text="数据加载中"
    element-loading-background="rgba(0, 0, 0, 1)"
  >
    <desk-top-content :iconList="deskTopIcons"></desk-top-content>
    <desk-top-taskbar></desk-top-taskbar>
  </div>
</template>

<script>
import DeskTopContent from './components/DeskTopContent'
import DeskTopTaskbar from './components/DeskTopTaskbar'
import axios from 'axios'
export default {
  name: 'DeskTop',
  components: {
    DeskTopContent,
    DeskTopTaskbar
  },
  data () {
    return {
      deskTopIcons: [],
      startIcons: [],
      loading: true,
      getUserSucc: false,
      getDesktop: false
    }
  },
  methods: {
    getDesktopData () {
      axios.post('/api/desktop/index')
        .then(res => {
          this.getDesktop = true
          if (this.getUserSucc) {
            this.loading = false
          }
          let data = res.data
          if (data.ret) {
            this.getDataSucc(data)
          } else {
            this.$router.push({path: '/login'})
          }
        })
    },
    getDataSucc (data) {
      let desktopArr = []
      let startArr = []
      data.data.forEach(function (value) {
        if (value.type === 'desktop') {
          desktopArr.push(value)
        } else {
          startArr.push(value)
        }
      })
      this.deskTopIcons = [...desktopArr]
      this.startIcons = [...startArr]
      this.$store.commit('startMenu/initMenuList', this.startIcons)
    },
    getUserList () {
      axios.post('/api/contact/index')
        .then(res => {
          this.getUserSucc = true
          if (this.getDesktop) {
            this.loading = false
          }
          let data = res.data
          if (data.ret && data.data) {
            this.$store.commit('contact/initList', data.data)
          } else {
            this.$alert(data.msg)
          }
        })
    }
  },
  mounted () {
    this.getDesktopData()
    this.getUserList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.desk-top
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  height: 100%
  overflow: hidden
  display: flex
  flex-direction: column
</style>
