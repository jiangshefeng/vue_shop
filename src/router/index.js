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
import List from '../components/goods/List.vue'
import Add from '../components/goods/add.vue'
import order from '../components/order/order.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: login },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      { path: '/home/welcome', component: Welcome },
      { path: '/home/users', component: Users },
      { path: '/home/rights', component: right },
      { path: '/home/roles', component: roles },
      { path: '/home/categories', component: Cate },
      { path: '/home/params', component: Params },
      { path: '/home/goods', component: List },
      { path: '/home/goods/add', component: Add },
      { path: 'orders', component: order }
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
