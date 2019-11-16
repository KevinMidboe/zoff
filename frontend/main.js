import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './routes'
import store from './store'

import App from './App.vue'

Vue.use(VueRouter)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  render: h => h(App)
})