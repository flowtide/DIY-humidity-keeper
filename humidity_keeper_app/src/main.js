import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"
import axios from "axios"
import VueAxios from "vue-axios"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from './filters'
import CenteredLoader from './components/global/CenteredLoader'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)  // import all icon
Vue.use(VueAxios, axios)
Vue.use(filters)
Vue.component('centered-loader', CenteredLoader)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
