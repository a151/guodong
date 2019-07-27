<template>
  <div class="body-right">
    <div class="content-menu" @contextmenu.prevent>

      <div class="toolbar-left"></div>
      <div class="toolbar-center"></div>
      <!-- <div class="toolbar-right">
        <button id="addProject" class="winui-toolbtn" @click="createProject=true"><i class="el-icon-plus"></i> 新增项目</button>
      </div> -->
      <div class="menu-left"></div>
      <div class="menu-center"></div>
      <div class="menu-right"><el-button type="primary" size="small" icon="el-icon-plus" @click="createProject">新建项目</el-button></div>
    </div>
    <div class="content-container">
      <div class="content" v-loading="loading">
        <div class="empty" v-if="empty">
          <img src="~images/empty.png" />
          <p>没有相关信息</p>
        </div>
        <div class="project-list-box">
          <div
            v-for="(item,index) of projectList"
            :key="item.id"
            class="project-item"
          >
            <div class="header">

              <div class="header-stars" :class="{'star-on': item.is_favorites}">
                <i
                  class="el-icon-star-on"
                  v-if="item.is_favorites"
                  @click="cancelFavorites(item.id,index)"
                ></i>
                <i
                  class="el-icon-star-off"
                  v-else
                  @click="addFavorites(item.id,index)"
                ></i>
              </div>
              <div class="name">{{item.name}}</div>
              <div class="right-button">
                <div><i class="el-icon-more" @click="setProjectItem(item)"></i></div>
                <!--=======-->
                <!--<div class="name" @click="openTask(item.id)">{{item.name}}</div>-->
                <!--<div class="right-button">-->
                <!--<div :class="{'star-on': item.is_favorites}">-->
                <!--<i-->
                <!--class="el-icon-star-on"-->
                <!--v-if="item.is_favorites"-->
                <!--@click="cancelFavorites(item.id)"-->
                <!--&gt;</i>-->
                <!--<i-->
                <!--class="el-icon-star-off"-->
                <!--v-else-->
                <!--@click="addFavorites(item.id)"-->
                <!--&gt;</i>-->
                <!--</div>-->
                <!--<div><i class="el-icon-setting" @click="setProjectItem(item)"></i></div>-->
                <!--&gt;>>>>>> fc9919766613be49a741520c16d84b23597946bb-->
              </div>
            </div>
            <div class="body" @click="openTask(item)">
              <div class="desc">{{item.description}}</div>
              <div class="bottom">
                <el-tooltip class="item" placement="top">
                  <div slot="content">执行者：{{item.username}}</div>
                  <div class="owner">{{item.username.slice(0,1)}}</div>
                </el-tooltip>
                <div class="info">
                  <i class="icon-number"></i>
                  <span>{{item.members_counts}}</span>
                  <i class="icon-statistics"></i>
                  <span>{{item.task_counts}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--创建项目-->
    <!-- <el-dialog
      title="创建项目"
      :visible.sync="createProjectModel"
      :modal-append-to-body="false"
      width="20%"
      >
      <div>
        <div class="create-entry-name">
          <el-input
            placeholder="项目名称"
            v-model="createEntryName"
            clearable>
          </el-input>
        </div>
        <div class="create-entry-description">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="简单描述下项目，便于大家理解（选填）"
            v-model="createEntryDescription">
          </el-input>
        </div>
        <span class="create-visible-range">可见范围</span>
        <div class="create-entry-range">
          <el-select v-model="visibleRangeValue" placeholder="请选择">
            <el-option
              v-for="item in visibleRangeAry"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ProjectList',
  props: {
    type: String,
    required: true
  },
  data () {
    return {
      projectList: [],
      createEntryName: '',
      createEntryDescription: '',
      visibleRangeValue: NaN,
      visibleRangeAry: [{
        value: '1',
        label: '私有：仅项目成员可见'
      }, {
        value: '2',
        label: '公开：所有人可见，仅项目成员可编辑'
      }], // 可见范围
      loading: true,
      empty: false
    }
  },
  methods: {
    getProjectList (type) {
      this.$store.commit('project/clearList')
      let userid = localStorage.userid
      axios.post('/api/project/' + type, {user_id: userid})
        .then(res => {
          this.loading = false
          let data = res.data
          if (data.ret) {
            this.getDataSucc(data)
          } else {
            this.$alert(data.msg)
          }
        })
    },
    getDataSucc (data) {
      if (data.data.length) {
        this.$store.commit('project/initList', data.data)
        this.projectList = data.data
      } else {
        this.empty = true
      }
    },
    createProject () {
      let userid = localStorage.userid ? localStorage.userid : false
      if (!userid) {
        this.$alert('请重新登录', '登录失效', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({path: '/login'})
          }
        })
      } else {
        let obj = {}
        obj.appId = 'projectCreate'
        obj.title = '创建项目'
        obj.name = 'Projects'
        obj.components = 'projectCreate'
        this.$store.commit('desktop/openApp', obj)
      }
    },
    setProjectItem (val) {
      let userid = localStorage.userid ? localStorage.userid : false
      if (!userid) {
        this.$alert('请重新登录', '登录失效', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({path: '/login'})
          }
        })
      } else {
        let obj = {}
        obj.id = val.id
        obj.data = val
        obj.appId = 'projectListSet'
        obj.title = '设置项目'
        obj.name = 'Projects'
        obj.components = 'projectListSet'
        this.$store.commit('desktop/openApp', obj)
      }
    },
    cancelFavorites (id, index) {
      this.$message('取消收藏')
      this.loading = true
      // this.forFavorites(false,index)
      this.collectFn(id, 0, false, index)
    },
    addFavorites (id, index) {
      this.$message('添加收藏')
      this.loading = true
      // this.forFavorites(true,index)
      this.collectFn(id, 1, true, index)
    },
    forFavorites (type, i) {
      var array
      var indexNum = 0
      array = this.projectList.splice(i, 1)
      if (type) {
        array[0].is_favorites = 1
        this.projectList.unshift(array[0])
      } else {
        array[0].is_favorites = 0
        this.projectList.forEach((item, index) => {
          if (this.projectList[index].is_favorites === 1) {
            indexNum++
          }
        })
        this.projectList.splice(indexNum, 0, array[0])
      }
    },
    // handleClose(done){
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // },
    collectFn (id, status, boole, index) {
      let userid = localStorage.userid
      axios.post('/api/project/projectMark', {id: id, is_Favorites: status, user_id: userid})
        .then(res => {
          // this.loading = false
          let data = res.data
          if (data.ret) {
            // this.getDataSucc(data)
            this.forFavorites(boole, index)
            this.loading = false
          } else {
            this.$alert(data.data.msg)
          }
        })
    },
    openTask (team) {
      let userid = localStorage.userid ? localStorage.userid : false
      if (!userid) {
        this.$alert('请重新登录', '登录失效', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({path: '/login'})
          }
        })
      } else {
        let obj = {}
        obj.id = team.id
        obj.appId = 'task' + team.id
        obj.title = '任务'
        obj.selectuser = team.members
        // obj.teamArray = this.projectList
        obj.name = 'Tasks' // 文件夹名
        this.$store.commit('desktop/openApp', obj)
      }
    }
  },
  watch: {
    type (type) {
      this.loading = true
      this.getProjectList(type)
    },
    projectList (newVal, oldVal) {
      // console.log(1)
    },
    projectListChange () {
      // console.log(this.projectListChange)
      this.loading = true
      let userid = localStorage.userid
      axios.post('/api/project/' + this.type, {user_id: userid})
        .then(res => {
          this.loading = false
          let data = res.data
          if (data.ret) {
            this.projectList = data.data
            if (this.projectList.length > 0) {
              this.empty = false
            } else {
              this.empty = true
            }
          } else {
            this.$alert(data.msg)
          }
        })
    },
    deep: true
  },
  computed: {
    projectListChange () {
      return this.$store.state.project.projectList
    }
  },
  mounted () {
    this.getProjectList(this.type)
  }
}
</script>
<style>
  .body-right .el-dialog__body{
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }
  .body-right .el-dialog__header{
    padding: 10px 20px 10px;
  }
  .body-right .el-dialog__title{
    font-size: 1.4px;
  }
  .body-right .el-dialog__headerbtn{
    top: 14px;
  }
  .body-right .el-icon-star-on{
    color: #ff8f1c;
  }

  .body-right .icon-number{
    display :inline-block;
    width :15px;
    height :13px;
    background :url("../../../assets/images/number-ico.png") no-repeat;
    background-size:100%;
  }
  .body-right .icon-statistics{
    display :inline-block;
    width :15px;
    height: 13px;
    background :url("../../../assets/images/statistics-ico.png") no-repeat;
    background-size: 100%;
  }
</style>
<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  empty()
  body-right()
  .content-menu
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    background: #F5F6F7;
    flex: none;
    .toolbar-right
    .toolbar-center
    .toolbar-right
      .winui-toolbtn
        padding:10px;
        border: none;
        background-color: transparent;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      .winui-toolbtn:hover
        background-color: #E8EFF7;
        border: 1px solid #A4CEF9;
      .winui-toolbtn i
        padding-right: 5px;
        color: #0063B1;
  .project-list-box
    display flex
    flex-direction row
    flex-wrap wrap
    .project-item
      flex 0 0 300px
      margin 10px
      border 1px solid #ebeef5
      border-radius 4px
      box-shadow 0 0 8px 0 rgba(0, 0, 0, .1)
      .header
        height 43px
        padding 0 15px
        color #666
        background #F8F8F8
        border-bottom 1px solid #ebeef5
        font-size 16px
        display flex
        flex-direction row
        justify-content space-between
        .name
          display inline-block
          width 80%
          line-height 43px
          text-align left
          color #333333
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        .right-button
          line-height 18px
          color #999
          cursor pointer
          display flex
          flex-direction column
        .right-button i
          margin-top 13px
          transform rotate(90deg);
          -ms-transform rotate(90deg)
          -moz-transform rotate(90deg)
          -webkit-transform rotate(90deg)
          -o-transform rotate(90deg)
          .star-on
            color #FF8F1C
      .body
        color #999999
        .desc
          padding 15px
          height 40px
        .bottom
          padding 15px
          display flex
          flex-direction row
          justify-content space-between
          .owner
            display inline-block
            width 26px
            height 26px
            line-height 26px
            text-align center
            font-size 12px
            border-radius 50%
            background #37c5ab
            color #fff
          .info
            padding-top 10px
  .create-entry-name
    margin-bottom:30px;
  .create-entry-description
    margin-bottom:30px;
  .create-visible-range
    display block
    line-height 40px
    color #999999
  .create-entry-range
    margin-bottom:50px;
    .el-select
      width 100%
  .header-stars i
    margin-top 13px
</style>
