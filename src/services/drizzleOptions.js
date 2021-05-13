// see https://github.com/trufflesuite/drizzle/blob/develop/packages/vue-plugin/README.md for base config

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:9545'
    }
  },

  // The contracts to monitor
  contracts: [],
  events: {},
  polls: {
    // check accounts ever 15 seconds
    // accounts: 15000
  }
}

export default options
