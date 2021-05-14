<template>
  <vth-status deferred>
    <template slot-scope="web3">
      <div v-if="web3.loading">{{ loadingMessage }}</div>

      <div v-else-if="web3.account">
        <div>
          {{ netName(web3.networkVersion) }}
        </div>
        <LimitedText :limit=accountLimit :text="web3.account"></LimitedText>
      </div>

      <div v-else>
        <q-btn @click="web3.getWeb3" :label="connectMessage" />
      </div>
    </template>
  </vth-status>
</template>

<script>

 import { pathOr } from 'ramda'
 import LimitedText from 'components/LimitedText.vue'

const NETWORKS = {
   '137': { name: 'Polygon Mainnet', symbol: 'MATIC' },
   '1': { name: 'Ethereum Mainnet', symbol: 'ETH' },
   '1666600000': { name: 'Harmony Mainnet/0', symbol: 'ONE' },
   '0x63564c40': { name: 'Harmony Mainnet/0', symbol: 'ONE' },
   '56': { name: 'Binance Smart Chain Mainnet', symbol: 'BNB' }
 }

const netName = (netId) => pathOr(`Unknown Network ${netId}`, [netId, 'name'], NETWORKS)
 
 export default {
   name: 'WalletStatus',
   components: { LimitedText },
   props: {
     accountLimit: {
       type: Number,
       default: 16
     },
     connectMessage: {
       type: String,
       default: 'Connect Wallet'
     },
     loadingMessage: {
       type: String,
       default: 'Loading...'
     },
     deferred: {
       type: Boolean,
       default: true
     },
   },
   methods: {
     netName
   }
 }
</script>
