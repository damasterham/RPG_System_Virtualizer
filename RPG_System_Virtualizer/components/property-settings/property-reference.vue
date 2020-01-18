<template>
  <v-row no-gutters>
    <v-autocomplete
      :value="propertyReference"
      label="Property Reference"
      :items="formattedPropertyValues"
      item-text="name"
      return-object
      @change="propertyReference = $event"
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
    propertyReference: {
      get () {
        const propertyReference = this.$store.getters['properties-properties/get'](this.property.id, 'propertyId')
        console.log(propertyReference)
        if (propertyReference) { return this.$store.getters['properties/get'](propertyReference.propertyReferenceId) }
        return null
      },
      set (val) {
        this.setPropertyValue(val)
      }
    },
    formattedPropertyValues () {
      const list = []
      console.log(this.propertyValues)
      this.propertyValues.forEach((property) => {
        const listProp = JSON.parse(JSON.stringify(property))
        if (![property.domainId].concat(this.$store.state.domainParentage).some(parent => parent === property.domainId)) {
          listProp.name = this.$store.getters['domains/get'](property.domainId).name + '.' + property.name
        }
        list.push(listProp)
      })
      return list
    }
  },
  async mounted () {
    await this.$store.dispatch('properties-properties/find', { query: { propertyId: this.property.id } })
  },
  methods: {
    setPropertyValue (e) {
      console.log('setPropertyValue | ', e)
      propertiesClient.patch(this.property.id, {}, { query: { data: { referenceId: e.id, referenceType: this.property.referenceType } } }).then((res) => {
        console.log('propertiesClient result:', res)
        this.$store.commit('properties-properties/updateItemWithKey',
          { primaryIdentifier: 'propertyId', value: res }
        )
      })
    }
  }
}
</script>

<style lang="stylus">

</style>