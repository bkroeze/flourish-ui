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

        <div><WalletStatus /></div>
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
          Site Sections
        </q-item-label>
        <RoutedLink
          to="aave"
          title="Aave"
          icon="money"
          caption="Historical Graphs and Data"
        />
      </q-list>
      
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
import RoutedLink from 'components/RoutedLink.vue'
import WalletStatus from 'components/WalletStatus.vue'

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

  const routedLinks = [
  {
  title: 'Aave Stats',
  caption: 'Historical data for Aave',
  icon: 'money',
  to: 'aave'
  },
  ]

export default {
  name: 'MainLayout',
  components: { EssentialLink, RoutedLink, WalletStatus },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      routedLinks: routedLinks,
    }
  }
}
</script>
