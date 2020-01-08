<template>
  <v-row no-gutters>
    <v-autocomplete
      :value="functionReference"
      label="Property Value"
      :items="formattedPropertyValues"
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
        return this.$store.getters['functions/get'](this.$store.getters['properties-functions/get'](this.property.id, 'propertyId').functionId)
      },
      set (val) {
        this.setPropertyValue(val)
      }
    },
    formattedPropertyValues () {
      const list = []
      this.propertyValues.forEach((property) => {
        const listFunc = JSON.parse(JSON.stringify(property))
        if (![property.domainId].concat(this.$store.state.domainParentage).some(parent => parent === property.domainId)) {
          listFunc.name = this.$store.getters['domains/get'](property.domainId).name + '.' + property.name
        }
        list.push(listFunc)
      })
      return list
    }
  },
  created () {
    if (!this.$store.state.modules['properties-functions']) { service('properties-functions')(this.$store) }
  },
  async mounted () {
    await this.$store.dispatch('properties-functions/find', { query: { propertyId: this.property.id } })
  },
  methods: {
    async setPropertyValue (e) {
      console.log('setPropertyValue | ', e)
      await this.$store.dispatch('properties/patch', [this.property.id, {}, { data: { referenceId: e.id, referenceType: this.property.referenceType } }])
    }
  }
}
</script>

<style lang="stylus">

</style>