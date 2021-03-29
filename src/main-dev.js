import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import nprogress from 'nprogress'

// 导入nprogress包对应的css
import 'nprogress/nprogress.css'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  nprogress.start()
  config.headers.Authorization = sessionStorage.getItem('token')

  return config
})
// 在response拦截器中隐藏进度条
axios.interceptors.response.use(
  config => {
    nprogress.done()
    return config
  }
)
Vue.filter('dateFormat', function (val) {
  const dt = new Date(val)
  const Y = dt.getFullYear()
  const M = (dt.getMonth() + 1 + '').padStart(2, '0')
  const D = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${Y}-${M}-${D} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
