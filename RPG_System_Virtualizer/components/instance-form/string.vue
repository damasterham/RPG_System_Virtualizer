<template>
  <v-text-field
    :value="value"
    :readonly="!data.editable"
    :label="data.label"
    :rules="data.rules"
    name="name that does not trigger autocomplete"
    @change="value = $event"
  />
</template>

<script>
import * as mathjs from 'mathjs'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          label: '',
          dataType: ''
        }
      }
    }
  },
  data () {
    return {
      val: null,
      funcObj: { definition: null }
    }
  },
  computed: {
    value: {
      get () {
        if (this.data.editable) { return this.val }
        return this.data.referenceType === 'function' ? this.func : this.$store.getters.getNewInstanceProperty(this.data.id)
      },
      set (val) {
        this.val = val
        this.$store.commit('setNewInstanceProperty', { id: this.data.id, val })
      }
    },
    valid () {
      return this.data.rules.every((rule) => { return rule(this.val) })
    },
    func () {
      if (this.data.referenceType !== 'function' || this.funcObj.definition === null) { return null }
      const res = mathjs.evaluate(this.$store.getters.getNewInstanceProperty(this.data.id).trim())
      return res
    }
  },
  watch: {
    value (val) {
      this.$emit('change', this.valid)
    }
  },
  mounted () {
    if (this.data.default) { this.value = this.data.default } else {
      switch (this.data.referenceType) {
        case 'property': this.getValueFromProperty(); break
        case 'function': this.getValueFromFunction(); break
        default: this.value = null
      }
    }
  },
  methods: {
    getValueFromProperty () {
      console.log('getValueFromProperty')
      const reference = this.$store.getters['properties-properties/get'](this.data.id, 'propertyId')
      this.$store.commit('addPropertyListenerInNewInstance', { from: this.data.id, to: reference.propertyReferenceId })
      this.val = this.$store.getters.getNewInstanceProperty(this.data.id)
    },
    getValueFromFunction () {
      console.log('getValueFromFunction')
      const reference = this.$store.getters['properties-functions/get'](this.data.id, 'propertyId')
      const func = this.$store.getters['functions/get'](reference.functionId)
      const variables = this.$store.getters['variables/list'].filter(variable => variable.functionId === func.id)
      console.log(func.name, variables)
      variables.forEach((variable) => {
        switch (variable.referenceType) {
          case 'property': this.handleVariableReferencingProperty(variable); break
          case 'function': this.handleVariableReferencingFunction(variable); break
          case 'domain': this.handleVariableReferencingDomain(variable); break
          default: break
        }
      })
      this.funcObj = func
      this.$store.commit('setFunctionInNewInstance', { definition: func.definition, functionId: func.id, propertyId: this.data.id })
      console.log('testing', this.$store.getters.getNewInstanceVariable(this.data.id, variables[0].id))
      return 'not yet defined'
    },
    handleVariableReferencingProperty (variable) {
      const reference = this.$store.getters['variables-properties/get'](variable.id, 'variableId')
      console.log(variable.name, variable, this.data)
      this.$store.commit('addVariableListenerInNewInstance', { from: { propId: this.data.id, varId: variable.id }, to: reference.propertyId, functionId: variable.functionId })
    },
    handleVariableReferencingFunction (variable) {
      return null
    },
    handleVariableReferencingDomain (variable) {
      const specificVar = this.$store.getters['property-specific-variables/list'].filter((specVariable) => {
        return specVariable.variableId === variable.id && specVariable.propertyId === this.data.id
      })
      console.log('handling variable:', variable.name, 'of function', this.$store.getters['functions/get'](variable.functionId).name)
      this.$store.commit('addVariableListenerInNewInstance', { from: { propId: this.data.id, varId: variable.id }, to: specificVar[0].propertyReferenceId, functionId: variable.functionId })
      return null
    }
  }
}
</script>

<style>

</style>