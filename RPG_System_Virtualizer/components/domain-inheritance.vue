<template>
  <div>
    <v-autocomplete
      ref="parentSelect"
      :value="parentDomain"
      clearable
      label="Parent Domain"
      :items="parentOptions"
      item-text="name"
      item-value="id"
      @change="parentDomain = $event"
    />
    <v-autocomplete
      v-model="dependencies"
      label="Add Dependency..."
      name="something not triggering autofill"
      :items="domains"
      item-text="name"
      item-value="id"
    />
    <v-list>
      <template v-for="(dependency, index) in dependencies">
        <v-list-item :key="'dependency-' + dependency">
          <v-list-item-title>
            {{ $store.getters['domains/get'](dependency).name }}
          </v-list-item-title>
          <v-list-item-action>
            <v-btn icon @click="removeDomainDependencyId(dependency)">
              <v-icon>
                cancel
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="index < dependencies.length - 1" :key="'dependency-divider-' + dependency" />
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  props: {
    domain: {
      type: Object,
      default: () => { return { id: null, name: null, version: '0.0' } }
    }
  },
  data () {
    return {
      parent: { name: '' }
    }
  },
  computed: {
    dependencies: {
      get () {
        return this.$store.getters.getDomainDependencyIds()
      },
      set (value) {
        this.addDomainDependency(value)
      }
    },
    domains () {
      const list = this.$store.getters['domains/list'].filter((item) => {
        return item.id !== this.domain.id &&
          !this.dependencies.some(dependency => dependency === item.id)
      })
      this.$store.state.domainParentage.forEach(parent => list.splice(list.findIndex(item => item.id === parent.id), 1))
      return list
    },
    parentOptions () {
      const list = JSON.parse(JSON.stringify(this.domains))
      if (this.domain.parentDomainId) { list.push(this.$store.getters['domains/get'](this.domain.parentDomainId)) }
      return list
    },
    parentDomain: {
      get () {
        if (this.domain.parentDomainId === null) { return '' }
        const res = this.$store.getters['domains/get'](this.domain.parentDomainId).name
        return res
      },
      set (value) {
        if (!value) { value = null }
        if (value !== this.domain.parentDomainId) { this.setDomainParent(value) }
      }
    }
  },
  async mounted () {
    const dependencies = await this.$store.dispatch('domain-dependencies/find', { query: { }, clear: true })
    this.$store.commit('setDomainDependencyIds', dependencies.filter(item => item.domainId === this.domain.id).map(item => item.domainDependencyId))
    if (this.domain.parentDomainId) { this.$refs.parentSelect.setValue(this.domain.parentDomainId) }
  },
  methods: {
    handleCircularDependencyError (source) {

    },
    async setDomainParent (value) {
      if (value !== null) {
        const circularDependency = this.checkForCircularDependency(this.domain.id, this.$store.getters['domains/get'](value))
        if (circularDependency) {
          // handle circular dependency error
          this.handleCircularDependencyError('parent')
          return
        }
      }
      const res = await this.$store.dispatch('domains/patch', [this.domain.id, { parentDomainId: value }])
      this.$store.commit('selectDomain', res)
      this.$store.dispatch('properties/find', { query: { domainId: { $in: [res.id].concat(this.$store.state.domainParentage).concat(this.dependencies) } }, $clear: true })
      this.$store.dispatch('functions/find', { query: { domainId: { $in: [res.id].concat(this.$store.state.domainParentage) } }, $clear: true })
      this.$nextTick(() => {
        this.$refs.parentSelect.setValue(res.parentDomainId)
      })
    },
    addDomainDependency (value) {
      const circularDependency = this.checkForCircularDependency(this.domain.id, this.$store.getters['domains/get'](value))
      if (circularDependency) {
        // handle circular dependency error
        this.handleCircularDependencyError('dependency')
      } else {
        this.$store.dispatch('domain-dependencies/create', { domainId: this.domain.id, domainDependencyId: value })
        this.$store.commit('addDomainDependencyId', value)
        this.$store.dispatch('properties/find', { query: { domainIn: value } })
      }
    },
    async removeDomainDependencyId (dependency) {
      await this.$store.dispatch('domain-dependencies/remove', [null, { query: { domainId: this.domain.id, domainDependencyId: dependency } }])
      this.$store.commit('removeDomainDependencyId', dependency)
      this.$store.commit('properties/removeItems', dependency, 'domainId')
    },
    checkForCircularDependency (domainId, dependency) {
      console.log('checkForCircularDependency', dependency)
      if (dependency.parentDomainId === domainId) { return true } // check to see if parent is target domain
      this.$store.getters['domain-dependencies/list'].filter(item => item.domainId === dependency.id).forEach((item) => { if (item === domainId) { return true } }) // check to see if target domain is among dependencies
      if (dependency.parentDomainId !== null && this.checkForCircularDependency(domainId, this.$store.getters['domains/get'](dependency.parentDomainId))) { return true } // recursively check parent
      return false // target domain not found, no circular dependency
    }
  }
}
</script>

<style lang="stylus">

</style>