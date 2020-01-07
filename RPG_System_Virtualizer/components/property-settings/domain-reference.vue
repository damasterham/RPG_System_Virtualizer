<template>
  <v-row no-gutters>
    <v-autocomplete
      :value="domainReference"
      label="Property Value"
      :items="propertyValues"
      item-text="name"
      return-object
      @change="propertyReference = $event"
    />
  </v-row>
</template>

<script>
import service from '~/plugins/feathers-service.js'

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
    propertyReference: {
      get () {
        return this.$store.getters['domains/get'](this.$store.getters['properties-domains/get'](this.property.id, 'propertyId').domainId)
      },
      set (val) {
        this.setPropertyValue(val)
      }
    }
  },
  created () {
    if (!this.$store.state.modules['properties-domains']) { service('properties-domains')(this.$store) }
  },
  async mounted () {
    await this.$store.dispatch('properties-domains/find', { query: { propertyId: this.property.id } })
  },
  methods: {
    async setPropertyValue (e) {
      console.log('setPropertyValue | ', e)
      await this.$store.dispatch('properties/patch', [this.property.id, {}, { data: { id: e.id, referenceType: this.property.referenceType } }])
    }
  }
}
</script>

<style lang="stylus">

</style>