<template>
  <v-row no-gutters>
    <v-text-field v-if="inputType === 'switch'" readonly :value="defaultValue.toString() | firstLetterCapitalized" label="Default Value" />
    <v-switch v-if="inputType === 'switch'" ref="switch" style="margin-right: 5px; margin-left: 20px" @change="defaultValue = $event" />
    <v-text-field
      v-else
      :value="defaultValue"
      :type="inputType"
      :step="inputType === 'float' ? '0.01' : null"
      label="Default Value"
      @change="defaultValue = $event"
    />
  </v-row>
</template>

<script>
import service from '~/plugins/feathers-service.js'

export default {
  filters: {
    firstLetterCapitalized (val) {
      let res = ''
      if (val) {
        res += val.charAt(0).toUpperCase()
        res += val.substring(1)
      }
      return res
    }
  },
  props: {
    property: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    defaultValue: {
      get () {
        const defaultValue = this.$store.getters['raw-values/get'](this.property.id, 'propertyId')
        if (defaultValue) {
          let val = defaultValue.defaultValue
          if (val === null && this.property.dataType === 'boolean') { val = false }
          if (this.property.dataType === 'float') { val === null ? val = '0.00' : val = parseFloat(val).toFixed(2) }
          return val
        }
        return ''
      },
      async set (val) {
        if (this.property.dataType === 'float' && val) { val = parseFloat(val).toFixed(2) }
        const res = await this.$store.dispatch('raw-values/patch', [this.property.id, { defaultValue: val }])
        this.$store.commit('raw-values/updateItem', res)
      }
    },
    inputType () {
      switch (this.property.dataType) {
        case 'boolean' : return 'switch'
        case 'float':
        case 'int': return 'number'
        default: return 'text'
      }
    }
  },
  created () {
    if (!this.$store.state.modules['raw-values']) { service('raw-values')(this.$store) }
  },
  async mounted () {
    const res = await this.$store.dispatch('raw-values/find', { query: { propertyId: this.property.id } })
    if (this.$refs.switch && res[0].defaultValue) { this.$refs.switch.internalValue = res[0].defaultValue === 'true' }
  }
}
</script>

<style lang="stylus">

</style>