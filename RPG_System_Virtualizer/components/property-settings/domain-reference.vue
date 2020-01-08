<template>
  <v-row no-gutters>
    <v-autocomplete
      :value="domainReference"
      label="Domain Reference"
      :items="propertyValues"
      item-text="name"
      return-object
      @change="domainReference = $event"
    />
  </v-row>
</template>

<script>
import service from '~/plugins/feathers-service.js'
import client from '~/plugins/feathers-client.js'

const domainsClient = client.service('domains')

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
    domainReference: {
      get () {
        const domainReference = this.$store.getters['properties-domains/get'](this.property.id, 'propertyId')
        if (domainReference) { return this.$store.getters['domains/get'](domainReference.referenceId) }
        return null
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
    setPropertyValue (e) {
      console.log('setPropertyValue | ', e)
      domainsClient.patch(this.property.id, {}, { data: { referenceId: e.id, referenceType: this.property.referenceType } }).then((res) => {
        console.log('domainsClient result:', res)
        // this.$store.commit('properties-functions/updateItem', res) Waiting for hook implementation
      })
    }
  }
}
</script>

<style lang="stylus">

</style>