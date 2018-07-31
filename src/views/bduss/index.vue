<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading" element-loading-text="绑定中">
      <div slot="header" class="clearfix">
        <span>绑定新的 BDUSS</span>
      </div>
      <div class="text item">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="百度 APP 扫码" name="qrcode">
            <div style="text-align: center;">
              <img v-bind:src="qrcode.imgurl" style="width: 200px; margin-bottom: 1em;">
              <div v-if="!qrScanned">使用"手机百度"APP扫码以绑定BDUSS</div>
              <div v-if="qrScanned"><i class="el-icon-success" style="font-size: 1.2em"></i> 扫码成功，请在手机上确认操作</div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="手动输入" name="custom">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="BDUSS">
                <el-input v-model="bduss"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button round v-on:click="bind">绑定</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>已绑定的 BDUSS</span>
      </div>
      <div class="text item">
        <el-table
          :data="bdusses"
          style="width: 100%"
          :default-sort = "{prop: 'created_at', order: 'descending'}"
        >
          <el-table-column
            prop="baidu_name"
            label="百度ID"
            sortable>
          </el-table-column>
          <el-table-column
            label="BDUSS"
            sortable
          >
            <template slot-scope="scope">
              <code>{{ scope.row.bduss }}</code>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="添加时间"
            sortable>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
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
        bduss: '',
        bdusses: [],
        loading: false,
        activeName: 'qrcode',
        qrcode: {},
        qrScanned: false
      }
    },
    created: function() {
      this.refresh()
      this.refreshQR()
    },
    methods: {
      handleClick(tab, event) {
        var name = tab.$options.propsData.name
        if (name === 'qrcode') {
          this.refreshQR()
        }
      },
      refreshQR: function() {
        this.qrScanned = false
        request({
          url: '/api/baidu/qrcode',
          method: 'get'
        }).then(res => {
          this.qrcode = res.data
          this.qrcode.imgurl = 'https://' + this.qrcode.imgurl
          this.pollQR()
        })
      },
      pollQR: function() {
        request({
          url: '/api/baidu/qrcode/poll',
          method: 'post',
          data: {
            sign: this.qrcode.sign
          }
        }).then(res => {
          if (res.success === false) {
            this.qrcode.imgurl = process.env.BASE_API + 'images/qrcode_expire.png'
          } else if (res.data.status === 1) {
            this.qrScanned = true
            request({
              url: '/api/baidu/qrcode/poll',
              method: 'post',
              data: {
                sign: this.qrcode.sign
              }
            }).then(res => {
              console.log(res)
              if (res.data.status === 0) {
                var v = res.data.v

                request({
                  url: '/api/baidu/qrcode/bduss',
                  method: 'post',
                  data: {
                    v: v
                  }
                }).then(res => {
                  this.bduss = res.data
                  this.bind()
                  this.refreshQR()
                })
              }
            })
          }
        })
      },
      refresh: function() {
        request({
          url: '/api/bduss/get',
          method: 'get'
        }).then(res => {
          this.bdusses = res.data
        })
      },
      bind: function(event) {
        this.loading = true
        request({
          url: '/api/bduss/bind',
          method: 'post',
          data: {
            bduss: this.bduss
          }
        }).then(res => {
          this.loading = false
          if (res.success === false) {
            this.$alert(res.err_msg, '绑定失败', {
              confirmButtonText: '好',
              callback: action => {
                this.bduss = ''
              }
            })
          } else {
            this.$alert('您已绑定百度账号 ' + res.user_info.user.name, '绑定成功', {
              confirmButtonText: '好',
              callback: action => {
                this.bduss = ''
                this.refresh()
              }
            })
          }
        })
      },
      handleDelete: function(row) {
        request({
          url: '/api/bduss/delete',
          method: 'post',
          data: {
            id: row.id
          }
        }).then(res => {
          if (res.success === false) {
            this.$alert(res.body.err_msg, '删除失败', {
              confirmButtonText: '好'
            })
          } else {
            this.$alert('BDUSS 删除成功', '删除成功', {
              confirmButtonText: '好',
              callback: action => {
                this.refresh()
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .box-card {
    margin-bottom: 1em
  }
</style>
