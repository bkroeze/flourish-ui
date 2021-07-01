/* eslint-disable */
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  initialized: false,
  connected: false,
  error: null,
  // user is ens or address
  user: '',
  address: '',
  network: {
    "name": "Disconnected",
    "chainId": 0,
    "shortName": "disconnected",
    "chain": "ETH",
    "network": "-",
    "networkId": "0",
    "nativeCurrency": {"name":"Ether","symbol":"ETH","decimals":18},
    "rpc": ["https://localhost:8543"],
    "faucets": []
  },
  ens: null
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
