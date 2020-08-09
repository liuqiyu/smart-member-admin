import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from './router'
import getPageTitle from '@/utils/get-page-title'

router.beforeEach((to, from, next) => {
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (sessionStorage.getItem('token')) {
    next()
  } else {
    if (!to.meta.noLogin) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {
  // ...
  NProgress.done()
})
