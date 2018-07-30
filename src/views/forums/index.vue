<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading" element-loading-text="更新中">
      <div slot="header" class="clearfix">
        <span>用户关注的贴吧</span>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="百度账号">
            <el-select v-model="bduss_id" placeholder="请选择账户" @change="refresh">
              <el-option :label="item.baidu_name" :value="item.id" v-for="item in bdusses" :key="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="bduss_id != null">
            <el-button @click="update">全部更新</el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="forums"
          style="width: 100%"
          height="600px"
          :default-sort = "{prop: 'created_at', order: 'descending'}"
        >

          <el-table-column
            label="贴吧名称"
            sortable
            fixed
            width="150px">
            <template slot-scope="scope">
              <a :href="'http://tieba.baidu.com/f?kw=' + scope.row.forum_name" class="el-button el-button--text" style="text-decoration: none;" target="_blank"><span>{{ scope.row.forum_name }}</span></a>

            </template>
          </el-table-column>

          <el-table-column
            prop="forum_id"
            label="贴吧ID"
            sortable
            width="150px">
          </el-table-column>

          <el-table-column
            prop="level_id"
            label="当前等级"
            sortable
            width="150px">
          </el-table-column>

          <el-table-column
            prop="level_name"
            label="等级名称"
            sortable
            width="100px">
          </el-table-column>

          <el-table-column
            prop="cur_score"
            label="当前积分"
            sortable
            width="100px">
          </el-table-column>

          <el-table-column
            prop="created_at"
            label="更新时间"
            sortable
            width="200px">
          </el-table-column>

        </el-table>

      </div>
    </el-card>
  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    name: 'forums',
    data: function() {
      return {
        bdusses: [],
        bduss_id: null,
        loading: false,
        forums: []
      }
    },
    created: function() {
      request({
        url: '/api/bduss/get',
        method: 'get'
      }).then(res => {
        this.bdusses = res.data
      })
    },
    methods: {
      refresh: function() {
        request({
          url: '/api/forums/get',
          method: 'post',
          data: {
            bduss_id: this.bduss_id
          }
        }).then(res => {
          this.forums = res.data
        })
      },
      update: function() {
        this.loading = true
        var vm = this

        request({
          url: '/api/forums/update',
          method: 'post',
          data: {
            bduss_id: this.bduss_id
          }
        }).then(res => {
          vm.loading = false
          if (res.success === true) {
            this.$message('贴吧更新成功')
            this.refresh()
          } else {
            this.$alert(res.err_msg, '更新失败', {
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
