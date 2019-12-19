<template>
  <div>
    <v-autocomplete v-model="parentDomain" label="Parent Domain" :items="domains" item-text="name" item-value="id" />
    <v-autocomplete
      v-model="dependencies"
      :items="domains"
      item-text="name"
      item-value="id"
      label="Add Dependency..."
    />
    <v-list>
      <template v-for="(dependency, index) in dependencies">
        <v-list-item :key="'dependency-' + dependency">
          <v-list-item-title>
            {{ $store.getters['domains/get'](dependency).name }}
          </v-list-item-title>
          <v-list-item-action>
            <v-btn icon @click="$store.commit('removeDomainDependencyId', dependency)">
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
import feathersClient from '~/plugins/feathers-client.js'

const domainService = feathersClient.service('domains')

export default {
  props: {
    domain: {
      type: Object,
      default: () => { return { id: null, name: null, version: '0.0' } }
    }
  },
  computed: {
    dependencies: {
      get () {
        return this.$store.getters.getDomainDependencyIds()
      },
      set (value) {
        console.log('dependencies', value)
        // this.$store.dispatch('domains/addDependency', value)
        this.$store.commit('addDomainDependencyId', value)
      }
    },
    domains () {
      return this.$store.getters['domains/list'].filter((item) => {
        return item.id !== this.domain.id &&
          item.id !== this.domain.parentDomainId &&
          !this.dependencies.some(dependency => dependency === item.id)
      })
    },
    parentDomain: {
      get () {
        return this.$store.getters['domains/list'].find(item => item.id === this.domain.parentDomainId)
      },
      async set (value) {
        const res = await this.$store.dispatch('domains/patch', [this.domain.id, { parentDomainId: value }])
        this.$store.commit('selectDomain', res)
      }
    }
  },
  mounted () { // Wrapper-Service to allow for getting and changing domain dependencies required
    console.log(domainService)
    // this.$store.commit('setDomainDependencyIds', await this.$store.dispatch('domains/findAllDependencyIds', this.domain.id))
    // this.$store.commit('setDomainDependencyIds', await domainService.findAllDependencyIds(this.domain.id))
  }
}
</script>

<style lang="stylus">

</style>