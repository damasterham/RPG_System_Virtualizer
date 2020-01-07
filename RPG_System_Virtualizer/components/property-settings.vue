<template>
  <div>
    <v-row no-gutters>
      <v-col style="margin-right: 4px">
        <v-text-field readonly label="Property Name" :value="property.name" />
      </v-col>
      <v-col style="margin-left: 4px; margin-right: 4px">
        <v-text-field readonly label="Property Data Type" :value="property.dataType | firstLetterCapitalized" />
      </v-col>
      <v-col style="margin-left: 4px">
        <v-text-field readonly label="Property Reference Type" :value="property.referenceType === 'raw_value' ? 'User Input' : property.referenceType | firstLetterCapitalized | removeUnderscore" />
      </v-col>
    </v-row>
    <v-divider inset style="margin-right: 72px" />
    <component
      :is="propertyReferenceComponent"
      :property="property"
      :property-values="
        property.referenceType === 'property'
          ? selectableProperties
          : property.referenceType === 'function'
            ? selectableFunctions
            : selectableDomains
      "
    />
  </div>
</template>

<script>
import functionReference from '~/components/property-settings/function-reference.vue'
import propertyReference from '~/components/property-settings/property-reference.vue'
import rawValueReference from '~/components/property-settings/raw-value-reference.vue'
import domainReference from '~/components/property-settings/domain-reference.vue'

export default {
  components: {
    functionReference,
    propertyReference,
    rawValueReference,
    domainReference
  },
  filters: {
    firstLetterCapitalized (val) {
      let res = ''
      if (val) {
        res += val.charAt(0).toUpperCase()
        res += val.substring(1)
      }
      return res
    },
    removeUnderscore (val) {
      return val.replace('_', ' ')
    }
  },
  props: {
    domain: {
      type: Object,
      default: () => { return { id: null, name: null, version: '0.0' } }
    },
    property: {
      type: Object,
      default: () => { return { id: null, name: '', dataType: null, referenceType: null } }
    }
  },
  computed: {
    propertyReferenceComponent () {
      switch (this.property.referenceType) {
        case 'raw_value': return rawValueReference
        case 'property' : return propertyReference
        case 'function' : return functionReference
        case 'domain' : return domainReference
        default: return undefined
      }
    },
    // Domains
    selectableDomains () {
      return this.$store.getters['domains/list'].filter(domain => this.$store.state.domainDependencyIds.some(dom => dom === domain.id))
    },
    // Functions
    selectableFunctions () {
      const res = []
      return res.concat(this.functions).concat(this.inheritedFunctions)
    },
    functions () {
      const res = []
      const list = [ ...this.$store.getters['functions/list'] ]
      list.forEach((func) => {
        if (func.dataType === this.property.dataType) { res.push(func) }
      })
      return res
    },
    inheritedFunctions () {
      return this.$store.getters['functions/list'].filter(item => this.$store.state.domainParentage.some(parent => parent === item.domainId) && item.dataType === this.property.dataType)
    },
    // Properties
    selectableProperties () {
      const res = []
      return res.concat(this.properties).concat(this.inheritedProperties).concat(this.dependencies)
    },
    properties () {
      const res = []
      const list = [ ...this.$store.getters['properties/list'] ]
      list.splice(list.findIndex(item => item.id === this.property.id), 1)
      list.forEach((item) => {
        if (item.dataType === this.property.dataType) { res.push(item) }
      })
      return res
    },
    inheritedProperties () {
      return this.$store.getters['properties/list'].filter(item => this.$store.state.domainParentage.some(parent => parent === item.domainId) && item.dataType === this.property.dataType)
    },
    dependencyProperties () {
      const res = this.$store.getters['properties/list'].filter(item => this.$store.state.domainDependencyIds.some(dep => dep === item.domainId))
      return res
    }
  }
}
</script>

<style lang="stylus">

</style>