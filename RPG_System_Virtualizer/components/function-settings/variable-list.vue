<template>
  <div>
    <span class="subtitle-1">
      Variables
    </span>
    <v-row id="listOfVariables" no-gutters>
      <template v-for="(variable, index) in variables">
        <variable :key="variable.id" />
        <v-divider v-if="index !== variables.length - 1" :key="'divider-' + variable.id" />
      </template>
    </v-row>
  </div>
</template>

<script>
import variable from '~/components/function-settings/variable.vue'

export default {
  components: {
    variable
  },
  props: {
    func: {
      type: Object,
      default: () => {}
    },
    limited: {
      type: Number,
      default: 0
    },
    variables: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style>

</style>