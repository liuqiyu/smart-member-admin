import Vue from 'vue'
import Router from 'vue-router'
import Layout from './../views/layout'
import store from './../store'
import { getRoutes } from './../utils/router'
import menuSort from './../utils/menu-sort'

Vue.use(Router)

const routerModule = getRoutes(
  require.context('./', false, /\.js$/),
  './index.js'
)

console.log(routerModule)

// 菜单排序
const menuRouters = []
menuSort.forEach(item => {
  routerModule.forEach(v => {
    if (item === v.meta.title) {
      menuRouters.push(v)
    }
  })
})

console.log(menuRouters)

export const layoutRoutes = [
  {
    path: '',
    redirect: 'dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard'),
        meta: {
          icon: 'icon-shouye',
          activeMenu: '/dashboard',
          title: '首页',
          affix: true
        }
      }
    ]
  },
  ...menuRouters
]

console.log(layoutRoutes)
store.commit('router/SET_ROUTER', layoutRoutes)

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录页',
      noLogin: false
    },
    component: () => import(/* webpackChunkName: "login" */ './../views/user/login')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册页',
      noLogin: false
    },
    component: () => import(/* webpackChunkName: "register" */ './../views/user/register')
  },
  ...layoutRoutes,
  {
    path: '*',
    redirect: '/error/404'
  }
]

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
