<template>
  <v-row no-gutters>
    <v-col>
      <v-autocomplete
        :value="functionReference"
        label="Function Reference"
        :items="propertyValues"
        item-text="name"
        return-object
        @change="functionReference = $event"
      />
      <v-divider inset style="margin-right: 72px; margin-bottom: 10px" />
      <template v-for="variable in functionVariables">
        <specificVariable
          v-if="variable.referenceType === 'domain'"
          :key="variable.id"
          :domain="$store.state.domain"
          :function="func"
          :variable="variable"
          :property="property"
          :data-type="property.dataType"
        />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import specificVariable from '~/components/property-settings/specific-variable.vue'
import client from '~/plugins/feathers-client.js'

const propertiesClient = client.service('properties')

export default {
  components: {
    specificVariable
  },
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
        this.$store.dispatch('variables/find', { query: { functionId: val.id } })
        this.$store.dispatch('functions/find', { qurey: { id: val.id } })
      }
    },
    func () {
      if (this.functionReference !== null) {
        return this.$store.getters['functions/get'](this.functionReference.id)
      } return {}
    },
    functionVariables () {
      if (this.functionReference !== null) {
        return this.$store.getters['variables/list'].filter(item => item.functionId === this.functionReference.id)
      }
      return []
    }
  },
  async mounted () {
    const res = await this.$store.dispatch('properties-functions/find', { query: { propertyId: this.property.id }, $clear: true })
    if (res) {
      console.log(res, this.$store.state.function)
      if (this.$store.state.function !== null && res[0].functionId !== this.$store.state.function.id) {
        await this.$store.dispatch('variables/find', { query: { functionId: res[0].functionId } })
      }
    }
  },
  methods: {
    setPropertyValue (e) {
      propertiesClient.patch(this.property.id, {}, { query: { data: { referenceId: e.id, referenceType: this.property.referenceType } } }).then((res) => {
        this.$store.commit('properties-functions/updateItem', res)
      })
    }
  }
}
</script>

<style lang="stylus">

</style>