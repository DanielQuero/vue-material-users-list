import Vue from 'vue'
import App from './App.vue'

import router from './router'

import store from './store'

import vuetify from './plugins/vuetify'

// MomentJs (dates formatting)
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')
Vue.prototype.$moment = moment

// global styles
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.sass'

// global bus
const EventBus = new Vue()
Vue.prototype.$bus = EventBus

// Componente para imprimir un json como csv
import JsonCSV from 'vue-json-csv'
Vue.component('downloadCsv', JsonCSV)

import './utils/leafletMap.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
