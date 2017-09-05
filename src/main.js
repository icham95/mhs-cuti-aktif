// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLocalStorage from 'vue-localstorage'
import VueResource from 'vue-resource'
import VueSweetAlert from 'vue-sweetalert'
import Vuelidate from 'vuelidate'
import VueSocket from 'vue-socket.io'

var VueMaterial = require('vue-material')
const vueConfig = require('vue-config')
var hostname = window.location.hostname
// var origin = window.location.origin
const configs = {
  API: 'http://' + hostname + '/cutiff/'
}
Vue.use(vueConfig, configs)
// store vuex
import store from './store'
Vue.use(VueSocket, 'http://' + hostname + ':7777', store)

Vue.use(VueSweetAlert)
Vue.use(VueResource)
Vue.use(VueLocalStorage)
Vue.use(VueMaterial)
Vue.use(Vuelidate)

Vue.config.productionTip = false
// import Push from 'push.js'
/* eslint-disable no-new */
new Vue({
  sockets: {
    connect () {
      this.$localStorage.set('sid', this.$socket.id)
    }
  },
  data () {
    return {
      testing: 'asdadsad'
    }
  },
  localStorage: {
    sid: {
      type: String,
      default: null
    },
    auth: {
      type: Object,
      default: {
        logged: false,
        token: null,
        user: null
      }
    }
  },
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})

Vue.http.options.emulateJSON = true
Vue.http.options.emulateHTTP = true
// Vue.http.options.credentials = true
