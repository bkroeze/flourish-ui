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
          :disabled="!deck"
          @click="deal"
        >Deal 1 Card</q-btn>
        <q-chip size="sm" icon="mdi-hand-heart-outline">1 MATIC</q-chip>
      </q-card-actions>
    </q-card-section>
</template>

<script>
import { Contract } from 'ethers'
 
 export default {
   name: 'CardDealer',
   props: ['deck'],
   methods: {
     deal: function() {
       console.log('Deal', this.deck);
     }
   },
   data () {
     return {}
   }
 }
</script>
