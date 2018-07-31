<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">注册</h3>

      <el-row>
        <el-col :xs="0" :sm="3" :md="4" :lg="8" :xl="8">&nbsp;</el-col>
        <el-col :xs="24" :sm="18" :md="16" :lg="8" :xl="8">
          <el-form-item prop="username" v-if="!codeVerified">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input name="invitation_code" type="text" v-loading="codeLoading" @blur="verifyInvCode" v-model="loginForm.invitation_code" autoComplete="off" placeholder="邀请码" />
          </el-form-item>
          <div class="invite-user" v-if="codeVerified">邀请用户: {{ inviteUser }}</div>
        </el-col>

      </el-row>

      <el-row v-if="codeVerified">
        <el-col :xs="0" :sm="3" :md="4" :lg="8" :xl="8">&nbsp;</el-col>
        <el-col :xs="24" :sm="18" :md="16" :lg="8" :xl="8">
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
          </el-form-item>
        </el-col>

      </el-row>

      <el-row v-if="codeVerified">
        <el-col :xs="0" :sm="3" :md="4" :lg="8" :xl="8">&nbsp;</el-col>
        <el-col :xs="24" :sm="18" :md="16" :lg="8" :xl="8">
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
            <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
                      placeholder="密码"></el-input>
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="codeVerified">
        <el-col :xs="0" :sm="3" :md="4" :lg="10" :xl="10">&nbsp;</el-col>
        <el-col :xs="24" :sm="18" :md="16" :lg="4" :xl="4">
          <el-form-item>
            <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
              注册
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="codeVerified">
        <el-col :xs="0" :sm="3" :md="4" :lg="10" :xl="10">&nbsp;</el-col>
        <el-col :xs="24" :sm="18" :md="16" :lg="4" :xl="4">
          <el-form-item>
            <router-link to="/login" tag="el-button" style="width:100%;" plain>
              登录
            </router-link>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
  import { isvalidUsername } from '@/utils/validate'
  import request from '@/utils/request'

  export default {
    name: 'index',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 4) {
          callback(new Error('密码不能小于4位'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: '',
          invitation_code: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }]
        },
        loading: false,
        codeLoading: false,
        pwdType: 'password',
        codeVerified: false,
        inviteUser: ''
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      verifyInvCode() {
        this.codeLoading = true
        request({
          url: '/invitation_code/verify',
          method: 'post',
          data: {
            invitation_code: this.loginForm.invitation_code
          }
        }).then(res => {
          this.codeLoading = false
          if (res.success === true) {
            this.codeVerified = true
            this.inviteUser = res.data
          }
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            request({
              url: '/register',
              method: 'post',
              data: {
                username: this.loginForm.username,
                password: this.loginForm.password,
                invitation_code: this.loginForm.invitation_code
              }
            }).then(res => {
              this.loading = false

              if (res.success === true) {
                this.$alert('注册成功', '成功', {
                  confirmButtonText: '前往登录'
                })
                this.$router.push({ path: '/' })
              } else {
                this.$alert(res.err_msg, '失败', {
                  confirmButtonText: '好'
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $light_gray:#eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
  .invite-user {
    color: $light_gray;
    text-align: center;
    margin-bottom: 2em;
  }
</style>
