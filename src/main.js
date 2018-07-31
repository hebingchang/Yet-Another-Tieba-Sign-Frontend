import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import VueClipboard from 'vue-clipboard2'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faComments, faCalendarAlt, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUser, faComments, faCalendarAlt, faStar)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueClipboard)
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  http: {
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  },
  render: h => h(App)
})
