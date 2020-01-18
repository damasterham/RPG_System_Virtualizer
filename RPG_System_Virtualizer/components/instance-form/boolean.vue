<template>
  <v-text-field
    v-model="value"
    :readonly="!data.editable"
    :label="data.label"
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