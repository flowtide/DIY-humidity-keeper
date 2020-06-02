import Vue from 'vue'
import Vuex from 'vuex'
var _ = require('lodash')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: null,
      userId: '',
      email: '',
      name: '',
      isAdmin: false
    },
    devices: [],
    sensors: [],
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user.id
    },
    currentUser(state) {
      return state.user
    },
    findDevice: (state) => (id) => {
      return _.find(state.devices, { 'id': id });
    },
  },
  mutations: {
    CURRENT_USER_FETCHED(state, user) {
      console.log('CURRENT_USER_FETCHED', user)
      state.user.id = user.id
      state.user.userId = user.userId
      state.user.email = user.email
      state.user.name = user.name
      state.user.isAdmin = user.isAdmin
    },
    CURRENT_USER_REMOVED(state) {
      console.log('CURRENT_USER_REMOVED')
      state.user.id = null
      state.user.userId = ''
      state.user.email = ''
      state.user.name = ''
      state.user.isAdmin = false
    },
    DEVICES_FETCHED(state, devices) {
      console.log('DEVICES_FETCHED', devices)
      state.devices = devices
    },
  },
  actions: {
    async initialLoad(context) {
      if (localStorage.authToken) {
        //console.log('check current user with token:', localStorage.authToken)
        Vue.axios.defaults.headers.common.Authorization = `Bearer ${localStorage.authToken}`
        const response = await Vue.axios.get("/api/v1/auth/current-user")
        if (response.data.error) {
          console.log('response.data=', response.data)
          throw response.data.error.message
        }
        context.commit("CURRENT_USER_FETCHED", response.data.data)
      } else {
        /*
        var user = {}
        user.id = 1
        user.email = 'admin@test.com'
        user.name = 'test'
        context.commit("CURRENT_USER_FETCHED", user)
        */
      }
    },

    async login(context, idPassword) {
      console.log(`idPassword=${idPassword}`)
      const response = await Vue.axios.post("/api/v1/auth/login", idPassword)
      //console.log('login response:', response.data)
      if (response.data.error) {
        throw response.data.error.message
      }
      else {
        let user = response.data.data
        let token = response.data.token
        localStorage.setItem('authToken', token)
        //console.log('jwt:', token)
        Vue.axios.defaults.headers.common.Authorization = `Bearer ${token}`
        context.commit("CURRENT_USER_FETCHED", user)
      }
    },

    async logout(context) {
      delete Vue.axios.defaults.headers.common.Authorization
      localStorage.removeItem('authToken')
      context.commit("CURRENT_USER_REMOVED")
    },

    async fetchDevices(context) {
      const response = await Vue.axios.get("/api/v1/devices/all")
      context.commit("DEVICES_FETCHED", response.data.data)
    }
  },
  modules: {
  }
})
