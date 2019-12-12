<template>
  <div>
    <v-btn :color="commitButtonColor" :disabled="disableCommit" @click="$emit('commit')">
      {{ commitButtonText }}
    </v-btn>
    <v-btn :color="cancelButtonColor" outlined @click="$emit('cancel')">
      {{ cancelButtonText }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    cancelButtonColor: {
      type: String,
      default: 'Primary'
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel'
    },
    commitButtonColor: {
      type: String,
      default: 'Primary'
    },
    commitButtonText: {
      type: String,
      default: 'Commit'
    },
    disableCommit: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus">

</style>