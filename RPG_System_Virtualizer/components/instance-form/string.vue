<template>
  <v-text-field
    :value="value"
    :readonly="!data.editable"
    :label="data.label"
    :rules="data.rules"
    @change="value = $event"
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
      val: null
    }
  },
  computed: {
    value: {
      get () {
        return this.val
      },
      set (val) {
        this.val = val
      }
    },
    valid () {
      this.data.rules.forEach((rule, index) => {
        const res = rule(this.value)
        console.log('ruleRes', res)
        console.log('rule', rule)
        console.log('rule ' + index, rule(this.value))
        if (typeof rule(this.value) === 'string') { return false }
      })
      return true
    }
  },
  watch: {
    value (val) {
      this.$emit('change', this.data.rules.every(rule => rule(val) === true))
    }
  },
  mounted () {
    if (this.data.default) { this.value = this.data.default }
    console.log(this.data)
  }
}
</script>

<style>

</style>