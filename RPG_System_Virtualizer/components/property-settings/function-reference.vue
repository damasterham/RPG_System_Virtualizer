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
import client from '~/plugins/feathers-client.js'

const propertiesClient = client.service('properties')

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
        if (functionReference) { return this.$store.getters['functions/get'](functionReference.functionId) }
        return null
      },
      set (val) {
        this.setPropertyValue(val)
      }
    }
  },
  async mounted () {
    await this.$store.dispatch('properties-functions/find', { query: { propertyId: this.property.id }, $clear: true })
  },
  methods: {
    setPropertyValue (e) {
      console.log('setPropertyValue | ', e)
      propertiesClient.patch(this.property.id, {}, { query: { data: { referenceId: e.id, referenceType: this.property.referenceType } } }).then((res) => {
        console.log('propertiesClient result:', res)
        this.$store.commit('properties-functions/updateItem', res)
      })
    }
  }
}
</script>

<style lang="stylus">

</style>