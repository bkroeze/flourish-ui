<script>
 export default {
   props: {
     limit: Number,
     text: String
   },
   name: 'LimitedText',
   computed: {
     tooLong() {
       const tl = this.text.length > this.limit;
       console.log(`tooLong "${this.text}" ${this.text.length} > ${this.limit} = ${tl}`);
       return tl;
     }
   },
   methods: {
     shorten(text, shortSuffix) {
       let len = text.length;
       const parts = text.split(' ');
       let work = text;
       let shortened = len > this.limit
       if (parts.length > 1) {
         while (len > this.limit) {
           len -= 1 + parts.pop().length;
         }
         work = parts.join(' ');
       }
       if (work.length > this.limit) {
         work = work.slice(0, this.limit);
       }
       if (shortened) {
         work = `${work}${shortSuffix}`;
       }
       console.log(`Shortened '${text}' to '${work}'`)
       return work;
     }
   }
 };
</script>

<template>
  <span v-if="!tooLong">{{ text }}</span>
  <span v-else-if="tooLong">
    <span>{{ shorten(text, '&hellip;') }}
      <q-tooltip color="blue">
        {{ text }}
      </q-tooltip>
    </span>
  </span>
</template>
