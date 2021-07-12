import Vue from 'vue'
import Vuex from 'vuex'
import logger from '../config/logger'
import VueApexCharts from 'vue-apexcharts'
import Cryptoicon from 'vue-cryptoicon'
import icon from 'vue-cryptoicon/src/icons'
// modules
import Ethereum from './ethereum'

Vue.use(Vuex)
Vue.use(logger)
Cryptoicon.add(icon)
Vue.use(Cryptoicon)

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      eth: Ethereum
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
