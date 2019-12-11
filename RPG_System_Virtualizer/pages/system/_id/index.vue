<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout row wrap>
        <v-flex v-for="system in systems" :key="system.id" xs3>
          <v-card />
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import service from '~/plugins/feathers-service.js'
export default {
  computed: {
    systems () {
      return this.$store.getters['system/list']
    }
  },
  created () {
    service('systems')
  },
  mounted () {
    this.$store.dispatch('systems/find', { query: { } })
  }
}
</script>

<style lang="stylus">

</style>