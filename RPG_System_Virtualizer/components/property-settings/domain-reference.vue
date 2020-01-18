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
    domainReference: {
      get () {
        const domainReference = this.$store.getters['properties-domains/get'](this.property.id, 'propertyId')
        if (domainReference) { return this.$store.getters['domains/get'](domainReference.domainId) }
        return null
      },
      set (val) {
        this.setPropertyValue(val)
      }
    }
  },
  async mounted () {
    await this.$store.dispatch('properties-domains/find', { query: { propertyId: this.property.id } })
  },
  methods: {
    setPropertyValue (e) {
      console.log('setPropertyValue | ', e)
      propertiesClient.patch(this.property.id, {}, { query: { data: { referenceId: e.id, referenceType: this.property.referenceType } } }).then((res) => {
        console.log('propertiesClient result:', res)
        this.$store.commit('properties-functions/updateItemWithKey',
          { primaryIdentifier: 'propertyId', value: res }
        )
      })
    }
  }
}
</script>

<style lang="stylus">

</style>