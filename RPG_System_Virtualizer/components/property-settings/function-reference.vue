<template>
  <v-row no-gutters>
    <v-autocomplete
      :value="functionReference"
      label="Function Reference"
      :items="propertyValues"
      item-text="name"
      return-object
      @change="functionReference = $event"
    />
  </v-row>
</template>

<script>
import service from '~/plugins/feathers-service.js'
import client from '~/plugins/feathers-client.js'

const functionsClient = client.service('functions')

export default {
  props: {
    propertyValues: {
      type: Array,
      default: () => []
    },
    property: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    functionReference: {
      get () {
        const functionReference = this.$store.getters['properties-functions/get'](this.property.id, 'propertyId')
        if (functionReference) { return this.$store.getters['functions/get'](functionReference.referenceId) }
        return null
      },
      set (val) {
        this.setPropertyValue(val)
      }
    }
  },
  created () {
    if (!this.$store.state.modules['properties-functions']) { service('properties-functions')(this.$store) }
  },
  async mounted () {
    await this.$store.dispatch('properties-functions/find', { query: { propertyId: this.property.id }, $clear: true })
  },
  methods: {
    setPropertyValue (e) {
      console.log('setPropertyValue | ', e)
      functionsClient.patch(this.property.id, {}, { data: { referenceId: e.id, referenceType: this.property.referenceType } }).then((res) => {
        console.log('functionsClient result:', res)
        // this.$store.commit('properties-functions/updateItem', res) Waiting for hook implementation
      })
    }
  }
}
</script>

<style lang="stylus">

</style>