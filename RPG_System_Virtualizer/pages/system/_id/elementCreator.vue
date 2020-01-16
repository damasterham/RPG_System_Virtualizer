<template>
  <v-app>
    <leftDrawer :drawer="domainDrawer">
      <template v-slot:default>
        <v-tabs fixed-tabs>
          <v-tab>
            Collections
          </v-tab>
          <v-divider vertical />
          <v-tooltip top open-delay="1000">
            <template v-slot:activator="{ on }">
              <v-tab v-on="on">
                <span>Domains</span>
              </v-tab>
            </template>
            <span>All domains marked with Instantiable are shown here.</span>
          </v-tooltip>
          <v-tab-item>
            <v-divider />
            <v-list shaped>
              <template v-for="collection in domainCollections">
                <v-list-tile
                  :key="collection.id"
                  :input-value="domainCollection !== null && collection.id === domainCollection.id"
                  color="blue-grey lighten-1"
                  @click="selectCollection(collection)"
                >
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-list-item-title style="cursor: pointer" v-on="on">
                        {{ collection.name }}
                      </v-list-item-title>
                    </template>
                    <span>{{ collection.name }}</span>
                  </v-tooltip>
                </v-list-tile>
              </template>
            </v-list>
          </v-tab-item>
          <v-tab-item>
            <v-divider />
            <v-list shaped />
          </v-tab-item>
        </v-tabs>
      </template>
    </leftDrawer>
    <v-content>
      <appToolbar
        :title="system.name ? 'Content Creator - ' + system.name : 'Content Creator'"
        @toggleLeftDrawer="domainDrawer = !domainDrawer"
      />
      <v-row>
        <v-col />
        <v-col />
        <v-col />
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import leftDrawer from '~/components/left-drawer.vue'
import appToolbar from '~/components/app-toolbar.vue'
import service from '~/plugins/feathers-service.js'
export default {
  components: {
    leftDrawer,
    appToolbar
  },
  async fetch ({ store, params }) {
    service('systems')(store)
    service('domain-collections')(store)
    if (store.state.system === null) {
      const system = await store.dispatch('systems/get', params.id)
      store.commit('selectSystem', system)
    }
    await store.dispatch('domain-collections/find', { query: { systemId: store.state.system.id } })
  },
  data () {
    return {
      domainDrawer: true,
      sorting: 'A-Z',
      sorts: [
        'A-Z',
        'Z-A'
      ]
    }
  },
  computed: {
    system () {
      return this.$store.state.system
    },
    domainCollections () {
      return this.$store.getters['domain-collections/list']
    },
    domainCollectionInstances () {
      const list = [...this.$store.getters['domain-collection-instances']].sort((a, b) => {
        return this.sortAlphabetically(a, b, this.sorting === 'A-Z' ? 'ascending' : 'descending')
      })
      return list
    }
  },
  created () {
    service('systems')(this.$store)
    service('domain-collections')(this.$store)
  },
  methods: {
    selectConcept (concept) {
      console.log(concept)
    },
    sortAlphabetically (a, b, mode) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return mode === 'ascending' ? -1 : 1 }
      if (a.name.toLowerCase() > b.name.toLowerCase()) { return mode === 'ascending' ? 1 : -1 }
      return 0
    },
    assignSortAlgorithm (a, b) {
      switch (this.sorting) {
        case 'A-Z': return this.sortAlphabetically(a, b, 'ascending')
        case 'Z-A': return this.sortAlphabetically(a, b, 'descending')
      }
    }
  }
}
</script>

<style>

</style>