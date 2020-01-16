<template>
  <v-app-bar>
    <v-app-bar-nav-icon clipped-left @click="$emit('toggleLeftDrawer')">
      <v-icon>menu</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer />
    <v-btn text class="mx-2" @click="emptySelections(); $router.push({name: 'system-id-systemDesigner', params: { id: $store.state.system.id } })">
      System Designer
    </v-btn>
    <v-divider vertical />
    <v-btn text class="mx-2" @click="emptySelections(); $router.push({ name: 'system-id-elementCreator', params: { id: $store.state.system.id } })">
      Content Creator
    </v-btn>
    <v-divider vertical />
    <v-btn text class="mx-2">
      System Utilizer
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    emptySelections () {
      this.$store.commit('selectDomain', null)
      this.$store.commit('selectProperty', null)
      this.$store.commit('selectFunction', null)
      this.$store.commit('selectCollection', null)
    }
  }
}
</script>

<style>

</style>