<template>
  <div v-if="user">
    <q-btn flat>{{ network.name }}</q-btn>
    <q-btn @click="disconnect">
      <LimitedText :limit=accountLimit :text="user"></LimitedText>
    </q-btn>
  </div>
  <div v-else>
    <q-btn @click="connect" :label="connectMessage" />
  </div>
</template>

<script>

 import { pathOr } from 'ramda'
 import { mapState, mapActions } from 'vuex'
 import LimitedText from 'components/LimitedText.vue'
 
 export default {
   name: 'EthWalletStatus',
   components: { LimitedText },
   computed: {
     ...mapState('eth', ['connected', 'user', 'network'])
   },
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
     }
   },
   methods: {
     ...mapActions('eth', ['connect', 'disconnect'])
   }
 }
</script>
