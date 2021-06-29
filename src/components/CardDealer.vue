<template>
    <q-card-section>
      <slot name="title"></slot>
      <slot name="subtitle"></slot>
      <slot name="description"></slot>
      <div class="row">
        <div class="col-3">Cards Left:</div>
        <div class="col-2">78</div>
      </div>
      <q-separator dark />

      <q-card-actions align="around">
        <q-btn
          :disabled="!user"
          @click="deal(decRWS0)"
        >Deal 1 Card</q-btn>
        <q-chip
          size="sm" icon="mdi-hand-heart-outline"
          :title="contract"
        >1 MATIC</q-chip>
      </q-card-actions>
    </q-card-section>
</template>

<script>
import { Contract } from 'ethers'
 
 export default {
   name: 'CardDealer',
   props: ['contract', 'wallet'],
   computed: {
     deckRWS0: function () {
       return this.userWallet ? new Contract(this.contract.address, this.contract.abi, this.wallet) : null;
     }
   },
   methods: {
     deal: (contract) => {
       console.log(`Deal: ${contract}`);
     }
   },
   data () {
     return {}
   }
 }
</script>
