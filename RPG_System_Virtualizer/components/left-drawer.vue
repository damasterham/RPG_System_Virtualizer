<template>
  <v-navigation-drawer v-model="drawer" width="320" app>
    <v-card
      class="text-center pa-4"
      width="100%"
      height="64px"
      outlined
      @click="$router.push({ name: 'system-id' })"
    >
      <span class="display-1">RPGSV</span>
    </v-card>
    <slot />
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>