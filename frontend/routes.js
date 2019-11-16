import Vue from 'vue'
import VueRouter from 'vue-router';

Vue.use(VueRouter)

let routes = [
  {
    name: 'player',
    path: '/player',
    component: (resolve) => require(['./components/Player.vue'], resolve)
  },
  {
    name: 'styleguide',
    path: '/styleguide',
    component: (resolve) => require(['./components/Styleguide.vue'], resolve)
  },
  // {
  //   name: '404',
  //   path: '/404',
  //   component: (resolve) => require(['./components/404.vue'], resolve)
  // }
];

const router =  new VueRouter({
  mode: 'hash',
  base: '/',
  routes,
  linkActiveClass: 'is-active'
});

export default router;