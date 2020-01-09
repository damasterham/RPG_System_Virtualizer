<template>
  <div>
    <v-dialog v-model="helpDialog" width="40vw">
      <v-card>
        <v-card-title>
          Table Lookup Help
          <v-spacer />
          <v-btn icon @click="toggleHelp">
            <v-icon large>
              close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <!--
            The Equations tool support the following mathematical operators: <br>
          <ul>
            <li>{{ addition }} </li>
            <li>{{ subtraction }} </li>
            <li>{{ multiplication }} </li>
            <li>{{ division }} </li>
            <li>{{ grouping }} </li>
          </ul>
          Use the slider below the 'Definition' field to assign when to round up or down.<br>
          Set it to 0 to always round down, and 1 to always round up.
          -->
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row no-gutters>
      <v-col>
        <span class="subtitle-1">
          Variable
        </span>
        <Variable :references="references" :variable="variable" :deletable="false" />
      </v-col>
    </v-row>
    <v-row />
  </div>
</template>

<script>
import Variable from '~/components/function-settings/variable.vue'
export default {
  components: {
    Variable
  },
  props: {
    func: {
      type: Object,
      default: () => {}
    },
    domain: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      helpDialog: false
    }
  },
  computed: {
    variable () {
      return this.$store.getters['variables/get'](this.func.id, 'functionId')
    },
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
  async mounted () {
    const res = await this.$store.dispatch('variables/find', { query: {
      functionId: this.func.id
    },
    $clear: true })
    if (res.length === 0) { await this.$store.dispatch('variables/create', { name: '', functionId: this.func.id, dataType: this.func.dataType }) }
  },
  methods: {
    sortAlphabetically (a, b, key) {
      if (a[key].toLowerCase() < b[key].toLowerCase()) { return -1 }
      if (a[key].toLowerCase() > b[key].toLowerCase()) { return 1 }
      return 0
    },
    toggleHelp () {
      this.helpDialog = !this.helpDialog
    }
  }
}
</script>

<style>

</style>