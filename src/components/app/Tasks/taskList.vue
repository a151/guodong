<template>
  <div class="body-right">
    <div class="content-menu" @contextmenu.prevent>
      <div class="menu-left">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="createTaskList">新建列表</el-button>
      </div>
      <div class="menu-center"></div>
      <div class="menu-right">
        <el-popover
          placement="bottom-start"
          width="360"
          trigger="click">
          <!-- <el-table :data="gridData">
            <el-table-column width="150" property="date" label="日期"></el-table-column>
            <el-table-column width="100" property="name" label="姓名"></el-table-column>
            <el-table-column width="300" property="address" label="地址"></el-table-column>
          </el-table> -->
          <el-form ref="form" :model="form" label-width="" size="small">
            <el-form-item label="">
              <el-form>
                筛选
              </el-form>
              <!-- <el-input v-model="searchText" placeholder="搜索任务" @input="searchWord"></el-input> -->
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="searchText"
                :fetch-suggestions="querySearch"
                placeholder="搜索任务"
                @select="handleSelect" style="display:block">
                <!-- <i
                  class="el-icon-edit el-input__icon"
                  slot="suffix"
                  @click="handleIconClick">
                </i> -->
                <template slot-scope="{ item }">
                  <div @click="openTaskDetails(item)">
                    <div class="name"><span :class="['status' + item.status]"></span>{{ item.name }}</div>
                    <span class="addr">备注：{{ item.remark? item.remark:'没有备注内容' }}</span>
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="">
              <el-form>
                状态筛选
              </el-form>
              <el-row>
                <el-button type="primary" round plain @click="selectIndex(1)" :class="[form.status === 1?'button-selected':'']">未分配</el-button>
                <el-button type="primary" round plain @click="selectIndex(2)" :class="[form.status === 2?'button-selected':'']">进行中</el-button>
                <el-button type="primary" round plain @click="selectIndex(3)" :class="[form.status === 3?'button-selected':'']">已逾期</el-button>
                <el-button type="primary" round plain @click="selectIndex(4)" :class="[form.status === 4?'button-selected':'']">已完成</el-button>
              </el-row>
            </el-form-item>
            <el-form-item label="">
              <el-form>
                排序
              </el-form>
              <el-row>
                <el-select v-model="form.order_way" placeholder="请选择排序">
                  <el-option label="创建时间" value="create_time"></el-option>
                  <el-option label="截止时间" value="end_time"></el-option>
                  <el-option label="更新时间" value="update_time"></el-option>
                  <el-option label="完成时间" value="finish_time"></el-option>
                  <el-option label="状态" value="status"></el-option>
                  <el-option label="优先级 " value="priority"></el-option>
                </el-select>
              </el-row>
            </el-form-item>
            <el-form-item label="">
              <el-form>
                与我相关
              </el-form>
              <el-checkbox-group v-model="form.aboutme" @change="aboutmeFn">
                <el-checkbox label="create" name="type">我创建的</el-checkbox>
                <el-checkbox label="response" name="type">我负责的</el-checkbox>
                <el-checkbox label="join" name="type">我参与的</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="" v-if="showzx">
              <el-form>
                执行者
              </el-form>
              <el-checkbox-group
                v-model="form.executor"
              >
                <el-checkbox v-for="city in cities" :label="city.execute_uid" :key="city.execute_uid">{{city.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="">
              <el-form>
                时间筛选
              </el-form>
              <el-radio-group v-model="form.resource" @change="resourceFn">
                <el-row class="radio-row">
                  <el-radio label="today_end" @click.native.prevent="clickitem('today_end')">今日截止</el-radio>
                </el-row>
                <el-row class="radio-row">
                  <el-radio label="today_update" @click.native.prevent="clickitem('today_update')">今日更新</el-radio>
                </el-row>
                <el-row class="radio-row">
                  <el-col :span="8"><el-radio label="create_time" @click.native.prevent="clickitem('create_time')">创建时间</el-radio></el-col>
                  <el-col :span="15">
                    <div style="display:inline-block;margin-top:-6px;">
                      <span class="demonstration">默认</span>
                      <el-date-picker
                        size="mini"
                        v-model="form.date1"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="radio-row">
                  <el-col :span="8"><el-radio label="end_time" @click.native.prevent="clickitem('end_time')">截止时间</el-radio></el-col>
                  <el-col :span="15">
                    <div style="display:inline-block;margin-top:-6px;">
                      <span class="demonstration">默认</span>
                      <el-date-picker
                        size="mini"
                        v-model="form.date2"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </div>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-collapse>
                <el-collapse-item title="更多" name="1">
                  <el-radio-group v-model="form.delete">
                    <el-row class="radio-row">
                      <el-radio label="pigeonhole" @click.native.prevent="clickitem2('pigeonhole')">已归档</el-radio>
                    </el-row>
                    <el-row class="radio-row">
                      <el-radio label="delete" @click.native.prevent="clickitem2('delete')">已删除</el-radio>
                    </el-row>
                  </el-radio-group>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
          </el-form>
          <el-button size="small" icon="el-icon-menu" @click="selection" slot="reference">筛选</el-button>
        </el-popover>
      </div>
    </div>
    <div class="content-container">
      <div class="content">
        <div class="task-list-box" v-loading="loading">
          <div class="empty" v-if="empty">
            <img src="~images/empty.png" />
            <p>没有相关信息</p>
          </div>
          <div
            v-for="item of taskBoxList"
            :key="item.id"
            class="task-group"
          >
            <div class="header">
              <div class="group-name" :title="item.name">{{item.name}}</div>
              <div class="group-edit">
                <el-dropdown @command="tasksOperation">
                  <span class="el-dropdown-link">
                    <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="en" @click.native="tasken(item.id)">编辑列表名称</el-dropdown-item>
                    <el-dropdown-item command="fc" @click.native="tasken(item.id)">归档已完成的任务</el-dropdown-item>
                    <el-dropdown-item command="da" @click.native="tasken(item.id)">删除列表内所有任务</el-dropdown-item>
                    <el-dropdown-item command="dl" @click.native="tasken(item.id)">删除列表</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="task-box">
              <ul>
                <li
                  v-for="task of item.list"
                  :key="task.id"
                  class="task-item"
                  @click="openTaskDetails(task)"
                >
                  <div class="content">
                    <div :class="['status', 's' + task.status]"><i class="dot"></i></div>
                    <div class="info">
                      <div class="title">
                        <span class="name">{{task.name}}</span>
                        <el-tooltip
                          placement="top"
                          v-if="task.username"
                        >
                          <div slot="content">{{'执行者：' + task.username}}</div>
                          <i class="user">{{task.username.substr(0, 1)}}</i>
                        </el-tooltip>
                      </div>
                      <div class="date" v-if="task.start_date && task.end_date">{{task.start_date}} 至 {{task.end_date}}</div>
                      <div class="date" v-else-if="task.start_date">{{task.start_date}} 开始</div>
                      <div class="date" v-else-if="task.end_date">{{task.end_time}} 截止</div>
                    </div>
                  </div>
                  <div class="tags" v-if="task.priority !==0 || task.attachment || task.child_count || task.discuss_count">
                    <el-badge v-if="task.priority === 3">
                      <span class="urgent">紧急</span>
                    </el-badge>
                    <el-badge v-if="task.priority === 2">
                      <span class="ordinary">普通</span>
                    </el-badge>
                    <el-badge v-if="task.priority === 1">
                      <span class="nourgent">非紧急</span>
                    </el-badge>
                    <el-badge v-if="task.attachment_count">
                      <span class="badge">附件</span>
                    </el-badge>
                    <el-badge v-if="task.child_count">
                      <span class="badge">子任务</span>
                    </el-badge>
                    <el-badge v-if="task.discuss_count">
                      <span class="badge">讨论</span>
                    </el-badge>
                  </div>
                </li>
                <li class="addTask" v-if="!item.isAdd" @click="addTask(item.id)"><i class="el-icon-plus"></i></li>
                <li class="addBox" v-if="item.isAdd">
                  <el-form size="small">
                    <el-form-item>
                      <el-input v-model="addTaskFrom.name" placeholder="任务标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                      执行者：
                      <el-popover
                        placement="right"
                        width="240"
                        trigger="click">
                        <el-button type="primary" plain @click="clearExecutor" :disabled="!addTaskFrom.executor">删除执行者</el-button>
                        <el-tree
                          :props="props"
                          :data="project_members"
                          :filter-node-method="filterNode"
                          ref="userTree"
                          :style="{height: '300px', overflowY: 'auto', marginTop: '15px'}"
                          @node-click="chooseExecutor"
                          class="chooseTree"
                        >
                        </el-tree>
                        <el-button slot="reference" v-if="addTaskFrom.executor">{{addTaskFrom.executor}}</el-button>
                        <el-button slot="reference" v-if="!addTaskFrom.executor" icon="el-icon-plus" circle></el-button>
                      </el-popover>
                    </el-form-item>
                    <el-form-item>
                      <el-date-picker
                        v-model="addTaskFrom.end_date"
                        type="datetime"
                        placeholder="截止时间"
                        value-format="yyyy-MM-dd HH:mm"
                        default-time="23:59:00">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button @click="cancelAddTask(item.id)">取消</el-button>
                      <el-button type="primary" :disabled="!addTaskFrom.name.trim()" @click="doAddTask(item.id)">确定</el-button>
                    </el-form-item>
                  </el-form>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
export default {
  name: 'taskList',
  props: {
    data: Object
  },
  data () {
    return {
      taskBoxList: [],
      empty: false,
      loading: true,
      project_id: NaN,
      addingId: NaN, // 添加时选择的执行者
      project_members: [],
      props: {
        label: 'name',
        isLeaf: 'leaf'
      },
      addTaskFrom: {
        name: '',
        executor: '',
        executor_id: NaN,
        end_date: ''
      },
      list_id: '',
      form: {
        name: '',
        order_way: '', // 排序方式
        date1: [], // 创建时间
        date2: [], // 截止时间
        aboutme: [], // 与我相关
        resource: '', // 时间筛选
        desc: '',
        status: '', // 状态筛选
        doUser: '',
        executor: [], // 执行者筛选
        delete: ''

      },
      searchText: '',
      radio1: 1,
      value1: '',
      selectuser: '',
      checkedCities: [],
      cities: '',
      showzx: true,
      restaurants: []
    }
  },
  methods: {
    getTaskList () {
      this.loading = true
      this.project_members = [...this.$store.state.contact.userList]
      let userid = localStorage.userid
      let id = this.data.id
      axios.post('/api/task/list/', {user_id: userid, project_id: id}, {'xhrFields': {withCredentials: true}, crossDomain: true})
        .then(res => {
          this.loading = false
          let data = res.data
          // console.log(res)
          if (data.ret) {
            this.cities = data.data.execute_list
            if (this.cities.length) {
              this.showzx = true
            } else {
              this.showzx = false
            }
            this.selectuser = this.data.selectuser
            this.getDataSucc(data)
          } else {
            this.$alert(data.msg)
          }
        })
    },
    getDataSucc (data) {
      let taskList = data.data.task_list
      // if (taskList.length) {
      taskList.forEach(list => {
        Vue.set(list, 'isAdd', false)
      })
      let arry = []
      let storeData = {}
      storeData.id = data.data.project_id
      storeData.list = data.data.task_list
      arry.push(storeData)
      this.$store.commit('task/addTask', arry)
      this.taskBoxList = [...this.$store.state.task.tasks.filter(task => task.id === storeData.id)[0].list]
      if (this.taskBoxList.length > 0) {
        this.empty = false
      } else {
        this.empty = true
      }
      this.project_id = storeData.id
      // } else {
      //   this.empty = true
      // }
    },
    // 新建任务列表
    createTaskList () {
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
        obj.id = this.data.id
        obj.appId = 'createTaskList'
        obj.title = '新建任务列表'
        obj.name = 'Tasks'
        obj.components = 'createTaskList'
        this.$store.commit('desktop/openApp', obj)
      }
    },
    // 筛选
    selection () {},
    // 打开任务详情
    openTaskDetails (data) {
      let obj = {}
      obj.id = data.id
      obj.members = this.project_members
      // console.log(data)
      obj.data = data
      obj.selectuser = this.selectuser
      obj.appId = 'taskDetails' + data.id
      obj.title = '任务详情'
      obj.name = 'Tasks' // 文件夹名
      obj.components = 'taskDetails' // 组件名
      this.$store.commit('desktop/openApp', obj)
    },
    tasken (id) {
      this.list_id = id
    },
    // 任务列表操作
    tasksOperation (command) {
      this.loading = true
      // 编辑列表
      if (command === 'en') {
        this.$prompt('', '编辑列表名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '名称不能为空'
        }).then(({ value }) => {
          this.loading = false
          let userid = localStorage.userid
          let id = this.data.id
          axios.post('/api/task/updateTaskListName/', {user_id: userid, project_id: id, task_list_id: this.list_id, task_list_name: value})
            .then(res => {
              let data = res.data
              if (data.ret) {
                this.$message({
                  type: 'success',
                  message: '名称修改成功'
                })
                this.getTaskList()
              } else {
                this.$alert(data.msg)
              }
            })
        }).catch(() => {
          this.loading = false
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      }
      // 归档
      if (command === 'fc') {
        this.$confirm('任务归档后，可以在“已归档的” 项目中查看。确定归档吗？').then(() => {
          let userid = localStorage.userid
          let id = this.data.id
          axios.post('/api/task/pigeonholeFinished', {user_id: userid, project_id: id, task_list_id: this.list_id})
            .then(res => {
              this.loading = false
              let data = res.data
              if (data.ret) {
                this.$message({
                  type: 'success',
                  message: '归档成功'
                })
                this.getTaskList()
              } else {
                this.$alert(data.data.msg)
              }
            })
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '已取消归档'
          })
        })
      }
      // 删除列表内任务
      if (command === 'da') {
        this.$confirm('删除后，可以在“回收站” 中恢复。确定删除吗？').then(() => {
          let userid = localStorage.userid
          let id = this.data.id
          axios.post('/api/task/deleteAllTask', {user_id: userid, project_id: id, task_list_id: this.list_id})
            .then(res => {
              this.loading = false
              let data = res.data
              if (data.ret) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.getTaskList()
              } else {
                this.$alert(data.data.msg)
              }
            })
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '已取消删除'
          })
        })
      }
      // 删除列表内任务
      if (command === 'dl') {
        this.$confirm('删除列表将同时删除列表内的所有任务。删除后，可以在“回收站” 中恢复。确定删除吗？').then(() => {
          let userid = localStorage.userid
          let id = this.data.id
          axios.post('/api/task/removeTaskList', {user_id: userid, project_id: id, task_list_id: this.list_id})
            .then(res => {
              this.loading = false
              let data = res.data
              if (data.ret) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.getTaskList()
              } else {
                this.$alert(data.data.msg)
              }
            })
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '已取消删除'
          })
        })
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 选择执行者
    chooseExecutor (event, node, el) {
      if (node.data.leaf) {
        this.addTaskFrom.executor = node.data.name
        this.addTaskFrom.executor_id = node.data.id
      }
    },
    // 点击展示添加框
    addTask (tasksId) {
      this.clearAddItem()
      let storeList = this.$store.state.task.tasks
      let tasksList = storeList.filter(list => list.id === this.data.id)[0].list
      // console.log(tasksList)
      this.taskBoxList = tasksList
      let taskList = tasksList.filter(list => list.id === tasksId)[0]
      if (this.addingId) {
        let tasks = tasksList.filter(tasks => tasks.id === this.addingId)[0]
        Vue.set(tasks, 'isAdd', false)
      }
      Vue.set(taskList, 'isAdd', true)
      this.addingId = tasksId
    },
    clearExecutor () {
      this.addTaskFrom.executor = ''
      this.addTaskFrom.executor_id = NaN
    },
    // 执行添加任务
    doAddTask (tasksId) {
      this.$message('执行添加')
      let storeList = this.$store.state.task.tasks
      let tasksList = storeList.filter(list => list.id === this.data.id)[0].list
      let taskList = tasksList.filter(list => list.id === tasksId)[0]
      Vue.set(taskList, 'isAdd', false)
      let userid = localStorage.userid
      let id = this.data.id
      if (!userid) {
        this.$alert('请重新登录', '登录失效', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.push({path: '/login'})
          }
        })
      } else {
        axios.post('/api/task/add', {user_id: userid, execute_uid: this.addTaskFrom.executor_id, name: this.addTaskFrom.name, end_time: this.addTaskFrom.end_date, task_list_id: tasksId, project_id: id})
          .then(res => {
            this.loading = false
            let data = res.data
            if (data.ret) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.clearAddItem()
              this.getTaskList()
            } else {
              this.$alert(data.data.msg)
            }
          })
      }
    },
    // 取消添加任务
    cancelAddTask (tasksId) {
      this.clearAddItem()
      let storeList = this.$store.state.task.tasks
      let tasksList = storeList.filter(list => list.id === this.data.id)[0].list
      let taskList = tasksList.filter(list => list.id === tasksId)[0]
      Vue.set(taskList, 'isAdd', false)
    },
    clearAddItem () {
      this.addTaskFrom.name = this.addTaskFrom.executor = this.addTaskFrom.end_date = ''
      this.addTaskFrom.executor_id = NaN
    },
    selectIndex (index) {
      this.form.status = index
      // console.log(this.form.date2)
    },
    // 筛选-搜索
    // searchWord () {
    //   this.loading = true
    //   // axios.post('/api/task/searchWord', {project_id: this.project_id, key_word: this.searchText})
    //   //   .then(res => {
    //   //     this.loading = false
    //   //     let data = res.data
    //   //     if (data.ret) {
    //   //       // this.clearAddItem()
    //   //       // this.getTaskList()
    //   //       this.restaurants = data.data.task_list
    //   //       for (let i = 0; i < this.restaurants.length; i += 1) {
    //   //         this.restaurants[i].value = this.restaurants[i].name
    //   //         delete this.restaurants[i].name
    //   //       }
    //   //     } else {
    //   //       this.$alert(data.data.msg)
    //   //     }
    //   //   })
    // },
    // 筛选-状态
    searchStatus () {
      this.loading = true
      let data = {}
      data.project_id = this.project_id
      data.key_word = this.searchText
      data.status = this.form.status
      data.order_way = this.form.order_way
      data.aboutme = this.form.aboutme
      data.executor = this.form.executor
      data.time = this.form.resource
      data.pigeonhole_delete = this.form.delete
      // 选择创建
      if (data.time === 'create_time' && this.form.date1.length > 0) {
        data.start_time = this.form.date1[0]
        data.end_time = this.form.date1[1]
      } else if (data.time === 'end_time' && this.form.date2.length > 0) {
        data.start_time = this.form.date2[0]
        data.end_time = this.form.date2[1]
      } else {
        data.start_time = ''
        data.end_time = ''
      }
      axios.post('/api/task/search', data)
        .then(res => {
          this.loading = false
          let data = res.data
          if (data.ret) {
            this.taskBoxList = data.data.search_list
            // this.clearAddItem()
            // this.getTaskList()
          } else {
            this.$alert(data.data.msg)
          }
        })
        .catch(() => {
          this.loading = false
          this.$message({
            type: 'info',
            message: '搜索失败'
          })
        })
    },
    aboutmeFn () {
      console.log(this.form.aboutme)
    },
    resourceFn () {
      console.log(this.form.resource)
    },
    clickitem (e) {
      e === this.form.resource ? this.form.resource = '' : this.form.resource = e
    },
    clickitem2 (e) {
      e === this.form.delete ? this.form.delete = '' : this.form.delete = e
    },
    // 筛选-搜索
    querySearch (queryString, cb) {
      // console.log(queryString + '框中输入的值')
      axios.post('/api/task/searchWord', {project_id: this.project_id, key_word: queryString})
        .then(res => {
          this.loading = false
          let data = res.data
          if (data.ret) {
            this.restaurants = data.data.task_list
            for (let i = 0; i < this.restaurants.length; i += 1) {
              this.restaurants[i].value = this.restaurants[i].name
              // delete this.restaurants[i].name
            }
            // console.log(this.restaurants)
            cb(this.restaurants)
          } else {
            this.$alert(data.data.msg)
          }
        })
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value === 0)
      }
    },
    handleSelect (item) {
      console.log(item)
    },
    handleIconClick (ev) {
      console.log(ev)
    }
  },
  watch: {
    // taskListChange () {
    //   this.loading = true
    //   let userid = localStorage.userid
    //   let id = this.data.id
    //   axios.post('/api/task/list/', {user_id: userid, project_id: id})
    //     .then(res => {
    //       this.loading = false
    //       let data = res.data
    //       if (data.ret) {
    //         // this.getDataSucc(data)
    //         this.taskBoxList = data.data.task_list
    //         // this.$store.commit('task/addTask', this.taskBoxList)
    //         if (this.taskBoxList.length > 0) {
    //           this.empty = false
    //         } else {
    //           this.empty = true
    //         }
    //       } else {
    //         this.$alert(data.msg)
    //       }
    //     })
    // }
    form: {
      handler: function (val, oldVal) {
        this.searchStatus()
      },
      deep: true
    }
  },
  created () {
    // 接收子组件的值
    this.$bus.on('reload', id => {
      // console.log(id)
      this.getTaskList()
    })
  },
  beforeDestroy () {
    this.$bus.off('reload')
  },
  computed: {
    // taskListChange () {
    //   return this.$store.state.task.tasks
    // }
  },
  mounted () {
    this.getTaskList()
  }
}
</script>
<style>
.radio-row{
  margin: 10px 0;
}
.el-date-editor--daterange.el-input__inner{
  width: 220px;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 5px;
}
.button-selected{
  background: #409EFF !important;
  border-color: #409EFF !important;
  color: #FFF !important;
}
.el-autocomplete-suggestion li{
  border-bottom: 1px solid #E4E7ED;
}
.el-autocomplete-suggestion li .name span{
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background: #f96;
  margin-right: 10px;
  vertical-align: -2px;
}
.el-autocomplete-suggestion li .addr{
  color: #999;
}
.task-list-box .task-group .task-box ul{
  padding: 10px 15px;
  background: #F2F2F2;
}
</style>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body >>> .chooseTree
    height 300px
    overflow-y auto
  empty()
  body-right()
  .body-right
    position relative
  .task-list-box
    height 100%
    padding 20px
    padding-bottom 0
    box-sizing border-box
    display flex
    flex-flow row nowrap
    overflow-x auto
    justify-content flex-start
    align-items stretch
    flex auto
    .task-group
      margin-right 20px
      margin-bottom 15px
      transition all linear .3s
      flex 0 0 330px
      display flex
      flex-flow column
      .header
        height 42px
        line-height 42px
        padding 0 10px
        border-radius 3px 3px 0 0
        background rgba(228, 228, 228, 1)
        display flex
        flex-direction row
        justify-content space-between
        .group-name
          max-width 260px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        .group-edit
          // float right
      .task-box
        flex 1
        overflow-y auto
        background #FFF
        // padding 10px 15px
        .task-item
          margin 8px auto
          border-radius 6px
          color #666
          background #FFF
          .content
            padding 15px
            display flex
            flex-direction row
            .status
              .dot
                display block
                width 14px
                height 14px
                border-radius 7px
            .status.s1
              .dot
                margin-right 10px
                background #ff9966
            .status.s2
              .dot
                margin-right 10px
                background #ff9966
            .info
              flex 1
              .title
                display flex
                flex-direction row
                justify-content space-between
                .name
                  font-size 16px
                .user
                  display block
                  width 24px
                  line-height 24px
                  border-radius 12px
                  text-align center
                  color #FFF
                  font-style normal
                  background #37c5ab
              .date
                color #999
                margin 15px 0
          .tags
            padding 15px 10px
            border-top 1px solid #e5e5e5
            span
              color #FFF
              margin 0 5px
              padding 3px 8px
              border-radius 3px
              cursor default
              &.urgent
                background #F56C6C
              &.ordinary
                background #909399
              &.nourgent
                background #67C23A
              &.badge
                background #E6A23C
        .addTask
          text-align center
          margin 8px auto
          padding 10px 0
          font-size 20px
          font-weight bold
          border-radius 6px
          color $colorMain
          background #FFF
        .addBox
          margin 8px auto
          border-radius 6px
          background #FFF
          padding 10px
</style>
