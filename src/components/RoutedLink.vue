<template>
  <q-item
    clickable
    tag="a"
    :to="to"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'RoutedLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    to: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    appendAccount: {
      type: Boolean,
      default: false
    }
  },
   computed: {
     url: function() {
       if (!this.props.appendAccount) {
         return this.props.to
       }
       return `${this.props.to}/${web3.account}`
     }
   }
}
</script>
