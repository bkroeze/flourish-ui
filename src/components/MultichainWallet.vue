<template>
  <div>
    <div>{{ network.name }} Network</div>
    <WalletAccounts :units="units" :symbol="network.symbol" />
  </div>
</template>

<script>
 import { mapGetters } from 'vuex'
 import WalletAccounts from './WalletAccounts.vue'

 const NETWORKS = {
   '137': { name: 'Polygon Mainnet', symbol: 'MATIC' },
   '1': { name: 'Ethereum Mainnet', symbol: 'ETH' },
   '1666600000': { name: 'Harmony Mainnet/0', symbol: 'ONE' },
   '56': { name: 'Binance Smart Chain Mainnet', symbol: 'BNB' }
 };
 
 export default {
   components: { WalletAccounts },
   props: {
     units: {
       type: String,
       default: 'Wei'
     },
     precision: {
       type: Number,
       default: 2
     }
   },
   computed: {
     ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized'])
   },
   mounted() {
     this.checkForNetwork();
   },
   data() {
     return {
       network: { name: '?', symbol: '???' }
     }
   },
   methods: {
     checkForNetwork: function() {
       if (this.isDrizzleInitialized) {
         this.drizzleInstance.web3.eth.net.getId()
             .then((id) => {
               console.log('got id from drizzle');
               const network = NETWORKS[id];
               if (network) {
                 this.network = network;
               };
             });
       } else {
         console.log('waiting for drizzle connection');
   setTimeout(() => this.checkForNetwork(), 1000);
       }
     }
   }
 }
</script>
