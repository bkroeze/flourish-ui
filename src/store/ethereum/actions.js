/* eslint-disable */
import {
  MSGS,
  EVENT_CHANNEL,
  connect,
  event,
  ready,
  getProvider,
  getWallet,
  getWalletAddress,
  getNetworkInfo,
  hasEns
} from './ethersConnect'

import { getLogger } from '../../config/logger';
const log = getLogger('ethereum/actions');

export default {
  async connect(ctx) {
    log.info('connect')
    try {
      const oldAddress = ctx.state.address
      const oldNetwork = ctx.state.network
      log.debug({oldAddress, oldNetwork});

      const provider = getProvider()
      if (!provider) throw new Error(MSGS.NOT_CONNECTED)

      const wallet = getWallet()
      if (!wallet) throw new Error(MSGS.NO_WALLET)
      const address = await getWalletAddress()
      const network = getNetworkInfo()

      log.info({network, address});

      if (network !== oldNetwork || address !== oldAddress) {
        log.info('Network change')
        ctx.commit('connected', true)
        ctx.commit('error', null)
        ctx.commit('address', address)
        ctx.commit('user', address)
        ctx.commit('network', network)

        const msg = oldAddress && oldAddress !== address
          ? `Your Ethereum address/user has changed.
          Address: ${address}
          Network: ${network.name}
          Gas Price: ${await provider.getGasPrice()}
          Current Block #: ${await provider.getBlockNumber()}
          Your ether balance: ${await provider.getBalance(address)}`
          : `You are connected to the Ethereum Network.
          Address: ${address}
          Network: ${network.name}
          Gas Price: ${await provider.getGasPrice()}
          Current Block #: ${await provider.getBlockNumber()}
          Your ether balance: ${await provider.getBalance(address)}
          If you change your address or network, this app will update automatically.`
        log.info({msg})

        // Other vuex stores can wait for this
        event.$emit(EVENT_CHANNEL, MSGS.ETHERS_VUEX_READY)

        // now check for .eth address too
        if (await hasEns()) {
          console.log('Net supports ENS. Checking...')
          ctx.commit('ens', await provider.lookupAddress(address))
          if (ctx.state.ens) {
            ctx.commit('user', ens)
          }
        }

        /* provider.on('block', (blockNumber) => {
         *   console.log('Block mined:', blockNumber)
         *  })
        */
      }
    } catch (err) {
      log.error({context: 'connecting - will now disconnect', err});
      ctx.dispatch('disconnect', err)
    }
  },
  async disconnect(ctx, err) {
    log.info('disconnect');
    const oldAddress = ctx.state.address
    ctx.commit('connected', false)
    ctx.commit('error', err)
    ctx.commit('address', '')
    ctx.commit('user', '')
    ctx.commit('network', '')
    ctx.commit('ens', null)

    if (err) {
      log.error({error: err, context: 'disconnecting'});
    } else {
      log.info({msg: 'You have been disconnected from your Ethereum connection. Please check MetaMask, etc.'});
    }
    
  },
  async logout(ctx) {
    log.info('logout');
    ctx.commit('address', '')
    ctx.commit('user', '')
    log.info({msg: 'You have been logged out from your Ethereum connection'})
  },
  async notConnected(ctx) {
    log.info('notConnected');
    ctx.commit('address', '')
    ctx.commit('user', '')
    log.info({msg: 'You are not connected to the Ethereum network. Please check MetaMask,etc.'})
  },
  async init(ctx) {

    log.info('Init');
    event.$on(EVENT_CHANNEL, async function (msg) {
      log.info({ctx: 'Event Received', msg})
      switch (msg) {
        case MSGS.NOT_READY:
          await ctx.dispatch('disconnect')
          break
        case MSGS.NO_WALLET:
          await ctx.dispatch('logout')
          break
        case MSGS.ACCOUNT_CHANGED:
          await ctx.dispatch('connect')
          break
        case MSGS.NOT_CONNECTED:
          await ctx.dispatch('notConnected')
          break
      }
    })

    if (ready()) {
      log.info('Ready - connecting')
      await ctx.dispatch('connect')
      event.$emit(EVENT_CHANNEL, MSGS.ETHERS_VUEX_INITIALIZED)
    }
    log.info('Initialized');
    ctx.commit('initialized', true)
  }
}
