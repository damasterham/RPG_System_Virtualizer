<template>
  <div>
    <span class="subtitle-1">
      Variables
    </span>
    <v-row id="listOfVariables" no-gutters>
      <v-col>
        <template v-for="variable in variables">
          <variable :key="'variable-' + variable.id" :references="references" :variable="variable" />
          <!-- <v-divider v-if="index !== variables.length - 1" :key="'divider-' + variable.id" /> -->
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import variable from '~/components/variable.vue'

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
      console.log('inherent properties:', [ ...res ])
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
      console.log('inherited properties:', [ ...res ])
      res = res
        .sort((a, b) => this.sortAlphabetically(a, b, 'name'))
      let functions = []
      functions = functions
        .concat(this.$store.getters['functions/list']
          .filter((func) => { // Get inherent functions of matching dataType
            return func.domainId === this.domain.id && func.dataType === this.func.dataType && func.id !== this.func.id
          })
          .map((func) => { // Break down into smaller object
            return { name: func.name.toLowerCase(), id: func.id, type: 'Function', domainId: func.domainId }
          })
        )
      console.log('inherent functions:', [ ...res ])
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
      console.log('inherited functions:', [ ...res ])
      functions = functions
        .sort((a, b) => this.sortAlphabetically(a, b, 'name'))
      res = res.concat(functions) // Join properties and functions
      this.$store.state.domainDependencyIds.forEach((dependency) => {
        const domain = this.$store.getters['domains/get'](dependency) // Get dependency
        res.push( // Break down into smaller object
          { name: domain.name.toUpperCase(), id: domain.id, type: 'Domain' }
        )
        console.log(this.$store.getters['properties/list'].filter(prop => prop.domainId === domain.id))
        res = res.concat(this.$store.getters['properties/list']
          .filter((prop) => { // Get dependency properties of matching dataType
            return prop.domainId === dependency && prop.dataType === this.func.dataType
          })
          .map((prop) => { // Break down into smaller object
            return { name: domain.name.toUpperCase() + '.' + prop.name, id: prop.id, type: 'Property', domainId: domain.id }
          })
          .sort((a, b) => this.sortAlphabetically(a, b, 'name')))
      })
      console.log('domain dependencies', res)
      return res
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