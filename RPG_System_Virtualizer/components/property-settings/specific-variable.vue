<template>
  <variable
    :deletable="false"
    :readonly="variable.referenceType !== 'domain'"
    :specific="true"
    :specific-value="$store.getters['property-specific-variables/get'](variable.id, 'variableId')"
    :references="references"
    :variable="variable"
    :func="func"
    :domain="domain"
    @updateSpecific="updateSpecificVariable($event)"
  />
</template>

<script>
import variable from '~/components/variable.vue'
export default {
  components: {
    variable
  },
  props: {
    variable: {
      type: Object,
      default: () => { return {} }
    },
    func: {
      type: Object,
      default: () => {}
    },
    domain: {
      type: Object,
      default: () => {}
    },
    dataType: {
      type: String,
      default: ''
    },
    property: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    references () {
      let reference = {}
      let res = []
      if (this.variable.referenceType === 'domain') {
        reference = this.$store.getters['variables-domains/get'](this.variable.id, 'variableId')
        if (reference && reference !== null) {
          const props = this.$store.getters['properties/list'].filter((item) => {
            return item.domainId === reference.domainId && item.dataType === this.dataType
          })
          const domain = this.$store.getters['domains/get'](props[0].domainId)
          res = res.concat(props.map((item) => {
            return {
              name: domain.name.toUpperCase() + '.' + item.name,
              id: item.id,
              type: 'Property',
              domainId: item.domainId
            }
          }))
        }
      }
      return res
    }
  },
  async mounted () {
    await this.$store.dispatch('variables-domains/find', { query: { variableId: this.variable.id } })
    await this.$store.dispatch('property-specific-variables/find', { query: {
      variableId: this.variable.id, propertyId: this.property.id
    },
    $clear: true })
  },
  methods: {
    updateSpecificVariable (e) {
      console.log('updateSpecificVariable e', e)
      let reference = this.$store.getters['property-specific-variables/get'](this.variable.id, 'variableId')
      if (reference && reference !== null) {
        this.$store.dispatch('property-specific-variables/patch', [null, { propertyReferenceId: e.id }, { query: { variableId: reference.variableId } }])
      } else {
        reference = { variableId: this.variable.id, propertyId: this.property.id, propertyReferenceId: e.id }
        this.$store.dispatch('property-specific-variables/create', reference)
      }
    }
  }
}
</script>

<style>

</style>