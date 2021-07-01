<template>
  <q-page padding>
    <q-chip size="lg" icon="mdi-cards-playing-outline">Tarot Dealer</q-chip>
    <div class="row">
      <div class="col-12">
        <h1>Active Decks</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-3">
        <div class="text-h5 text-secondary">Deck</div>
        <q-card class="active-deck bg-secondary text-white">
          <CardDealer :deck="rws0" :network="network">
            <div slot="title" class="text-h6">Rider-Waite-Smith Tarot</div>
            <div slot="subtitle" class="text-subtitle2">LoRez - v0.1.</div>
            <div slot="description">
              <p>Try it out in beta.</p>
              <p>This is a full 78 card tarot deck, featuring fresh, cleaned up scans of the art.</p>
              <p>When you deal a card from this deck, paying the fee it shows below, the Dealer will send the NFT to your address.  We will watch, and show it to the right when it is yours.</p>
            </div>
          </CardDealer>
        </q-card>
      </div>
      <div class="col-5 offset-1">
        <div class="text-h5 text-secondary">Your Cards</div>
        <CardDisplay
          v-for="card in ownedCards"
          v-bind="card"
          :key="card.index"
        />
        <div>
          <p>User: <pre>{{ user }}</pre></p>
        </div>
        
      </div>
    </div>
  </q-page>
</template>

<script>
 import { Contract } from 'ethers';
 import CardDisplay from 'components/CardDisplay.vue'
 import CardDealer from 'components/CardDealer.vue'
 import { mapState } from 'vuex'
 import contracts from '../config/contracts'
 import { getWallet } from '../store/ethereum/ethersConnect';

 // TODO: figure out how to get the wallet when I want to work on things
 
 export default {
   name: 'TarotDealer',
   components: { CardDisplay, CardDealer },
   computed: {
     ...mapState('eth', ['user', 'address', 'network'])
   },
   methods: {
     attachContracts: function(address) {
       if (!address) {
         console.log('removing rws0 contract - no address')
         this.rws0 = null;
       } else {
         const self = this;
         this.wallet = getWallet();
         console.log('wallet', this.wallet._isSigner)
         const { rws0 } = contracts;
         this.rws0 = new Contract(rws0.address, rws0.abi, this.wallet);
         console.log('contract complete');
       }
     },
     inspect: function inspect(val) {
       return `[${JSON.stringify(val, null, 2)}]`
     },
   },
   watch: {
     address: function(newAddress, oldAddress) {
       if (newAddress !== oldAddress) {
         this.attachContracts(newAddress);
       }
     }
   },
   data () {
     return {
       rws0: null,
       ownedCards: [],
       contracts,
       wallet: null
     }
   },
}
</script>
