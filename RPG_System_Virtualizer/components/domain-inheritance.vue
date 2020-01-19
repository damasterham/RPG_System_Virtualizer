<template>
  <div>
    <v-row no-gutters>
      <p class="title ml-3">
        {{ domain.name }}
      </p>
      <v-spacer />
      <v-chip class="mr-3" outlined text-color="blue-grey lighten-2">
        Domain
      </v-chip>
    </v-row>
    <v-divider />
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-checkbox v-model="instantiableDomain" :disabled="!legalInstantiable" hide-details label="Instantiable" v-on="on" />
      </template>
      <p class="my-0 py-0">
        This makes the Domain instantiable on its own.
      </p>
      <p class="my-0 py-0">
        A Domain must have no dependencies, to be able to be flagged as instantiable.
      </p>
    </v-tooltip>
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
      :disabled="instantiableDomain"
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
    instantiableDomain: {
      get () {
        return this.domain.instantiable
      },
      async set (val) {
        await this.$store.dispatch('domains/patch', [this.domain.id, { instantiable: val }])
      }
    },
    legalInstantiable () {
      let domain = this.domain
      while (domain.parentDomainId !== null || domain.id === this.domain.id) {
        if (this.$store.getters['domain-dependencies/list'].filter(item => item.domainId === domain.id).length !== 0) { return false }
        if (domain.parentDomainId !== null) {
          domain = this.$store.getters['domains/get'](domain.parentDomainId)
        } else { break }
      }
      return true
    },
    parentOptions () {
      const list = JSON.parse(JSON.stringify(this.domains))
      if (this.domain.parentDomainId) { list.push(this.$store.getters['domains/get'](this.domain.parentDomainId)) }
      if (this.instantiableDomain) { return list.filter((item) => { return !this.$store.getters['domain-dependencies/list'].some(dep => dep.domainId === item.id) }) }
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
  mounted () {
    if (this.domain.parentDomainId) { this.$refs.parentSelect.setValue(this.domain.parentDomainId) }
  },
  methods: {
    handleCircularDependencyError (source) {
      // This is where we would handle circular dependencies
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
      this.$store.dispatch('properties/find', { query: { domainId: [res.id].concat(this.$store.state.domainParentage).concat(this.dependencies) }, $clear: true })
      this.$store.dispatch('functions/find', { query: { domainId: [res.id].concat(this.$store.state.domainParentage) }, $clear: true })
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
        this.$store.dispatch('properties/find', { query: { domainId: value } })
      }
    },
    async removeDomainDependencyId (dependency) {
      await this.$store.dispatch('domain-dependencies/remove', [null, { query: { domainId: this.domain.id, domainDependencyId: dependency } }])
      this.$store.commit('removeDomainDependencyId', dependency)
      this.$store.commit('properties/removeItem', dependency, 'domainId')
    },
    checkForCircularDependency (domainId, dependency) {
      console.log('checkForCircularDependency', dependency)
      if (dependency.parentDomainId === domainId) { return true } // check to see if parent is target domain
      this.$store.getters['domain-dependencies/list']
        .filter(item => item.domainId === dependency.id)
        .forEach((item) => { if (item === domainId) { return true } }) // check to see if target domain is among dependencies
      if (dependency.parentDomainId !== null) {
        return this.checkForCircularDependency( // recursively check parent
          domainId,
          this.$store.getters['domains/get'](dependency.parentDomainId))
      }
      return false // target domain not found, no circular dependency
    }
  }
}
</script>

<style lang="stylus">

</style>