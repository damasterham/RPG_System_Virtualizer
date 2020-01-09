<template>
  <div>
    <span class="subtitle-1">
      Variables
    </span>
    <v-row id="listOfVariables" no-gutters>
      <template v-for="(variable, index) in variables">
        <variable :key="variable.id" :references="references" />
        <v-divider v-if="index !== variables.length - 1" :key="'divider-' + variable.id" />
      </template>
    </v-row>
  </div>
</template>

<script>
import variable from '~/components/function-settings/variable.vue'

export default {
  components: {
    variable
  },
  props: {
    domain: {
      type: Object,
      default: () => { return { id: 0 } }
    },
    func: {
      type: Object,
      default: () => {}
    },
    limited: {
      type: Number,
      default: 0
    },
    variables: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
    references () {
      /*
        Array Structure:
        - Inherent & Inherited minified properties, alphabetically
        - Inherent & Inherited minified functions, alphabetically
        - Minified Dependency Domain, As added to properties
          - Dependency Domain minified Properties, alphabetically
        - Minified Dependency Domain, As added to properties
          - Dependency Domain minified Properties, alphabetically
        etc.
      */
      let res = []
      res = res
        .concat(this.$store.getters['properties/list']
          .filter((prop) => { // Get inherent properties of matching dataType
            return prop.domainId === this.domain.id && prop.dataType === this.func.dataType
          })
          .map((prop) => { // Break down into smaller object
            return { name: prop.name.toLowerCase(), id: prop.id, type: 'Property', domainId: prop.domainId }
          })
        )
      this.$store.state.domainParentage
        .forEach((parent) => {
          this.$store.getters['properties/list']
            .filter((prop) => { // Get inherited properties of matching dataType
              return prop.id === parent && prop.dataType === this.func.dataType
            })
            .forEach((prop) => { // Ensure that inherited properties are overwritten by lowest level
              if (!res.some(item => item.name === prop.name)) {
                res.push( // Break down into smaller object
                  { name: prop.name.toLowerCase(), id: prop.id, type: 'Property', domainId: prop.domainId }
                )
              }
            })
        })
      res = res
        .sort((a, b) => this.sortAlphabetically(a, b, 'name'))
      let functions = []
      functions = functions
        .concat(this.$store.getters['functions/list']
          .filter((func) => { // Get inherent functions of matching dataType
            return func.domainId === this.domain.id && func.dataType === this.func.dataType
          })
          .map((func) => { // Break down into smaller object
            return { name: func.name.toLowerCase(), id: func.id, type: 'Function', domainId: func.domainId }
          })
        )
      this.$store.state.domainParentage
        .forEach((parent) => {
          this.$store.getters['functions/list']
            .filter((func) => { // Get inherited functions of matching dataType
              return func.id === parent && func.dataType === this.func.dataType
            })
            .forEach((func) => { // Ensure that inherited functions are overwritten by lowest level
              if (!functions.some(item => item.name === func.name)) {
                functions.push( // Break down into smaller object
                  { name: func.name.toLowerCase(), id: func.id, type: 'Function', domainId: func.domainId }
                )
              }
            })
        })
      functions = functions
        .sort((a, b) => this.sortAlphabetically(a, b, 'name'))
      res = res.concat(functions) // Join properties and functions
      this.$store.state.domainDependencyIds.forEach((dependency) => {
        const domain = this.$store.getters['domains/get'](dependency) // Get dependency
        res.push( // Break down into smaller object
          { name: domain.name.toUpperCase(), id: domain.id, type: 'Domain' }
        )
        res = res.concat(this.$store.getters['properties/list']
          .filter((prop) => { // Get dependency properties of matching dataType
            return prop.domainId === dependency && prop.dataType === this.func.dataType
          })
          .map((prop) => { // Break down into smaller object
            return { name: domain.name + '.' + prop.name, id: prop.id, type: 'Property', domainId: domain.id }
          })
          .sort((a, b) => this.sortAlphabetically(a, b, 'name')))
      })
      return res
    },
    domainReferences () {
      const res = []
      res.concat(this.$store.getters['domains/list'].filter(item => this.$store.state.domainDependencyIds.some(dep => dep === item.id)))
      return res
    },
    functionReferences () {
      const res = []
      res.concat(this.$store.getters['functions/list'].filter(item => [this.domain.id].concat(this.$store.state.domainParentage).some(id => id === item.domainId)))
      return res.filter(item => item.dataType === this.variable.dataType)
    },
    inherentPropertyReferences () {
      const res = []
      res.concat(this.$store.getters['properties/list'].filter(item => item.domainId === this.domain.id))
      return res.filter(item => item.dataType === this.variable.dataType).sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        } else { return 0 }
      })
    },
    inheritedPropertyReferences () {
      const res = []
      res.concat(this.$store.getters['properties/list'].filter(item => this.$store.state.domainParentage.some(parent => parent === item.domainId)))
      return res.filter(item => item.dataType === this.variable.dataType).sort((a, b) => {
        if (this.this.$store.state.domainParentage.indexOf(a.domainId) < this.this.$store.state.domainParentage.indexOf(b.domainId)) {
          return -1
        } else if (this.this.$store.state.domainParentage.indexOf(a.domainId) > this.this.$store.state.domainParentage.indexOf(b.domainId)) {
          return 1
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        } else { return 0 }
      })
    },
    dependencyPropertyReferences () {
      const res = []
      res.concat(this.$store.getters['properties/list'].filter(item => this.$store.state.domainDependencyIds.some(dep => dep === item.domainId)))
      return res.filter(item => item.dataType === this.variable.dataType).sort((a, b) => {
        if (this.this.$store.state.domainDependencyIds.indexOf(a.domainId) < this.this.$store.state.domainDependencyIds.indexOf(b.domainId)) {
          return -1
        } else if (this.this.$store.state.domainDependencyIds.indexOf(a.domainId) > this.this.$store.state.domainDependencyIds.indexOf(b.domainId)) {
          return 1
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        } else { return 0 }
      })
    }
  },
  methods: {
    sortAlphabetically (a, b, key) {
      if (a[key].toLowerCase() < b[key].toLowerCase()) { return -1 }
      if (a[key].toLowerCase() > b[key].toLowerCase()) { return 1 }
      return 0
    }
  }
}
</script>

<style>

</style>