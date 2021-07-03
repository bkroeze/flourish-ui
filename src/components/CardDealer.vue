<template>
    <q-card-section>
      <slot name="title"></slot>
      <slot name="subtitle"></slot>
      <slot name="description"></slot>
      <div class="row">
        <div class="col-4">Deck Size:</div>
        <div class="col-4">{{ totalCards }}</div>
      </div>
      <div class="row">
        <div class="col-4">Cards Left:</div>
        <div class="col-4">{{ remaining }}</div>
      </div>
      <q-separator dark />

      <q-card-actions align="around">
        <q-btn
          :disabled="!deck"
          @click="deal"
        >Deal 1 Card</q-btn>
        <q-chip size="sm" icon="mdi-hand-heart-outline">{{ price === '?' ? '?' : formatUnits(price) }} {{ network.nativeCurrency.symbol }}</q-chip>
      </q-card-actions>
    </q-card-section>
</template>

<script>
 import { utils } from 'ethers';
 import { getLogger } from '../config/logger'

 const log = getLogger('CardDealer')
 
 export default {
   name: 'CardDealer',
   props: ['deck', 'network', 'address'],
   methods: {
     deal: function() {
       const { deck, price } = this;
       deck
         .estimateGas.dealCard({
           value: price
         })
         .then((gasLimit) => {
           log.info({ctx: 'deal', gasLimit: utils.formatUnits(gasLimit, 'gwei')})
           return deck.dealCard({
             value: price,
             gasLimit: gasLimit
           })
         })
         .then((rv) => {
           log.info({ctx: 'deal', msg: 'complete', rv});
         })
     },
     readDeck: async function(deck) {
       log.info('reading deck');
       this.remaining = await deck.remaining();
       this.price = await deck.getPrice();
       this.totalCards = await deck.getDeckSize();
     },
     formatUnits: utils.formatUnits
   },
   watch: {
     deck: function(newDeck, oldDeck) {
       if (newDeck && newDeck !== oldDeck) {
         this.readDeck(newDeck);
       }
     }
   },
   data () {
     return {
       price: '?',
       remaining: 'Loading ...',
       totalCards: 'Loading ...'
     }
   }
 }
</script>
