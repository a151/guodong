<template>
  <div class="body-right">
    <el-card>
      <ul class="text">
        <li>邀请前请先选择要将好友添加到哪个群组，好友通过邀请链接登录或注册后，即可加入相应的群组。</li>
      </ul>
    </el-card>
    <div class="invitationWay">
      <div class="single">
        <p>1、选择邀请好友到</p>
        <div class="selectGroups">
          <el-button plain>系统协作群组</el-button>
          <el-button plain>工作沟通</el-button>
          <el-button plain>银行存管协作</el-button>
        </div>
      </div>
      <div class="import">
        <p>2、发送邀请链接</p>
        <div class="invitationToSend">
          <el-button type="primary">复制并发送邀请链接</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addEmail'
}
</script>

<style lang="stylus" scoped>
  @import '~styles/mixin.styl'
  body-right()
  .body-right
     padding 20px
     .text
       li
         margin-left 15px
         line-height 200%
         list-style-type disc
     .invitationWay
      margin-top 20px
      display flex
      p
        margin-bottom 15px
      .single
        width 400px
        .selectGroups
          text-align center
          border-right 1px solid #DCDFE6
          padding-bottom 20px
          .el-button
            width 200px
            margin 20px 0 0 0
      .import
        position relative
        padding-left 120px
        width 40%
       .invitationToSend
         .el-button
           width 200px
           margin 20px 0 0 0
</style>
