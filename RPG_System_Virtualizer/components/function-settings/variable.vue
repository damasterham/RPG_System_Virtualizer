<template>
  <div>
    <v-row no-gutters>
      <v-col cols="5" style="margin-right: 4px">
        <v-text-field :value="variableName" label="Name" @change="variableName = $event" />
      </v-col>
      <v-col style="margin-left: 4px">
        <v-autocomplete :value="variableReference" label="Reference" @change="variableReference = $event" />
      </v-col>
      <v-col cols="1">
        <v-btn icon>
          <v-icon>delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    variable: {
      type: Object,
      default: () => {}
    },
    func: {
      type: Object,
      default: () => {}
    },
    domain: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    variableName: {
      get () {
        return this.variable.name
      },
      async set (val) {

      }
    },
    variableReference: {
      get () {
        return null
      },
      async set (val) {

      }
    },
    references () { // Finish this
      // Add sorting based on domains and inherent/inherited/dependencies
      // Ensure that inherited properties are overwritten by inherent ones
      let res = []
      res = res.concat(this.inherentPropertyReferences)
      this.inheritedPropertyReferences.forEach((inheritedProperty) => {
        if (!res.some(item => item.name === inheritedProperty.name)) { res.push(inheritedProperty) }
      })
      res.concat(this.dependencyPropertyReferences.map((item) => {
        return { name: item.name, domainId: item.domainId, id: item.id }
      }))
      return []
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
      return res.filter(item => item.dataType === this.variable.dataType)
    },
    inheritedPropertyReferences () {
      const res = []
      res.concat(this.$store.getters['properties/list'].filter(item => this.$store.state.domainParentage.some(parent => parent === item.domainId)))
      return res.filter(item => item.dataType === this.variable.dataType)
    },
    dependencyPropertyReferences () {
      const res = []
      res.concat(this.$store.getters['properties/list'].filter(item => this.$store.state.domainDependencyIds.some(dep => dep === item.domainId)))
      return res.filter(item => item.dataType === this.variable.dataType)
    }
  }
}
</script>

<style>

</style>