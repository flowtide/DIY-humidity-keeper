import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/';

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/device-edit/:id',
    name: 'deviceEdit',
    component: () => import('../views/DeviceEdit.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reading-data/:id',
    name: 'readingData',
    component: () => import('../views/ReadingData.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reading-chart/:id',
    name: 'readingChart',
    component: () => import('../views/ReadingChart.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../views/Logout.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user-edit',
    name: 'userEdit',
    component: () => import('../views/UserEdit.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/rules',
    name: 'rules',
    component: () => import('../views/Rules.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/rule-edit/:id',
    name: 'ruleEdit',
    component: () => import('../views/RuleEdit.vue'),
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

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      let user = store.state.user
      console.log(`router -> '${to.fullPath}' id=${user.id}`)
      if (!user.id) {
        next({
            path: '/login',
            params: { nextUrl: to.fullPath }
          })
      } else {
        if (to.matched.some(record => record.meta.admin)) {
            if(user.isAdmin) {
              next()
            }
            else{
              next({ name: 'home'})
            }
        } else {
          next()
        }
      }
  } else {
    console.log('router -> navigating a guest page:', to.fullPath)
    next()
  }
})

export default router
