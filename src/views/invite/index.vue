<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <el-card class="box-card" v-loading="loading" element-loading-text="更新中">
      <div slot="header" class="clearfix">
        <span>我的邀请码</span>
      </div>
      <div class="text item">
        <el-button @click="apply" round>申请邀请码</el-button>

        <el-table
          :data="codes"
          style="width: 100%"
          height="600px"
          :default-sort = "{prop: 'created_at', order: 'descending'}"
        >

          <el-table-column
            prop="id"
            label="#"
            width="70px"
            sortable
            fixed>
          </el-table-column>

          <el-table-column
            label="邀请码"
            width="200px"
            sortable>
            <template slot-scope="scope">
              <code>{{ scope.row.code }}</code>
              <el-tooltip class="item" effect="dark" content="复制" placement="top">
              <el-button type="button" icon="el-icon-document" circle
                      v-clipboard:copy="scope.row.code"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            label="已使用"
            sortable>
            <template slot-scope="scope">
              <p v-if="scope.row.has_used"><i class="el-icon-circle-check-outline"></i> 是</p>
              <p v-if="!scope.row.has_used"><i class="el-icon-remove-outline"></i> 否</p>
            </template>
          </el-table-column>

          <el-table-column
            label="使用用户"
            sortable
            width="100px">
            <template slot-scope="scope">
              <p v-if="scope.row.has_used">{{ scope.row.used_user.name }}</p>
              <p v-if="!scope.row.has_used">N/A</p>
            </template>
          </el-table-column>


          <el-table-column
            prop="created_at"
            label="申请时间"
            sortable
            width="200px">
          </el-table-column>

          <el-table-column
            label="使用时间"
            sortable
            width="200px">
            <template slot-scope="scope">
              <p v-if="scope.row.has_used">{{ scope.row.updated_at }}</p>
              <p v-if="!scope.row.has_used">N/A</p>
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
    name: 'invite',
    data: function() {
      return {
        codes: [],
        loading: false
      }
    },
    created: function() {
      this.refresh()
    },
    methods: {
      refresh() {
        request({
          url: '/api/invitation_code/get',
          method: 'get'
        }).then(res => {
          this.codes = res.data
        })
      },
      onCopy() {
        this.$message('复制成功')
      },
      onError() {
        this.$message('复制失败')
      },
      apply: function() {
        this.loading = true
        request({
          url: '/api/invitation_code/add',
          method: 'get'
        }).then(res => {
          this.loading = false
          if (res.success === true) {
            this.$alert('您的邀请码: <br /><code>' + res.data.code + '</code><button type="button"\n' +
              '      v-clipboard:copy="' + res.data.code + '"复制</button>\n', '申请成功', {
              confirmButtonText: '好',
              dangerouslyUseHTMLString: true
            })
            this.refresh()
          } else {
            this.$alert(res.err_msg, '申请失败', {
              confirmButtonText: '好'
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
