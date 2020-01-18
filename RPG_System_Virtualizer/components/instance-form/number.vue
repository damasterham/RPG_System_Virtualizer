<template>
  <v-text-field
    v-model="value"
    type="number"
    :readonly="!data.editable"
    :label="data.label"
    :rules="data.rules"
  />
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          label: '',
          dataType: ''
        }
      }
    }
  },
  data () {
    return {
      value: ''
    }
  },
  mounted () {
    if (this.data.default) { this.value = this.data.default }
  }
}
</script>

<style>

</style>