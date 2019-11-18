import Vue from 'vue'
import VueRouter from 'vue-router'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import router from './routes'
import store from './store'

import App from './App.vue'

Vue.use(VueRouter)

new Vue({
  vuetify,
  el: '#app',
  router,
  store,
  components: { App },
  render: h => h(App)
})