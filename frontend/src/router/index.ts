import { createRouter, createWebHistory } from 'vue-router'
import NProgress from '../plugins/nprogress'
import layout from '../layouts/layout.vue'
import middleware from './middleware'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/login.vue') },
    {
      path: '/',
      component: layout,
      children: [
        { path: 'dashboard', component: () => import('../views/dashboard.vue') },
        { path: 'users', component: () => import('../views/users.vue') },
        { path: 'tasks', component: () => import('../views/tasks.vue') },
      ],
      meta: { auth: true }
    },
    { path: '/:catchAll(.*)', component: () => import('../views/error.vue') }
  ]
})

router.afterEach(() => { NProgress.done() }) // 完成进度条
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 启动进度条

  await middleware.getUser()
  if (to.matched.some(r => r.meta.auth) && !middleware.user.id) return next({ path: '/' }) // 用户权限

  next()
})

export default router
