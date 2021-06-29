/* eslint-disable */
import Vue from 'vue'
import {
  providers,
  Contract as ContractModule,
  utils as utilsModule
} from 'ethers'
import { getLogger } from '../../config/logger'
import chains from '../../config/chains.json'
import testChains from '../../config/testChains.json'
import * as R from 'ramda';

const log = getLogger('ethereum/ethersConnect')

export const PROVIDER_CHECK_MS = 500
// networks where ens exists
// Mainet, Ropsten, Ropsten
export const ENS_NETS = ['0x1', '0x3', '0x4']

// messages
export const MSGS = {
  NOT_CONNECTED: 'Not connected to Ethereum network',
  NOT_READY: 'Ethereum network not ready',
  NO_WALLET: 'No Ethereum wallet detected',
  ACCOUNT_CHANGED: 'Ethereum account changed',
  ETHERS_VUEX_INITIALIZED: 'Ethers vuex module initialized',
  ETHERS_VUEX_READY: 'Ethers vuex module ready'
}
export const EVENT_CHANNEL = 'ethers'
// use vue as a simple event channel
export const event = new Vue()
// expose ethers modules
export const utils = utilsModule
export const Contract = ContractModule

// ethereum transactions to log
// More information: https://docs.ethers.io/ethers.js/html/api-providers.html#events
export const LOG_TRANSACTIONS = [
  'block'
  // can also be an address or transaction hash
  // [] // list of topics, empty for all topics
]

// for ethers
let ethereum
let provider
let chainId
let userWallet
let currentAccount
let providerInterval
let initialized

function getEthereum() {
  return window.ethereum
}

function ethereumOk() {
  const em = getEthereum()
  const connected = em && em.isConnected()
  if (!connected) log.info({ethereum: !!em, connected: connected, ctx: 'ethereumOK'})
  return connected
}

export function getNetworkInfo() {
  if (chainId === null) {
    return {name: "Not Connected"}
  }
  const finder = R.find(R.propEq('chainId', chainId))
  
  let info = finder(chains)
  if (!info) {
    info = finder(testChains)
  }
  return info || {
    "name": "Unknown",
    "chainId": chainId,
    "shortName": "unk",
    "chain": "???",
    "network": "unk",
    "networkId": `${chainId}`,
    "nativeCurrency": {"name":"Unknown","symbol":"???","decimals":18},
    "rpc": [],
    "faucets": [],
    "explorers": [],
  }
}

// if this net has ens
export async function hasEns() {
  return ENS_NETS.includes(chainId)
}

// get deployed address for a contract from its networks object and current network id or null
export async function getNetworkAddress(networks) {
  if (!networks[chainId] || !networks[chainId].address) return null
  return networks[chainId].address
}

export function getProvider() {
  return provider
}

export function getWallet() {
  return userWallet
}

export async function getWalletAddress() {
  const addr = userWallet && await userWallet.getAddress()
  return addr
}

export function setChainId(rawId) {
  let cID = rawId;
  try {
    cID = parseInt(Number(rawId), 10)
  } catch {
    log.warn({msg: `Could not parse ID to int: ${ethereum.chainId}`});
  }
  chainId = cID
  log.info({chainId, msg: 'set ChainId'});
  return chainId
}

export function ready() {
  return !!provider && !!userWallet
}

export async function startProviderWatcher() {
  // this should only be run when a ethereum provider is detected and set at the ethereum value above
  async function updateProvider() {
    log.info('updateProvider');
    try {
      ethereum = getEthereum()
      if (!ethereum) {
        log.info('No Ethereum provider found yet')
        return
      }
      // set ethers provider - old skool - deprecated
      // await ethereum.enable()
      provider = new providers.Web3Provider(ethereum)
      log.info({provider, ctx: 'updateProvider'})
      initialized = true


      // this is modeled after EIP-1193 example provided by MetaMask for clarity and consistency
      // but works for all EIP-1193 compatible ethereum providers
      // https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

      /**********************************************************/
      /* Handle chain (network) and chainChanged (per EIP-1193) */
      /**********************************************************/

      // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
      // returns incorrectly formatted chain ID values.
      setChainId(ethereum.chainId)

      ethereum.on('chainChanged', handleChainChanged)

      /***********************************************************/
      /* Handle user accounts and accountsChanged (per EIP-1193) */
      /***********************************************************/

      /* const acctsProvider = await provider.listAccounts()
       * log.info({ctx: 'updateProvider', acctsProvider, msg: 'alt method'}) */
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      log.info({ctx: 'updateProvider', accounts, msg: 'retrieved accounts'})
      await handleAccountsChanged(accounts)
      // Note that this event is emitted on page load.
      // If the array of accounts is non-empty, you're already
      // connected.
      ethereum.on('accountsChanged', handleAccountsChanged)
    } catch (err) {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      log.error({error: err, context: 'Error requesting ethereum accounts'})
      event.$emit(EVENT_CHANNEL, MSGS.NO_WALLET)
    }
  }

  function checkProvider() {
    // handle changes of availability of ethereum provider
    if (ethereum && !ethereumOk()) {
      log.info('We have ethereum, but not connected yet');
      ethereum = null
      provider = null
      chainId = null
      currentAccount = null
      userWallet = null
      event.$emit(EVENT_CHANNEL, MSGS.NOT_READY)
    } else if (!ethereum && ethereumOk()) {
      updateProvider()
    }
  }

  // kick it off now
  checkProvider()
  // and set interval
  providerInterval = setInterval(checkProvider, PROVIDER_CHECK_MS)
}

function handleChainChanged(_chainId) {
  // We recommend reloading the page, unless you must do otherwise
  log.info({msg: 'Ethereum chain changed. Reloading as recommended.'});
  setChainId(_chainId)
  window.location.reload()
}

// For now, 'eth_accounts' will continue to always return an array
function handleAccountsChanged(accounts) {
  log.info({ctx: 'handleAccountsChanged', accounts});
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    log.info({msg: 'No ethereum accounts available - Metamask locked?'});
    event.$emit(EVENT_CHANNEL, MSGS.NO_WALLET)
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0]
    userWallet = provider && provider.getSigner(currentAccount)
    event.$emit(EVENT_CHANNEL, MSGS.ACCOUNT_CHANGED)
  }
}

/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

// You should only attempt to request the user's accounts in response to user
// interaction, such as a button click.
// Otherwise, you popup-spam the user like it's 1999.
// If you fail to retrieve the user's account(s), you should encourage the user
// to initiate the attempt.
// document.getElementById('connectButton', connect)

export async function connect() {
  try {
    log.info({msg: 'connecting'})
    if (!ethereum) return event.$emit(EVENT_CHANNEL, MSGS.NOT_CONNECTED)
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    await handleAccountsChanged(accounts)
    log.info({ctx: 'connect', accounts})
    await event.$emit(EVENT_CHANNEL, MSGS.ACCOUNT_CHANGED)
  } catch (err) {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      log.info({msg: 'Please connect to Ethereum wallet'})
      event.$emit(EVENT_CHANNEL, MSGS.NOT_READY, err)
    } else {
      log.error({error: err, context: 'Error requesting Ethereum connection/accounts'})
      event.$emit(EVENT_CHANNEL, MSGS.NOT_READY, err)
    }
  }
}

// stop interval looking for ethereum provider changes
export async function stopWatchProvider() {
  if (providerInterval) clearInterval(providerInterval)
  providerInterval = null
}

// start ethereum provider checker
startProviderWatcher()

export default {
  connect,
  ethereumOk,
  getNetworkInfo,
  hasEns,
  getProvider,
  getWallet,
  getWalletAddress,
  getNetworkAddress,
  ready
}
