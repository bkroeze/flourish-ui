<template>
  <div class="col-4">
    <q-card>
      <q-card-section>
        <div class="text-h5">{{ meta ? meta.title : 'Card' }}</div>
        <div class="text-h6">{{ meta ? meta.series : 'Loading ...' }}</div>
      </q-card-section>
      <q-card-section>
        <q-img
          v-if="meta"
          :src="image"
          width="100%"
          spinner-color="green"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
 
 export default {
   name: 'CardDisplay',
   props: ['index', 'tokenId', 'uri', 'image', 'meta']
 }
</script>
