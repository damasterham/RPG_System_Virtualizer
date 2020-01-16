<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-card width="100%" height="64px" @click="$router.push({ name: 'system-id' })">
      <v-card-title class="display-1">
        RPGSV
      </v-card-title>
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