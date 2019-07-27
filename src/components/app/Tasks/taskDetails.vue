<template>
  <div>
    <task-popup
      :appId="data.appId"
      :zIndex="data.zIndex"
    >
      <template #name>{{data.title}}</template>
      <template #headerMenu>
        <div class="header-menu">
          <el-dropdown @command="taskOperation">
            <span class="el-dropdown-link">
              <el-button type="primary" size="mini">设置</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="c">复制任务</el-dropdown-item>
              <el-dropdown-item command="m">移动任务</el-dropdown-item>
              <el-dropdown-item command="f">归档任务</el-dropdown-item>
              <el-dropdown-item command="d">删除任务</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <template #body-right>
        <div class="task-content" id="task-content">
          <div class="task-details-left">
            <div class="task-basic">
              <el-form size="small" label-width="80px">
                <el-row class="task-basic--el-row">
                  <el-col class="el-col--el-dropdown" :span="3">
                    <el-dropdown size="mini" @command="selectProgress" :class = "{'now': taskForm.selectState === '2','no': taskForm.selectState === '1','over': taskForm.selectState === '3'}">
                      <el-button type="primary">
                        {{taskForm.selectState === '2'? '进行中':taskForm.selectState === '1'? '未开始':taskForm.selectState === '3'? '已完成':''}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="2">进行中</el-dropdown-item>
                        <el-dropdown-item command="1">未开始</el-dropdown-item>
                        <el-dropdown-item command="3">已完成</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                  <el-col :span="21">
                      <el-input
                        placeholder="请输入内容"
                        v-model="taskForm.name"
                        @blur="editTask('name')"
                        clearable>
                      </el-input>
                  </el-col>
                </el-row>
                <el-form-item label="执行者">
                  <el-popover
                    placement="right"
                    width="240"
                    trigger="click">
                    <el-button type="primary" plain @click="clearExecutor" :disabled="!taskForm.executor">取消执行者</el-button>
                    <el-tree
                      :props="props"
                      :data="data.members"
                      :filter-node-method="filterNode"
                      ref="userTree"
                      :style="{height: '300px', overflowY: 'auto'}"
                      @node-click="chooseExecutor"
                      class="chooseTree"
                    >
                    </el-tree>
                    <el-button slot="reference" v-if="taskForm.executor">{{taskForm.executor}}</el-button>
                    <el-button slot="reference" v-if="!taskForm.executor" icon="el-icon-plus" circle></el-button>
                  </el-popover>
                </el-form-item>
                <el-form-item label="参与者">
                  <el-tag
                    v-for="tag in taskForm.members"
                    :key="tag.id"
                    closable
                    :disable-transitions="false"
                    @close="delMembers(tag.id)">
                    {{tag.name}}
                  </el-tag>
                  <el-popover
                    placement="right"
                    @hide="hidePopover"
                    width="240"
                    trigger="click">
                    <el-tree
                      :data="taskForm.projectMembers"
                      show-checkbox
                      node-key="tree_id"
                      :check-strictly="false"
                      default-expand-all
                      :style="{height: '300px', overflowY: 'auto'}"
                      :default-checked-keys="taskForm.membersId"
                      :props="props"
                      ref="projectMembersTree"
                      @check-change="getMembers">
                    </el-tree>
                    <el-button slot="reference" icon="el-icon-plus" circle></el-button>
                  </el-popover>
                </el-form-item>
                <el-form-item label="开始时间">
                  <el-date-picker
                    v-model="taskForm.start_date"
                    @blur="editTask('start_time')"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="截止时间">
                  <el-date-picker
                    v-model="taskForm.end_date"
                    @blur="editTask('end_date')"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <el-tabs class="taskInformation" v-model="tab">
              <el-tab-pane label="任务信息" class="enclosureInformation" name="info">
                <div class="tab-content">
                  <el-form size="small" label-width="80px">
                    <el-form-item label="优先级">
                        <el-select v-model="taskForm.priority" @change="editTask('priority')" placeholder="请选择">
                          <el-option
                            v-for="item in taskForm.priorityOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                      <span class="el-button--text" @click="editorTiggle = !editorTiggle">待添加</span>
                      <quill-editor
                        v-model="editorContent"
                        ref="myQuillEditor"
                        v-if="editorTiggle"
                        @blur="editorAbleTo?editTask('remark'):''"
                        :options="editorOption">
                      </quill-editor>
                    </el-form-item>
                    <el-form-item label="工时">
                      <el-input @blur="editTask('task_time')" v-model="taskForm.task_time">
                        <template slot="append">小时</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="进度">
                      <el-slider
                        @change="editTask('schedule')"
                        v-model="taskForm.schedule"
                        show-input>
                      </el-slider>
                    </el-form-item>
                    <el-form-item label="产品原型">
                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>原型链接</span>
                          <el-button style="float: right; padding: 3px 0" type="text" @click="isPrototypeLink = true">添加</el-button>
                        </div>
                        <div class="text item">
                          <el-row :gutter="20" v-if="isPrototypeLink">
                            <el-col :span="6">  <el-input  v-model="taskForm.prototype.prototypeName"   placeholder="原型名称"></el-input></el-col>
                            <el-col :span="14"> <el-input  v-model="taskForm.prototype.linkTask" placeholder="添加链接" ><template slot="prepend">Http://</template></el-input></el-col>
                            <el-col :span="3">  <el-button type="success" @click="addLinks" plain>确定</el-button></el-col>
                          </el-row>
                          <ul class="el-upload-list el-upload-list--text">
                            <li v-for="(item, index) in taskForm.fileListLink" :key="index" :tabindex="index" class="el-upload-list-file el-upload-list__item is-success">
                              <a class="el-upload-list__item-name">
                                <i class="el-icon-document"></i>
                                <div class="el-upload-list--file" >
                                  <p>{{item.name}}</p>
                                  <span>作者：{{item.author}}</span><span>{{item.create_time}}</span>
                                </div>
                                <a class="el-upload-list-function">
                                  <span @click="editLinkClick($event, item.name, item.link, item.id, index)">编辑</span><span @click="deleteFiles('link', $event,item.name,item.id,index)">删除</span>
                                </a>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </el-card>
                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>Axure HTML原型文件（ZIP压缩包）</span>
                          <el-upload
                            class="upload-demo"
                            style="float: right;"
                            :action="api+'/api/task/uploadFile'"
                            :data="{type: 2,task_id: id}"
                            :before-upload="beforeUploadAxure"
                            :on-success="onSuccessAxure"
                            :with-credentials="true"
                            :on-error="onErrorAxure"
                            :on-remove="handleRemoveAxure"
                            :before-remove="beforeRemoveAxure"
                            :on-exceed="handleExceedAxure">
                            <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                          </el-upload>
                        </div>
                        <ul class="el-upload-list el-upload-list--text">
                          <li v-for="(item, index) in taskForm.fileListAxure" :key="index" :tabindex="index" class="el-upload-list-file el-upload-list__item is-success">
                            <a class="el-upload-list__item-name">
                              <i class="el-icon-document"></i>
                              <div class="el-upload-list--file">
                                <p>{{item.name}}</p>
                                <span>{{item.size}}</span><span>作者：{{item.author}}</span><span>{{item.create_time}}</span>
                              </div>
                              <span class="el-upload-list-function">
                                <a :href="item.down_link" :download="item.down_link">下载</a><span @click="modifyFiles('axure', $event,item.name,item.id,index)">重命名</span><span>保存到云文件</span><span @click="deleteFiles('axure', $event,item.name,item.id,index)">删除</span>
                              </span>
                            </a>
                          </li>
                        </ul>
                      </el-card>
                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>其他原型文件</span>
                          <el-upload
                            class="upload-demo"
                            style="float: right;"
                            :action="api+'/api/task/uploadFile'"
                            :data="{type: 3,task_id: id}"
                            :with-credentials="true"
                            :before-upload="beforeUploadOther"
                            :on-success="onSuccessOther"
                            :on-error="onErrorOther"
                            :on-remove="handleRemoveOther"
                            :before-remove="beforeRemoveOther"
                            >
                            <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                          </el-upload>
                        </div>
                        <ul class="el-upload-list el-upload-list--text">
                          <li v-for="(item, index) in taskForm.fileListOther" :key="index" :tabindex="index" class="el-upload-list-file el-upload-list__item is-success">
                            <a class="el-upload-list__item-name">
                              <i class="el-icon-document"></i>
                              <div class="el-upload-list--file">
                                <p>{{item.name}}</p>
                                <span>{{item.size}}</span><span>作者：{{item.author}}</span><span>{{item.create_time}}</span>
                              </div>
                              <span class="el-upload-list-function">
                                <a :href="item.down_link" :download="item.down_link">下载</a><span @click="modifyFiles('other', $event,item.name,item.id,index)">重命名</span><span>保存到云文件</span><span @click="deleteFiles('other', $event,item.name,item.id,index)">删除</span>
                              </span>
                            </a>
                          </li>
                        </ul>
                      </el-card>
                    </el-form-item>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="子任务" class="subTask" name="child">
                <el-card class="box-card">
                  <ul  class="text item">
                    <li v-for="(item, index) in taskForm.fileListChildren" :key="index">
                      <el-row>
                        <el-col :span="3">
                          <div class="status" :class="{'not':item.status === 1,'now':item.status === 2,'over':item.status === 3}"><i></i> {{item.status === 1 ? '未开始': item.status === 2 ?  '进行中' : item.status === 3 ? '已完成':''}}</div>
                        </el-col>
                        <el-col :span="11">
                          <p class="text-subtask-title">{{item.name}}</p>
                        </el-col>
                        <el-col :span="8">
                          <div class="block">
                            <el-date-picker
                              v-model="childrenTaskForm.childrenEnd_date[index]"
                              @blur="subTask('edit_end_date',index, item.id)"
                              type="datetime"
                              placeholder="选择日期"
                              >
                            </el-date-picker>
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <el-button @click="selectExecutors('edit',index,item.id)"   v-show="!childrenTaskForm.executor_id[index]" icon="el-icon-plus"  circle></el-button>
                          <el-button @click="selectExecutors('edit',index,item.id)"   v-show="childrenTaskForm.executor_id[index]" circle>{{childrenTaskForm.executor[index]?childrenTaskForm.executor[index].substring(0,1):''}}</el-button>
                        </el-col>
                      </el-row>
                    </li>
                    <li v-if="childrenTaskForm.addTaskStatus">
                      <el-row>
                        <el-col :span="12" >
                          <el-input
                            placeholder="添加子任务，按回车键(Enter)键保存"
                            @keyup.enter.native="addTask"
                            v-model="childrenTaskForm.childrenTitle"
                            clearable>
                          </el-input>
                        </el-col>
                        <el-col :span="8" :offset="2">
                          <div class="block">
                            <el-date-picker
                              v-model="childrenTaskForm.end_date"
                              type="date"
                              placeholder="选择日期"
                              default-value="2010-10-01">
                            </el-date-picker>
                          </div>
                        </el-col>
                        <el-col :span="2">
                          <el-button @click="selectExecutors('add')"  v-if="childrenTaskForm.childrenExecutor" circle>{{childrenTaskForm.childrenExecutor.substring(0,1)}}</el-button>
                          <el-button @click="selectExecutors('add')"  v-else  icon="el-icon-plus" circle></el-button>
                        </el-col>
                      </el-row>
                    </li>
                    <li>
                       <span class="Blue" @click="addToShow">+  新建子任务</span>
                    </li>
                  </ul>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="附件" class="enclosureInformation" name="enclosure">
                <div>
                  <el-upload
                    class="upload-demo"
                    style="display: inline-block"
                    :action="api+'/api/task/uploadFile'"
                    :data="{type: 4,task_id: id}"
                    :with-credentials="true"
                    :before-upload="beforeUploadAttachment"
                    :on-success="onSuccessAttachment"
                    :on-error="onErrorAttachment"
                    :on-remove="handleRemoveAttachment"
                    :before-remove="beforeRemoveAttachment"
                    :on-exceed="handleExceedAttachment">
                    <el-button type="primary" plain>上传文件</el-button>
                  </el-upload>
                  <el-button type="primary">上传云<i class="el-icon-upload el-icon--right"></i></el-button>
                </div>
                <div>
                  <ul class="el-upload-list el-upload-list--text">
                    <li v-for="(item, index) in taskForm.fileListattachment" :key="index" :tabindex="index" class="el-upload-list-file el-upload-list__item is-success">
                      <a class="el-upload-list__item-name">
                        <i class="el-icon-document"></i>
                        <div class="el-upload-list--file">
                          <p>{{item.name}}</p>
                          <span>{{item.size}}</span><span>作者：{{item.author}}</span><span>{{item.create_time}}</span>
                        </div>
                        <span class="el-upload-list-function">
                              <a :href="item.down_link" :download="item.down_link">下载</a><span @click="modifyFiles('attachment', $event,item.name,item.id,index)">重命名</span><span>保存到云文件</span><span @click="deleteFiles('attachment', $event,item.name,item.id,index)">删除</span>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="task-details-right">chat</div>
          <el-dialog
            title="复制任务"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            :append-to-body="false"
            width="50%"
            :before-close="handleClose">
            <el-form size="small" label-width="80px">
              <el-form-item label="任务名称">
                <el-input
                  placeholder="待复制的任务名称"
                  v-model="removeTask.taskNameTxt"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item :label="removeTask.taskTittle">
                <el-select v-model="removeTask.projectListData" placeholder="选择项目" @change="changeTask">
                  <el-option
                    v-for="item in taskItemsData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
                <el-select v-model="removeTask.taskListData" placeholder="选择任务">
                  <el-option
                    v-for="item in projectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="modifTaskDeter">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="归档任务"
            :visible.sync="dialogVisibleDelete"
            :modal-append-to-body="false"
            :append-to-body="false"
            width="50%"
            :before-close="handleCloseDelete" center>
            <div>{{deleteTask.taskTxt}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button  type="primary" @click="editTaskDeter">确 定</el-button>
                <el-button  @click="dialogVisibleDelete = false">取 消</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="修改执行者"
            :visible.sync="modifyExecutor"
            :modal-append-to-body="false"
            :append-to-body="false"
            width="50%"
            :before-close="handleCloseDelete">
            <el-tree
              :props="props"
              :data="data.members"
              :filter-node-method="filterNode"
              ref="userTrees"
              :style="{height: '300px', overflowY: 'auto'}"
              @node-click="childrenChooseExecutor"
              class="chooseTree"
            >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button :disabled="!taskForm.executor" @click="clearExecutor">取消执行者</el-button>
                <el-button type="primary" @click="modifyExecutor = false">确 定</el-button>
            </span>
          </el-dialog>
          <!--删除文件-->
          <el-popover
            placement="left"
            width="160"
            visible-arrow="true"
            style="position: absolute;"
            :style="{'left': 580+'px','top': deviationY+'px'}"
            v-model="tipsDeletion">
            <p>确定要删除"{{taskForm.deleteFileName}}"这个文件吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="tipsDeletion = false">取消</el-button>
              <el-button type="primary" size="mini" @click="tipsDeletionDetermine()">确定</el-button>
              <div x-arrow="" class="popper__arrow" style="bottom: -6px;left: 70%;margin-right: 3px;border-top-color: #fff;border-bottom-width: 0;"></div>
            </div>
          </el-popover>
          <!--文件重命名-->
          <el-popover
            placement="left"
            title="修改文件名"
            width="200"
            visible-arrow="true"
            style="position: absolute;"
            :style="{'left': 430+'px','top': deviationToY+'px'}"
            v-model="modifyFileName">
            <div class="editFileType">
              <el-input
                placeholder="请输入内容"
                v-model="taskForm.modifyFileName"
                clearable>
              </el-input>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="modifyFileName = false">取消</el-button>
              <el-button type="primary" size="mini" @click="tipsModifyDetermine()">确定</el-button>
              <div x-arrow="" class="popper__arrow" style="bottom: -6px;left: 70%;margin-right: 3px;border-top-color: #fff;border-bottom-width: 0;"></div>
            </div>
          </el-popover>
          <!--原型链接编辑-->
          <el-popover
            placement="left"
            title="修改原型链接"
            width="450"
            visible-arrow="true"
            style="position: absolute;"
            :style="{'left': 130+'px','top': linkY+'px'}"
            v-model="modifyLink">
            <div class="editFileType">
              <el-row :gutter="20">
                <el-col :span="6">  <el-input  v-model="taskForm.prototype.editPrototypeName"   placeholder="原型名称"></el-input></el-col>
                <el-col :span="18"> <el-input  v-model="taskForm.prototype.editLinkTask" placeholder="添加链接" ><template slot="prepend">Http://</template></el-input></el-col>
              </el-row>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="modifyLink = false">取消</el-button>
              <el-button type="primary" size="mini" @click="tipsModifyLinkDetermine()">确定</el-button>
              <div x-arrow="" class="popper__arrow" style="bottom: -6px;left: 70%;margin-right: 3px;border-top-color: #fff;border-bottom-width: 0;"></div>
            </div>
          </el-popover>
        </div>
      </template>
    </task-popup>
  </div>
</template>

<script>
import taskPopup from '@/components/common/window/Popup'
import Vue from 'vue'
export default {
  name: 'taskDetails',
  props: {
    data: Object
  },
  data () {
    return {
      api: process.env.API_ROOT,
      id: this.data.id,
      tab: 'info',
      isPrototypeLink: false,
      dialogVisible: false,
      tipsDeletion: false,
      modifyLink: false,
      modifyFileName: false,
      dialogVisibleDelete: false,
      modifyExecutor: false,
      deviationY: 0,
      deviationToY: 0,
      linkY: 0,
      props: {
        label: 'name',
        isLeaf: 'leaf'
      },
      taskForm: {
        name: '',
        selectState: this.data.data.status.toString(),
        executor: '',
        executor_id: NaN,
        members: [],
        membersId: [],
        projectMembers: [],
        start_date: '',
        end_date: '',
        priorityOptions: [
          {
            value: 1,
            label: '非紧急'
          },
          {
            value: 2,
            label: '普通'
          },
          {
            value: 3,
            label: '紧急'
          }
        ],
        priority: '',
        task_time: NaN,
        prototype: {
          prototypeName: '',
          linkTask: '',
          id: NaN,
          editPrototypeName: '',
          editLinkTask: ''
        },
        fileListLink: [],
        fileListAxure: [],
        fileListOther: [],
        fileListattachment: [],
        fileListChildren: [],
        deleteFileType: '',
        deleteFileId: NaN,
        deleteFileindex: NaN,
        deleteFileName: '',
        modifyFileType: '',
        modifyFileId: NaN,
        modifyFileindex: NaN,
        modifyFileName: ''
      },
      childrenTaskForm: {
        id: '',
        addTaskStatus: false,
        end_date: '',
        childrenEnd_date: [],
        childrenTitle: '',
        childrenExecutor: '',
        childrenExecutor_id: NaN,
        executor: [],
        executor_id: [],
        editListIndex: NaN,
        isState: ''
      },
      removeTask: {
        taskState: '',
        taskTittle: '',
        taskNameTxt: '',
        projectListData: '',
        taskListData: '',
        projectList: [],
        taskList: []
      },
      deleteTask: {
        taskState: '',
        taskTittle: '',
        taskTxt: ''
      },
      taskItemsListData: [],
      taskItemsData: [],
      projectData: [],
      editorContent: '',
      editorOption: { // 备注富文本配置
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'], // 加粗，斜体，下划线
            [{'color': []}, 'link'], // 字体颜色，链接
            [{'list': 'ordered'}, { 'list': 'bullet' }, {'align': []}], // 列表、对齐方式
            ['image'] // 上传图片
          ]
        }
      },
      editorTiggle: false,
      editorAbleTo: false
    }
  },
  components: {
    taskPopup
  },
  methods: {
    initTaskItem () {
      console.log(this.data.data)
      this.taskForm.name = this.data.data.name
      this.taskForm.executor = this.data.data.username
      this.taskForm.executor_id = this.data.data.execute_uid
      this.taskForm.start_date = this.data.data.start_date
      this.taskForm.end_date = this.data.data.end_date
      this.taskForm.task_time = this.data.data.task_time
      this.taskForm.schedule = parseInt(this.data.data.schedule)
      this.editorContent = this.data.data.remark
      console.log(this.editorContent)
      if (this.editorContent === null) {
        this.editorTiggle = false
      } else {
        this.editorTiggle = true
      }
      // 优先级
      switch (this.data.data.priority) {
        case 1:
          this.taskForm.priority = '非紧急'
          break
        case 2:
          this.taskForm.priority = '普通'
          break
        case 3:
          this.taskForm.priority = '紧急'
          break
      }
    },
    initUserList () {
      let userList = []
      userList = [...this.data.members]
      this.taskForm.projectMembers = [...userList]
    },
    taskOperation (command) {
      switch (command) {
        case 'c':
          this.removeTask.taskTittle = '复制任务'
          this.removeTask.taskTittle = '复制到'
          this.removeTask.taskNameTxt = ''
          this.removeTask.taskState = 'copy'
          this.dialogVisible = true
          break
        case 'm':
          this.removeTask.taskTittle = '移动任务'
          this.removeTask.taskTittle = '移动到'
          this.removeTask.taskNameTxt = ''
          this.removeTask.taskState = 'move'
          this.dialogVisible = true
          break
        case 'f':
          this.deleteTask.taskTittle = '归档任务'
          this.deleteTask.taskTxt = '任务归档后，可以在“已归档的” 项目中查看。确定归档吗？'
          this.deleteTask.taskState = 'finish'
          this.dialogVisibleDelete = true
          break
        case 'd':
          this.deleteTask.taskTittle = '删除任务'
          this.deleteTask.taskTxt = '删除后，可以在“回收站” 中恢复。确定删除吗？'
          this.deleteTask.taskState = 'del'
          this.dialogVisibleDelete = true
          break
        default:
          break
      }
    },
    editTask (term) {
      let data = {}
      let editJson = {}
      Vue.set(editJson, 'task_id', this.id)
      data.id = this.data.data.id
      data.task_list_id = this.data.data.task_list_id
      data.project_id = this.data.data.project_id
      data.term = term
      switch (term) {
        case 'name':
          data.value = this.taskForm.name
          Vue.set(editJson, 'item', 'name')
          Vue.set(editJson, 'content', this.taskForm.name)
          break
        case 'start_time':
          Vue.set(editJson, 'item', 'start_time')
          Vue.set(editJson, 'content', this.taskForm.start_date)
          break
        case 'end_date':
          Vue.set(editJson, 'item', 'end_time')
          Vue.set(editJson, 'content', this.taskForm.end_date)
          break
        case 'priority':
          Vue.set(editJson, 'item', 'priority')
          Vue.set(editJson, 'content', this.taskForm.priority)
          break
        case 'task_time':
          Vue.set(editJson, 'item', 'task_time')
          Vue.set(editJson, 'content', this.taskForm.task_time)
          break
        case 'schedule':
          Vue.set(editJson, 'item', 'schedule')
          Vue.set(editJson, 'content', this.taskForm.schedule)
          break
        case 'remark':
          Vue.set(editJson, 'item', 'remark')
          Vue.set(editJson, 'content', this.editorContent)
          break
        default:
          break
      }
      this.$store.commit('task/editTask', data)
      this.$bus.emit('reload', Date.parse(new Date())) // 像父组件传值
      alert(term)
      this.modifyTaskDetails(editJson)
    },
    addLinks () {
      if (this.taskForm.prototype.prototypeName === '') {
        this.$message({
          message: '原型名称不能为空！',
          type: 'error'
        })
        return
      }
      if (this.taskForm.prototype.linkTask === '') {
        this.$message({
          message: '原型链接不能为空！',
          type: 'error'
        })
        return
      }
      let addJson = {}
      Vue.set(addJson, 'type', 1)
      Vue.set(addJson, 'task_id', this.id)
      Vue.set(addJson, 'name', this.taskForm.prototype.prototypeName)
      Vue.set(addJson, 'link', this.taskForm.prototype.linkTask)
      this.$axios.post('/api/task/uploadFile', addJson)
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.taskDetailsFn()
            this.isPrototypeLink = false
            this.taskForm.prototype.prototypeName = ''
            this.taskForm.prototype.linkTask = ''
          } else {}
        })
    },
    editLinkClick (event, name, link, id, index) {
      this.linkY = event.clientY - document.getElementById('task-content').getBoundingClientRect().top - 155
      this.taskForm.prototype.id = id
      this.taskForm.prototype.editPrototypeName = name
      this.taskForm.prototype.editLinkTask = link
      this.modifyLink = true
    },
    editTitle (el) {},
    clearExecutor () {
      this.taskForm.executor = ''
      this.taskForm.executor_id = NaN
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    deleteFiles (type, event, name, id, index) {
      this.deviationY = event.clientY - document.getElementById('task-content').getBoundingClientRect().top - 115
      this.taskForm.deleteFileType = type
      this.taskForm.deleteFileName = name
      this.taskForm.deleteFileId = id
      this.taskForm.deleteFileindex = index
      this.tipsDeletion = true
    },
    modifyFiles (type, event, name, id, index) {
      this.deviationToY = event.clientY - document.getElementById('task-content').getBoundingClientRect().top - 150
      this.taskForm.modifyFileType = type
      this.taskForm.modifyFileName = name
      this.taskForm.modifyFileId = id
      this.taskForm.modifyFileindex = index
      this.modifyFileName = true
    },
    tipsModifyLinkDetermine () {
      this.$axios.post('/api/task/updateName', {id: this.taskForm.prototype.id, name: this.taskForm.prototype.editPrototypeName, link: this.taskForm.prototype.editLinkTask})
        .then(res => {
          let data = res.data
          console.log('tipsModifyDetermine', data)
          if (data.ret) {
            this.taskDetailsFn()
            this.modifyLink = false
          } else {}
        })
    },
    tipsDeletionDetermine () {
      this.$axios.post('/api/task/prototypeDel', {id: this.taskForm.deleteFileId})
        .then(res => {
          let data = res.data
          console.log('delected', data)
          if (data.ret) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            switch (this.taskForm.deleteFileType) {
              case 'link':
                this.taskForm.fileListLink.splice(this.taskForm.deleteFileindex, 1)
                this.tipsDeletion = false
                break
              case 'axure':
                this.taskForm.fileListAxure.splice(this.taskForm.deleteFileindex, 1)
                this.tipsDeletion = false
                break
              case 'other':
                this.taskForm.fileListOther.splice(this.taskForm.deleteFileindex, 1)
                this.tipsDeletion = false
                break
              case 'attachment':
                this.taskForm.fileListattachment.splice(this.taskForm.deleteFileindex, 1)
                this.tipsDeletion = false
                break
              default:
                break
            }
          } else {}
        })
    },
    tipsModifyDetermine () {
      this.$axios.post('/api/task/updateName', {id: this.taskForm.modifyFileId, name: this.taskForm.modifyFileName})
        .then(res => {
          let data = res.data
          console.log('tipsModifyDetermine', data)
          if (data.ret) {
            this.taskDetailsFn()
            this.modifyFileName = false
          } else {}
        })
    },
    chooseExecutor (event, node, el) {
      if (node.data.leaf) {
        this.taskForm.executor = node.data.name
        this.taskForm.executor_id = node.data.tree_id.replace('u', '')
        let editJson = {}
        Vue.set(editJson, 'task_id', this.id)
        Vue.set(editJson, 'item', 'execute_uid')
        Vue.set(editJson, 'content', this.taskForm.executor_id)
        this.modifyTaskDetails(editJson)
      }
    },
    childrenChooseExecutor (event, node, el) {
      if (node.data.leaf) {
        if (this.childrenTaskForm.isState === 'add') {
          this.childrenTaskForm.childrenExecutor = node.data.name
          this.childrenTaskForm.childrenExecutor_id = node.data.tree_id.replace('u', '')
        } else if (this.childrenTaskForm.isState === 'edit') {
          this.childrenTaskForm.executor[this.childrenTaskForm.editListIndex] = node.data.name
          this.childrenTaskForm.executor_id[this.childrenTaskForm.editListIndex] = node.data.tree_id.replace('u', '')
          let editJson = {}
          Vue.set(editJson, 'task_id', this.childrenTaskForm.id)
          Vue.set(editJson, 'item', 'execute_uid')
          Vue.set(editJson, 'content', this.childrenTaskForm.executor_id[this.childrenTaskForm.editListIndex])
          this.modifyTaskDetails(editJson)
        }
        this.modifyExecutor = false
      }
    },
    hidePopover () {
      let editJson = {}
      Vue.set(editJson, 'task_id', this.id)
      Vue.set(editJson, 'item', 'members')
      Vue.set(editJson, 'content', this.taskForm.members)
      this.modifyTaskDetails(editJson)
    },
    getMembers () {
      let checkedMembers = this.$refs.projectMembersTree.getCheckedNodes(true)
      this.taskForm.members = []
      this.taskForm.membersId = []
      if (checkedMembers.length) {
        checkedMembers.forEach(cMem => {
          if (cMem.leaf) {
            let mem = {}
            mem.id = cMem.tree_id.replace('u', '')
            mem.name = cMem.name
            mem.headimg = cMem.head_img
            mem.username = cMem.username
            this.taskForm.members.push(mem)
            this.taskForm.membersId.push(cMem.tree_id)
          }
        })
      }
    },
    delMembers (id) {
      let uIndex = this.taskForm.membersId.indexOf('u' + id)
      let index = this.taskForm.members.indexOf(this.taskForm.members.filter(user => user.id === id)[0])
      this.taskForm.members.splice(index, 1)
      this.taskForm.membersId.splice(uIndex, 1)
      this.$refs.projectMembersTree.setCheckedKeys(this.taskForm.membersId)
      let editJson = {}
      Vue.set(editJson, 'task_id', this.id)
      Vue.set(editJson, 'item', 'members')
      Vue.set(editJson, 'content', this.taskForm.members)
      this.modifyTaskDetails(editJson)
    },
    selectProgress (command) {
      alert(22222)
      let editJson = {}
      Vue.set(editJson, 'task_id', this.id)
      Vue.set(editJson, 'item', 'status')
      Vue.set(editJson, 'content', command)
      this.taskForm.selectState = command
      this.modifyTaskDetails(editJson)
    },
    handleClose (done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    handleCloseDelete (done) { this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {}) },
    addAxure () {},
    handleRemoveAxure (file, fileList) {},
    handleExceedAxure (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeUploadAxure (file) {
      let fileName = file.name
      let regex = /(?:zip|ZIP)$/
      let isXls = regex.test(fileName.toLowerCase())
      if (isXls) {
      } else {
        this.$message.error('请选择正确文件格式！上传失败~')
      }
      return isXls
    },
    beforeRemoveAxure (file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`)
    },
    onSuccessAxure (response, file, fileList) {
      if (response.ret) {
        this.taskDetailsFn()
        this.$message.success(response.msg)
      }
    },
    onErrorAxure (err, file, fileList) {
      this.$message.success(err.msg)
    },
    handleRemoveOther (file, fileList) {},
    beforeUploadOther (file) {
    },
    beforeRemoveOther (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    onSuccessOther (response, file, fileList) {
      if (response.ret) {
        this.taskDetailsFn()
        this.$message.success(response.msg)
      }
    },
    onErrorOther (err, file, fileList) {
      this.$message.success(err.msg)
    },
    handleRemoveAttachment (file, fileList) {},
    handleExceedAttachment (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeUploadAttachment (file) {
    },
    beforeRemoveAttachment (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    onSuccessAttachment (response, file, fileList) {
      if (response.ret) {
        this.taskDetailsFn()
        this.$message.success(response.msg)
      }
    },
    onErrorAttachment (err, file, fileList) {
      this.$message.success(err.msg)
    },
    taskDetailsFn () {
      this.$axios.post('/api/task/taskDetail', {task_id: this.id})
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.taskForm.fileListLink = data.data.linkList
            this.taskForm.fileListAxure = data.data.axureList
            this.taskForm.fileListOther = data.data.otherList
            this.taskForm.fileListattachment = data.data.attachmentList
            this.taskForm.fileListChildren = data.data.child_list
            this.childrenTaskForm.childrenEnd_date = []
            this.childrenTaskForm.executor = []
            this.childrenTaskForm.executor_id = []
            if (data.data.child_list !== null && data.data.child_list.length) {
              data.data.child_list.forEach(child => {
                this.childrenTaskForm.childrenEnd_date.push(child.end_date)
                this.childrenTaskForm.executor.push(child.username)
                this.childrenTaskForm.executor_id.push(child.execute_uid)
              })
            }
            // 项目参与人员
            this.taskForm.members = []
            let members = JSON.parse(data.data.taskDetail.members)
            if (members !== null && members.length) {
              members.forEach(mem => {
                let per = {}
                per.id = mem.id
                per.name = mem.name
                this.taskForm.members.push(per)
                this.taskForm.membersId.push('u' + mem.id)
              })
            }
            this.initUserList()
          } else {}
        })
    },
    modifyTaskDetails (json) {
      this.$axios.post('/api/task/taskDetailUpdate', json)
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.$message({
              message: '编辑成功！',
              type: 'success'
            })
          } else {}
        })
    },
    addToShow () {
      this.childrenTaskForm.addTaskStatus = true
    },
    selectExecutors (type, index, id) {
      switch (type) {
        case 'add':
          this.childrenTaskForm.isState = 'add'
          break
        case 'edit':
          this.childrenTaskForm.isState = 'edit'
          this.childrenTaskForm.editListIndex = index
          this.childrenTaskForm.id = id
          break
        default:
          break
      }
      this.modifyExecutor = true
    },
    subTask (term, index, id) {
      let editJson = {}
      Vue.set(editJson, 'task_id', id)
      switch (term) {
        case 'edit_end_date':
          Vue.set(editJson, 'item', 'end_time')
          Vue.set(editJson, 'content', this.childrenTaskForm.childrenEnd_date[index])
          break
        default:
          break
      }
      alert(33333)
      this.modifyTaskDetails(editJson)
    },
    addTask () {
      if (this.childrenTaskForm.childrenTitle) {
        let addJson = {}
        Vue.set(addJson, 'task_id', this.id)
        Vue.set(addJson, 'name', this.childrenTaskForm.childrenTitle)
        Vue.set(addJson, 'end_time', this.childrenTaskForm.end_date)
        Vue.set(addJson, 'execute_uid', this.childrenTaskForm.childrenExecutor_id)
        this.$axios.post('/api/task/taskChildAdd', addJson)
          .then(res => {
            let data = res.data
            if (data.ret) {
              this.$message({
                message: '提交子任务成功！',
                type: 'success'
              })
              this.childrenTaskForm.childrenTitle = ''
              this.childrenTaskForm.end_date = ''
              this.childrenTaskForm.childrenExecutor = ''
              this.childrenTaskForm.childrenExecutor_id = NaN
              this.childrenTaskForm.addTaskStatus = false
              this.taskDetailsFn()
            } else {}
          })
      }
    },
    taskItemsList () {
      this.$axios.post('/api/Task/projectTaskList')
        .then(res => {
          let data = res.data
          this.taskItemsData = []
          if (data.ret) {
            let projectData = data.data
            if (projectData.project_list.length) {
              this.taskItemsListData = projectData.project_list
              projectData.project_list.forEach(data => {
                let taskList = {}
                Vue.set(taskList, 'value', data.id)
                Vue.set(taskList, 'label', data.name)
                this.taskItemsData.push(taskList)
              })
              console.log('this.taskItemsData', this.taskItemsData)
            }
          } else {}
        })
    },
    changeTask (id) {
      this.projectData = []
      this.removeTask.taskListData = ''
      let project = this.taskItemsListData.filter(com => com.id === id)[0]
      if (project.task_list.length) {
        project.task_list.forEach(data => {
          let projectJson = {}
          Vue.set(projectJson, 'value', data.id)
          Vue.set(projectJson, 'label', data.name)
          this.projectData.push(projectJson)
        })
      }
    },
    modifTaskDeter () {
      if (this.removeTask.taskNameTxt === '') {
        this.$message({
          message: '任务不能为空！',
          type: 'error'
        })
        return
      }
      if (this.removeTask.taskListData === '') {
        this.$message({
          message: '任务不能为空！',
          type: 'error'
        })
        return
      }
      let modifTaskJson = {}
      Vue.set(modifTaskJson, 'id', this.id)
      Vue.set(modifTaskJson, 'title', this.removeTask.taskNameTxt)
      Vue.set(modifTaskJson, 'task_list', this.removeTask.taskListData)
      Vue.set(modifTaskJson, 'project', this.removeTask.projectListData)
      Vue.set(modifTaskJson, 'type', this.removeTask.taskState)
      this.$axios.post('/api/task/operateTask', modifTaskJson)
        .then(res => {
          let data = res.data
          console.log('/api/task/operateTask', data)
          if (data.ret) {
            this.$message({
              message: data.msg,
              type: 'success'
            })
            this.dialogVisible = false
          } else {}
        })
    },
    editTaskDeter () {
      let modifTaskJson = {}
      Vue.set(modifTaskJson, 'id', this.id)
      Vue.set(modifTaskJson, 'type', this.deleteTask.taskState)
      this.$axios.post('/api/task/operateTask', modifTaskJson)
        .then(res => {
          let data = res.data
          if (data.ret) {
            this.$message({
              message: data.msg,
              type: 'success'
            })
            this.dialogVisibleDelete = false
          } else {}
        })
    }
  },
  mounted () {
    this.editorAbleTo = false
    this.taskDetailsFn()
    this.initTaskItem()
    this.taskItemsList()
    this.$nextTick(function () {
      this.$refs.myQuillEditor.quill.enable(true)
      this.$refs.myQuillEditor.quill.blur()
      this.editorAbleTo = true
    })
  }
}
</script>
<style>
  .enclosureInformation .el-upload-list-file{
    padding: 10px 0;
  }
  .enclosureInformation .el-upload-list__item .el-icon-close {
    top: 25px;
  }
  .enclosureInformation .el-upload-list-function{
    float: right;
    margin-top: 15px;
  }
  .enclosureInformation .el-upload-list-function a{
    color:#606266 ;
    text-decoration: none;
  }
  .el-upload-list__item.is-success .el-upload-list__item-name:focus a, .el-upload-list__item.is-success .el-upload-list__item-name:hover a{
    color: #409EFF;
    cursor: pointer;
  }
  .enclosureInformation .el-upload-list-function span{
    margin-left: 10px;
  }
  .enclosureInformation .el-icon-document{
    float: left;
    margin-top: 15px;
  }
  .enclosureInformation .el-upload-list--file{
    float: left;
  }
  .enclosureInformation .el-upload-list--file span{
    margin-right: 10px;
  }
  .task-basic--el-row{
    margin-bottom: 10px;
  }
  .el-col--el-dropdown .el-button{
    padding: 12px 10px;
  }
  .el-col--el-dropdown .el-form-item__content{
    margin-left: 0;
  }
  .el-dropdown-menu--mini{
    padding: 12px 12px;
  }
  .el-col--el-dropdown .now .el-button--primary{
    background-color: #008000;
    border-color: #008000;
  }
  .el-col--el-dropdown .no .el-button--primary{
    background-color: #FFB800;
    border-color: #FFB800;
  }
  .el-col--el-dropdown .over .el-button--primary{
    background-color: #999999;
    border-color: #999999;
  }
  .upload-demo .el-upload-list--text{
    display: none;
  }
  .subTask .item li {
    margin-bottom: 20px;
  }
  .subTask .item li .Blue{
    color: #409EFF;
    cursor: pointer;
  }
  .subTask .item .status {
    float: left;
    margin-right: 25px;
    padding: 10px 0;
  }
  .subTask .item .status i{
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 5px;
    border-radius: 50%;
  }
  .subTask .item .status.not i{
    background: #FFB800;
  }
  .subTask .item .status.now i{
    background: #008000;
  }
  .subTask .item .status.over i{
    background: #999999;
  }
  .subTask .item .status.not {
    color: #FFB800;
  }
  .subTask .item .status.now {
    color: #008000;
  }
  .subTask .item .status.over {
    color: #999999;
  }
  .text-subtask-title{
    padding: 10px 0;
  }
  .task-content .el-dialog__wrapper{
    position: absolute;
  }
  .task-content .el-dialog__footer{
    text-align: center;
  }
  .editFileType{
    margin-bottom: 10px;
  }
</style>
<style lang="stylus" scoped>
  >>> .el-card__header
    padding 10px
  .el-tag:first-of-type{
    margin-right: 10px;
  }
  .el-tag + .el-tag {
    margin-right: 10px;
    margin-bottom 10px
  }
  .header-menu
    padding-top 5px
  .task-content
    position relative
    width 100%
    max-height 100%
    background #FFF
    display flex
    flex-direction row
    align-items stretch
    .task-details-left
      border-right 1px solid #B9B9B9
      overflow-y auto
      flex 1
      .task-basic
        padding 20px
      .taskInformation
        padding 20px
        .tab-content
          .box-card
            margin-bottom 20px
    .task-details-right
      width 320px
</style>
