import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/user/users.vue'
import right from '../components/power/right.vue'
import roles from '../components/power/roles.vue'
import Cate from '../components/goods/cate.vue'
import Params from '../components/goods/Params.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: login },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      { path: 'welcome', component: Welcome },
      { path: 'users', component: Users },
      { path: 'rights', component: right },
      { path: 'roles', component: roles },
      { path: 'categories', component: Cate },
      { path: 'params', component: Params }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
  }
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) {
    next('/login')
  } else {
    next()
  }
})

export default router
