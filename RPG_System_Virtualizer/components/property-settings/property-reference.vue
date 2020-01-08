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
import service from '~/plugins/feathers-service.js'
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
        if (propertyReference) { return this.$store.getters['properties/get'](propertyReference.referenceId) }
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
  created () {
    if (!this.$store.state.modules['properties-properties']) { service('properties-properties')(this.$store) }
  },
  async mounted () {
    await this.$store.dispatch('properties-properties/find', { query: { propertyId: this.property.id } })
  },
  methods: {
    setPropertyValue (e) {
      console.log('setPropertyValue | ', e)
      propertiesClient.patch(this.property.id, {}, { data: { referenceId: e.id, referenceType: this.property.referenceType } }).then((res) => {
        console.log('propertiesClient result:', res)
        // this.$store.commit('properties-properties/updateItem', res) Waiting for Hook implementation
      })
    }
  }
}
</script>

<style lang="stylus">

</style>