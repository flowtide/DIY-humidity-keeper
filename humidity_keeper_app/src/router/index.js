import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/device-edit/:_id',
    name: 'DeviceEdit',
    component: () => import('../views/DeviceEdit.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reading-data/:_id',
    name: 'ReadingData',
    component: () => import('../views/ReadingData.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reading-chart/:_id',
    name: 'ReadingChart',
    component: () => import('../views/ReadingChart.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
