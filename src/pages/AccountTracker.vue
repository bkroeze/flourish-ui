<template>
  <q-page padding>
    <p>Acct: {{ acct }}</p>
  </q-page>
</template>

<script>
export default {
   name: 'AccountTracker',
   data() {
     return {
       acct: this.$route.query.acct
     }
   }
}
</script>
