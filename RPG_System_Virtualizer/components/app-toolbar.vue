<template>
  <v-app-bar>
    <v-app-bar-nav-icon clipped-left @click="$emit('toggleLeftDrawer')">
      <v-icon>menu</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer />
    <v-btn text class="mx-2" @click="$router.push({name: 'system-id-systemDesigner', params: { id: $store.state.system.id } })">
      System Designer
    </v-btn>
    <v-divider vertical />
    <v-btn text class="mx-2">
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
  }
}
</script>

<style>

</style>