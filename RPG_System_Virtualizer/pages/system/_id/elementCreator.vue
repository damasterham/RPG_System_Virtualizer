<template>
  <v-app>
    <leftDrawer :drawer="domainDrawer">
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
    </leftDrawer>
    <v-content>
      <appToolbar
        :title="system.name ? 'Content Creator - ' + system.name : 'Content Creator'"
        @toggleLeftDrawer="domainDrawer = !domainDrawer"
      />
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
      domainDrawer: true
    }
  },
  computed: {
    system () {
      return this.$store.state.system
    },
    domainCollections () {
      return this.$store.getters['domain-collections/list']
    }
  },
  created () {
    service('systems')(this.$store)
    service('domain-collections')(this.$store)
  },
  methods: {
    selectCollection (collection) {
      console.log(collection)
    }
  }
}
</script>

<style>

</style>