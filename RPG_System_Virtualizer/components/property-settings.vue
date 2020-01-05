<template>
  <div>
    <v-row no-gutters>
      <v-col style="margin-right: 4px">
        <v-text-field readonly label="Property Name" :value="property.name" />
      </v-col>
      <v-col style="margin-left: 4px">
        <v-text-field readonly label="Property Data Type" :value="property.dataType | firstLetterCapitalized" />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-autocomplete label="Property Value" :items="propertyValues" item-text="name" return-object @change="setPropertyValue($event)" />
    </v-row>
  </div>
</template>

<script>
export default {
  filters: {
    firstLetterCapitalized (val) {
      let res = ''
      res += val.charAt(0).toUpperCase()
      res += val.substring(1)
      return res
    }
  },
  props: {
    domain: {
      type: Object,
      default: () => { return { id: null, name: null, version: '0.0' } }
    },
    property: {
      type: Object,
      default: () => { return { id: null, name: '', dataType: null } }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    propertyValues () {
      const res = []
      return res.concat(this.properties).concat(this.dependencies)
    },
    properties () {
      const res = []
      const list = [ ...this.$store.getters['properties/list'] ]
      list.splice(list.findIndex(item => item.id === this.property.id), 1)
      list.forEach((item) => {
        if (item.dataType === this.property.dataType) {
          res.push(item)
        }
      })
      console.log('properties | ', res)
      return res
    },
    dependencies () {
      return []
    }
  },
  methods: {
    setPropertyValue (e) {
      console.log('setPropertyValue | ', e)
    }
  }
}
</script>

<style lang="stylus">

</style>