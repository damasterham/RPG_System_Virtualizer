<template>
  <variable
    :deletable="false"
    :readonly="variable.referenceType !== 'domain'"
    :references="references"
    :variable="variable"
    :func="func"
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
    }
  },
  computed: {
    references () {
      let referenceNamespace = ''
      let objectNamespace
      let reference = {}
      let res = []
      if (this.variable.referenceType === 'domain') {
        reference = this.$store.getters['variables-domains/get'](this.variable.id, 'variableId')
        if (reference && reference !== null) {
          const props = this.$store.getters['properties/list'].filter((item) => {
            return item.domainId === reference.domainId && item.dataType === this.dataType
          })
          res = res.concat(props.map((item) => {
            return {
              name: item.name,
              id: item.id,
              type: 'Property',
              domainId: item.domainId
            }
          }))
        }
      } else {
        switch (this.variable.referenceType) {
          case 'function': referenceNamespace = 'variables-functions'; objectNamespace = 'functions'; break
          case 'domain': referenceNamespace = 'variables-domains'; objectNamespace = 'domains'; break
          case 'property': referenceNamespace = 'variables-properties'; objectNamespace = 'properties'; break
          default: break
        }
        reference = this.$store.getters[referenceNamespace + '/get'](this.variable.id, 'variableId')
        if (reference && reference !== null) {
          reference = this.$store.getters[objectNamespace + '/get'](res[this.variable.referenceType + 'Id'])
          if (reference && reference !== null) {
            const obj = {
              name: reference.name,
              id: reference.id,
              type: this.variable.referenceType.charAt(0).toUpperCase() + this.variable.referenceType.substring(1),
              domainId: reference.domainId
            }
            res.push(obj)
          }
        }
      }
      console.log('res:', res)
      return res
    }
  },
  async mounted () {
    let namespace = ''
    switch (this.variable.referenceType) {
      case 'function': namespace = 'variables-functions'; break
      case 'domain': namespace = 'variables-domains'; break
      case 'property': namespace = 'variables-properties'; break
      default: break
    }
    const res = await this.$store.dispatch(namespace + '/find', { query: { variableId: this.variable.id } })
    console.log(res)
  }

}
</script>

<style>

</style>