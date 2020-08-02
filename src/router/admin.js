import Layout from './../views/layout'

export default {
  path: '/admin',
  name: 'Admin',
  showRoot: true,
  meta: {
    icon: 'icon-huiyuan',
    title: '会员管理'
  },
  component: Layout,
  children: [
    {
      path: 'list',
      name: 'member-list',
      component: () =>
        import(/* webpackChunkName: "member-list" */ './../views/admin/member'),
      meta: {
        noCache: true,
        title: '会员列表'
      }
    },
    {
      path: 'register',
      name: 'register-list',
      component: () =>
        import(/* webpackChunkName: "admin-register" */ './../views/admin/register'),
      meta: {
        noCache: true,
        title: '注册列表'
      }
    }
  ]
}
