<template>
  <div>
    <v-row no-gutters>
      <v-col style="margin-right: 4px">
        <v-text-field readonly label="Function Name" :value="func.name" />
      </v-col>
      <v-col style="margin-left: 4px; margin-right: 4px">
        <v-text-field readonly label="Function Data Type" :value="func.dataType | firstLetterCapitalized" />
      </v-col>
      <v-col style="margin-left: 4px">
        <v-text-field readonly label="Function Type" :value="func.functionType | firstLetterCapitalized | removeUnderscore" />
      </v-col>
    </v-row>
    <v-divider inset style="margin-right: 72px" />
    <!-- <component :is="functionReferenceComponent" /> -->
  </div>
</template>

<script>
// import equationReference from '~/components/function-settings/equations-reference.vue'

export default {
  components: {
    // equationReference
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
    /*
    functionReferenceComponent () {
      switch (this.property.functionType) {
        default: return equationReference
      }
    }
    */
  }
}
</script>

<style lang="stylus">

</style>