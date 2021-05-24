<template>
  <q-page padding>
    <q-chip size="lg" icon="money">Aave</q-chip>
    <apexchart width="100%" type="line" :options="options" :series="series"></apexchart>
    <q-option-group
      v-model="includecoins"
      :options="selectcoins"
      color="green"
      type="checkbox"
    />
  </q-page>
</template>

<script>
 import Papa from 'papaparse'
 import parseISO from 'date-fns/parseISO'
 import getTime from 'date-fns/getTime'
 import { flatten, contains, has, isNil } from 'ramda'

 const onlySomeCoins = (symbol, includes) => {
   const rv = (!isNil(symbol) && contains(symbol.toLowerCase(), includes))
   console.log(`Only Some: ${symbol}, ${JSON.stringify(includes)} = ${rv}`);
   return rv;
 };
 
 export default {
   name: 'Aave',
   data() {
     return {
       includecoins: ['usdt'],
       selectcoins: ['weth','wbtc','usdt','usdc','dai'].map((coin) => ({ label: coin.toUpperCase(),  value: coin })),
       options: {
         chart: {
           id: 'Aave-History'
         },
         stroke: {
           width: 2
         },
         title: {
           text: 'Historical APY Rates',
           align: 'left'
         },
         grid: {
           borderColor: '#e7e7e7',
           row: {
             colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
             opacity: 0.5
           },
         },
         xaxis: {
           type: 'datetime'
         },
         yaxis: {
           title: {
             text: 'Percent'
           }
         }

       },
       allSeries: {},
     }
   },
   computed: {
     series: function() {
       console.log('series call');
       const coinFilter = (symbol) => onlySomeCoins(symbol, this.includecoins);

       const symbols = this.allSeries;
       
       // now map symbols into series array
       return flatten(Object
         .keys(symbols)
         .filter(coinFilter)
         .map(symbol => [
           {
             name: `${symbol} borrow`,
             data: symbols[symbol].borrow
           },
           {
             name: `${symbol} deposit`,
             data: symbols[symbol].deposit
           }
       ]));       
     }
   },
   methods: {

     parseRawCSV(raw) {
       const symbols = {};
       raw.data
          .filter(row => !isNil(row.symbol))
          .forEach(({timestamp, symbol, depositRate, borrowRate}) => {
            const coin = symbol.toLowerCase();
            if (!has(coin, symbols)) {
              symbols[coin] = {
                deposit: [],
                borrow: []
              }
            }
            const timesecs = getTime(parseISO(timestamp));
            symbols[coin].deposit.push([
              timesecs,
              depositRate
            ])
            symbols[coin].borrow.push([
              timesecs,
              borrowRate
            ])
          });
       return symbols;
     }
   },
   mounted() {
     const complete = (results) => {
       this.allSeries = this.parseRawCSV(results);
       console.log('loaded history');
     };

     const url = process.env.NODE_ENV === 'production' ? 'https://api.flourish.finance/aave/aave_historical_rates.csv'
                            : 'http://localhost:8000/historical_rates.csv'
                        Papa.parse(url, {
                          header: true,
                          download: true,
                          complete
                        })
   }
}
</script>
