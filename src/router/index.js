import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Homepage',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/baidu',
    component: Layout,
    redirect: '/baidu/bduss',
    name: 'Baidu',
    meta: { title: '百度账号', icon: 'example' },
    children: [
      {
        path: 'bduss',
        name: 'BDUSS',
        component: () => import('@/views/bduss/index'),
        meta: { title: '绑定 BDUSS', icon: 'table' }
      },
      {
        path: 'forums',
        name: 'Forums',
        component: () => import('@/views/forums/index'),
        meta: { title: '我的贴吧', icon: 'tree' }
      }
    ]
  },

  {
    path: '/sign',
    component: Layout,
    redirect: '/sign/records',
    name: 'Sign',
    meta: { title: '签到', icon: 'nested' },
    children: [
      {
        path: 'records',
        component: () => import('@/views/records/index'),
        name: 'Record',
        meta: { title: '签到记录', icon: 'tree' }
      }
    ]
  },

  {
    path: '/my',
    component: Layout,
    redirect: '/my/password',
    name: 'My',
    meta: { title: '我的', icon: 'user' },
    children: [
      {
        path: 'password',
        component: () => import('@/views/password/index'),
        name: 'Password',
        meta: { title: '修改密码', icon: 'password' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

