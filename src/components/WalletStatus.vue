<template>
  <vth-status deferred>
    <template slot-scope="web3">
      <p v-if="web3.loading">{{ loadingMessage }}</p>

      <p v-else-if="web3.account">
        Your address: {{ web3.account }},
        Network version: {{ web3.networkVersion }}
      </p>

      <p v-else>
        <q-btn @click="web3.getWeb3" :label="connectMessage" />
      </p>
    </template>
  </vth-status>
</template>

<script>
 
 export default {
   name: 'WalletStatus',
   props: {
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
     }
   }
 }
</script>
