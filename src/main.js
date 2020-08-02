/*
 * @Description: main
 * @Author: liuqiyu
 * @Date: 2019-10-09 14:47:52
 * @LastEditors  : liuqiyu
 * @LastEditTime : 2019-12-26 17:09:47
 */
import Vue from 'vue'
import '@babel/polyfill'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import SmartUi from './components'
import './style/index.scss'
import http from './utils/http'
import * as filters from '@/utils/filter'
import './permission'
// import * as api from './api'
// console.log(api)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.config.devtools = true

// 检测 localStorage 是否超出容量
try {
  localStorage.setItem('checklocalstorage', 1)
  localStorage.removeItem('checklocalstorage')
} catch (e) {
  localStorage.clear()
}

Vue.use(ElementUI, {
  size: 'mini'
})
Vue.use(SmartUi)

Vue.prototype.$http = http
// Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
