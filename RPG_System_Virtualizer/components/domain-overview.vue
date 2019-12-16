<template>
  <v-list dense shaped>
    <!--
    <ListHeaderWithIconButton
      icon="add"
      title="Properties"
      tooltip-text="Add New Property"
      @clicked="null"
    />
    <v-divider />
    <template v-for="item in properties">
      <v-list-item :key="item.id" />
      <v-divider :key="'divider-' + item.id" />
    </template>
    <ListHeaderWithIconButton
      icon="add"
      title="Equations"
      tooltip-text="Add New Equation"
      @clicked="null"
    />
    <v-divider />
    <template v-for="item in equations">
      <v-list-item :key="item.id" />
      <v-divider :key="'divider-' + item.id" />
    </template>
    <ListHeaderWithIconButton
      icon="add"
      title="Table Lookups"
      tooltip-text="Add New Table Lookup"
      @clicked="null"
    />
    <v-divider />
    <template v-for="item in lookups">
      <v-list-item :key="item.id" />
      <v-divider :key="'divider-' + item.id" />
    </template>
    <ListHeaderWithIconButton
      :condition="stringFormatters.length > 0"
      icon="add"
      title="Text Formatters"
      tooltip-text="Add New Text Formatter"
      @clicked="null"
    />
    <template v-for="(item, index) in stringFormatters">
      <v-list-item :key="item.id" />
      <v-divider v-if="index !== stringFormatters.length - 1" :key="'divider-' + item.id" />
    </template>
    -->
    <template v-for="subList in list">
      <ListHeaderWithIconButton
        :key="'header-' + subList.order"
        :condition="subList.condition ? subList.condition : oneOrMoreTextFormatters"
        :icon="subList.icon"
        :title="subList.title"
        :tooltip-text="subList.tooltipText"
        @clicked="subList.onClick"
      >
        <template v-slot:moreButtons>
          <v-btn icon @click="subList.listValue = !subList.listValue">
            <v-icon>{{ subList.listValue ? 'expand_less' : 'expand_more' }}</v-icon>
          </v-btn>
        </template>
      </ListHeaderWithIconButton>
      <template v-for="item in subList.list" v-show="subList.listValue">
        <v-list-item :key="'item-' + item.id">
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
          <v-spacer />
          <v-btn icon @click="editDomainName(item.id)">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon @click="deleteDomain(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider :key="'divider-' + item.id" />
      </template>
    </template>
  </v-list>
</template>

<script>
import ListHeaderWithIconButton from '~/components/list-header-with-icon-button.vue'

import service from '~/plugins/feathers-service.js'

export default {
  components: {
    ListHeaderWithIconButton
  },
  props: {
    domain: {
      type: Object,
      default: () => { return { id: null, name: null, version: '0.0' } }
    }
  },
  data () {
    return {
      propertiesList: true,
      equationsList: true,
      lookupsList: true,
      textFormattersList: true,
      list: [
        {
          condition: true,
          order: 1,
          title: 'Properties',
          icon: 'add',
          tooltipText: 'Add New Property',
          list: this.properties,
          listValue: this.showListOfProperties,
          onClick: () => this.toggleNewPropertyDialog()
        },
        {
          condition: true,
          order: 2,
          title: 'Equations',
          icon: 'add',
          tooltipText: 'Add New Equation',
          list: this.equations,
          listValue: this.showListOfEquations,
          onClick: () => this.toggleNewFunctionDialog('equation')
        },
        {
          condition: true,
          order: 3,
          title: 'Table Lookups',
          icon: 'add',
          tooltipText: 'Add New Table Lookup',
          list: this.lookups,
          listValue: this.showListOfLookups,
          onClick: () => this.toggleNewFunctionDialog('lookup')
        },
        {
          order: 4,
          title: 'Text Formatters',
          icon: 'add',
          tooltipText: 'Add New Text Formatter',
          list: this.stringFormatters,
          listValue: this.showListOfTextFormatters,
          onClick: () => this.toggleNewFunctionDialog('string_formatter')
        }
      ]
    }
  },
  computed: {
    showListOfProperties: {
      get () {
        return this.propertiesList
      },
      set (value) {
        this.propertiesList = value
      }
    },
    showListOfEquations: {
      get () {
        return this.equationsList
      },
      set (value) {
        this.equationsList = value
      }
    },
    showListOfLookups: {
      get () {
        return this.lookupsList
      },
      set (value) {
        this.lookupsList = value
      }
    },
    showListOfTextFormatters: {
      get () {
        return this.textFormattersList
      },
      set (value) {
        this.textFormattersList = value
      }
    },
    oneOrMoreTextFormatters () {
      return this.stringFormatters.length > 0
    },
    properties () {
      return this.$store.getters['properties/list']
    },
    // Function Distinctions
    equations () {
      return this.$store.getters['functions/list'].filter(item => item.functionType === 'equation')
    },
    lookups () {
      return this.$store.getters['functions/list'].filter(item => item.functionType === 'lookup')
    },
    stringFormatters () {
      return this.$store.getters['functions/list'].filter(item => item.functionType === 'string_formatter')
    }
  },
  created () {
    if (!this.$store.state.properties) { service('properties')(this.$store) }
    if (!this.$store.state.functions) { service('functions')(this.$store) }
  },
  async mounted () {
    await this.$store.dispatch('properties/find', { query: {
      domainId: this.domain.id
    } })
    await this.$store.dispatch('functions/find', { query: {
      domainId: this.domain.id
    } })
  },
  methods: {
    toggleNewPropertyDialog () {
      console.log('adding property')
      this.$emit('newProperty')
    },
    addNewProperty () {
    },
    toggleNewFunctionDialog (functionType) {
      console.log('adding function of type: ' + functionType)
      this.$emit('newFunction', { type: functionType })
    },
    addNewFunction () {
    }
  }
}
</script>

<style lang="stylus">

</style>