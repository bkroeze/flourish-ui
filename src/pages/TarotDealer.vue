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
      <div class="col-8 offset-1">
        <div class="text-h5 text-secondary">Your Cards</div>
        <div class="row">
        <CardDisplay
          v-for="card in ownedCards"
          v-bind="card"
          :key="card.index"
        />
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
 import { getMetadata, urlFormat } from '../util/nfts';
 import { getLogger } from '../config/logger';

 const log = getLogger('TarotDealer');
 
 export default {
   name: 'TarotDealer',
   components: { CardDisplay, CardDealer },
   computed: {
     ...mapState('eth', ['user', 'address', 'network'])
   },
   methods: {
     attachContracts: function attachContracts(address) {
       if (!address) {
         log.warn('removing rws0 contract - no address')
         this.rws0 = null
       } else {
         const self = this
         this.wallet = getWallet()
         const { rws0 } = contracts
         const rws0Contract = new Contract(rws0.address, rws0.abi, this.wallet);
         this.rws0 = rws0Contract
         rws0Contract.on("Card", (owner, uri, index) => {
           log.info({ctx: 'Card event', owner, uri, index});
           if (owner === address) {
             log.info('reloading deck');
             self.readDeck(rws0Contract)
           }
         })
         this.readDeck(rws0Contract);
       }
     },
     inspect: function inspect(val) {
       return `[${JSON.stringify(val, null, 2)}]`
     },
     readDeck: async function readDeck(deck) {
       const status = {ctx: 'readDeck', deck: deck.address}
       log.info(status)
       // get owned cards
       const ownedCt = await deck.balanceOf(this.address)
       log.info({ ...status, owned: ownedCt.toNumber() });
       const owned = [];
       let card;
       for (let ix = 0; ix < ownedCt; ix++) {
         card = await this.readCard(deck, ix)
         if (card) owned.push(card);
       }
       this.ownedCards = owned;
     },
     readCard: async function readCard(deck, ix) {
       const status = {ctx: 'readCard', card: ix}
       log.info(status)
       try {
         const tokenId = await deck.tokenOfOwnerByIndex(this.address, ix)
         const uri = await deck.tokenURI(tokenId)
         const meta = await getMetadata(uri)
         log.debug({ ...status, meta})
         const card = {
           index: ix,
           tokenId,
           uri,
           meta,
           image: urlFormat(meta.image)
         }
         log.info({ ...status, card })
         return card
       } catch (err) {
         console.error(err);
       }1
       return null
     }
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
