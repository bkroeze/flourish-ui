import * as R from 'ramda'
import live from './live.json'
import test from './test.json'

// networks where ens exists
// Mainet, Ropsten, Ropsten
const ens = ['1', '3', '4']
const all = R.concat(live, test)
const chainFinder = R.find(R.propEq('chainId'))

export function getNetworkInfo(id) {
  if (id === null) {
    return {name: "Not Connected"}
  }
  const finder = chainFinder(id)
  const chain = finder(chains.all) || {
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
  };
  return {
    ...chain,
    ens: hasEns(id)
  }
}

// if this net has ens
export function hasEns(id) {
  return chains.ens.includes(id)
}

export default { live, test, all, getNetworkInfo }
