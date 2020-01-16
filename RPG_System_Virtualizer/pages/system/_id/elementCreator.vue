<template>
  <v-app>
    <leftDrawer :drawer="domainDrawer" />
    <v-content>
      <appToolbar :title="system.name ? 'Content Creator - ' + system.name : 'Content Creator'" @toggleLeftDrawer="domainDrawer = !domainDrawer" />
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
    if (store.state.system === null) {
      const system = await store.dispatch('systems/get', params.id)
      store.commit('selectSystem', system)
    }
  },
  data () {
    return {
      domainDrawer: true
    }
  },
  computed: {
    system () {
      return this.$store.state.system
    }
  }
}
</script>

<style>

</style>