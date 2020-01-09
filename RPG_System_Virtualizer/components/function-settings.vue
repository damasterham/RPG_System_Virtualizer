<template>
  <div style="margin-top: 10px; margin-left: 5px">
    <v-row no-gutters>
      <v-chip outlined text-color="blue-grey lighten-2">
        Function
      </v-chip>
      &nbsp;
      <span class="headline">
        {{ func.name }}
      </span>
    </v-row>
    <v-row no-gutters>
      <v-col style="margin-right: 4px">
        <v-text-field readonly label="Type" :value="func.functionType | firstLetterCapitalized | removeUnderscore" />
      </v-col>
      <v-col style="margin-left: 4px">
        <v-text-field readonly label="Data Type" :value="func.dataType | firstLetterCapitalized" />
      </v-col>
    </v-row>
    <v-divider inset style="margin-right: 72px; margin-bottom: 10px" />
    <component
      :is="functionReferenceComponent"
      :func="func"
      :domain="domain"
    />
  </div>
</template>

<script>
import equationReference from '~/components/function-settings/equation-reference.vue'
import lookupReference from '~/components/function-settings/lookup-reference.vue'

export default {
  components: {
    equationReference,
    lookupReference
  },
  filters: {
    firstLetterCapitalized (val) {
      let res = ''
      if (val) {
        res += val.charAt(0).toUpperCase()
        res += val.substring(1)
      }
      return res
    },
    removeUnderscore (val) {
      return val.replace('_', ' ')
    }
  },
  props: {
    domain: {
      type: Object,
      default: () => { return { id: null, name: null, version: '0.0' } }
    },
    func: {
      type: Object,
      default: () => { return { id: null, name: '', dataType: null, functionType: null } }
    }
  },
  computed: {
    functionReferenceComponent () {
      switch (this.func.functionType) {
        case 'equation': return equationReference
        case 'lookup': return lookupReference
        default: return undefined
      }
    }
  }
}
</script>

<style lang="stylus">

</style>