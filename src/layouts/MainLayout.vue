<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Flourish.Finance
        </q-toolbar-title>

        <div>
          <MultichainWallet units="ether" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
 import EssentialLink from 'components/EssentialLink.vue'
 import MultichainWallet from 'components/MultichainWallet.vue'
 
 const linksData = [
   {
     title: 'Github',
     caption: 'github.com/bkroeze/flourish-ui',
     icon: 'code',
     link: 'https://github.com/bkroeze/flourish-ui'
   },
   {
     title: 'Bruce\'s Twitter',
     caption: '@CryptoArchon',
     icon: 'rss_feed',
     link: 'https://twitter.com/cryptoarchon'
   }
 ];

 export default {
   name: 'MainLayout',
   components: { EssentialLink, MultichainWallet },
   data () {
     return {
       leftDrawerOpen: false,
       essentialLinks: linksData
     }
   }
 }
</script>
