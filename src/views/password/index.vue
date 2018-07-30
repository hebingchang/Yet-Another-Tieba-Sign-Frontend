<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading" element-loading-text="加载中">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" :inline="true" label-width="80px">
          <el-form-item label="原密码">
            <el-input type="password" v-model="old_password"></el-input>
          </el-form-item>

          <el-form-item label="新密码">
            <el-input type="password" v-model="new_password"></el-input>
          </el-form-item>

          <el-form-item label="重复密码">
            <el-input type="password" v-model="confirm_password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button round v-on:click="change">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    name: 'index',
    data: function() {
      return {
        old_password: '',
        new_password: '',
        confirm_password: '',
        loading: false
      }
    },
    methods: {
      change: function(event) {
        this.loading = true
        request({
          url: '/api/password/update',
          method: 'post',
          data: {
            old_password: this.old_password,
            new_password: this.new_password,
            confirm_password: this.confirm_password
          }
        }).then(res => {
          this.loading = false
          if (res.success === false) {
            this.$alert(res.err_msg, '修改失败', {
              confirmButtonText: '好'
            })
          } else {
            this.old_password = ''
            this.new_password = ''
            this.confirm_password = ''
            this.$message('修改成功')
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
