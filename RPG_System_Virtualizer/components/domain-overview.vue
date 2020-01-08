<template>
  <v-list dense shaped>
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
      <template
        v-for="field in subList.functionType
          ? $store.getters[subList.list + '/list'].filter(func => func.functionType === subList.functionType)
          : properties"
      >
        <v-list-item
          v-show="subList.listValue === true"
          :key="subList.list + '-item-' + field.id"
          :input-value="(property !== null && (property.id === field.id && field.referenceType)) || (func !== null && (func.id === field.id && field.functionType))"
          color="blue-grey lighten-1"
          @click="selectField(subList, field)"
        >
          <v-tooltip v-if="fieldNameEdit !== subList.list + '-' + field.id" right>
            <template v-slot:activator="{ on }">
              <v-list-item-title style="cursor: pointer" v-on="on">
                <v-icon small>
                  fiber_manual_record
                </v-icon>
                {{ field.name }}
              </v-list-item-title>
            </template>
            <span>{{ field.name }}</span>
          </v-tooltip>
          <v-text-field
            v-else
            autofocus
            hide-details
            :value="fieldNameEditValue"
            :label="subList.title === 'Properties'
              ? 'Property Name'
              : subList.title.substring(0, subList.title.length - 1) + ' Name'"
            @change="fieldNameEditValue = $event"
            @blur="fieldNameEdit = ''"
          />
          <v-spacer />
          <v-btn
            :disabled="
              field.referenceType && field.name === 'Name' ||
                field.domainId !== domain.id
            "
            icon
            @click.stop="editDomainFieldName(subList, field)"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn
            :disabled="
              field.referenceType && field.name === 'Name' ||
                field.domainId !== domain.id
            "
            icon
            @click.stop="deleteField(subList, field)"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider v-show="subList.listValue === true" :key="'divider-' + field.id" />
      </template>
    </template>
  </v-list>
</template>

<script>
import ListHeaderWithIconButton from '~/components/list-header-with-icon-button.vue'

export default {
  components: {
    ListHeaderWithIconButton
  },
  props: {
    domain: {
      type: Object,
      default: () => { return { id: null, name: null, version: '0.0' } }
    },
    property: {
      type: Object,
      default: () => null
    },
    func: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      fieldNameEdit: '',
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
          list: 'properties',
          listValue: true,
          onClick: () => this.toggleNewPropertyDialog()
        },
        {
          condition: true,
          order: 2,
          title: 'Equations',
          icon: 'add',
          tooltipText: 'Add New Equation',
          list: 'functions',
          functionType: 'equation',
          listValue: true,
          onClick: () => this.toggleNewFunctionDialog('equation')
        },
        {
          condition: true,
          order: 3,
          title: 'Table Lookups',
          icon: 'add',
          tooltipText: 'Add New Table Lookup',
          list: 'functions',
          functionType: 'lookup',
          listValue: true,
          onClick: () => this.toggleNewFunctionDialog('lookup')
        },
        {
          order: 4,
          title: 'Text Formatters',
          icon: 'add',
          tooltipText: 'Add New Text Formatter',
          list: 'functions',
          functionType: 'string_formatter',
          listValue: true,
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
      let list = []
      list = list.concat(this.$store.getters['properties/list'].filter(item => item.domainId === this.domain.id))
      this.$store.state.domainParentage.forEach((parent) => {
        this.$store.getters['properties/list'].filter(item => item.domainId === parent).forEach((inheritedProp) => {
          if (list.every(prop => prop.name.toLowerCase() !== inheritedProp.name.toLowerCase())) { list.push(inheritedProp) }
        })
      })
      return list
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
    },
    fieldNameEditValue: {
      get () {
        const params = this.fieldNameEdit.split('-')
        const obj = this.$store.getters[params[0] + '/list'].find(item => item.id === parseInt(params[1]))
        if (obj) { return obj.name }
        return ''
      },
      async set (value) {
        const params = this.fieldNameEdit.split('-')
        await this.$store.dispatch(params[0] + '/patch', [params[1], { name: value }])
        this.fieldNameEdit = ''
      }
    }
  },
  methods: {
    async fetchPropertiesAndFunctions () {
      await this.$store.dispatch('properties/find', { query: {
        domainId: { $in: [this.domain.id].concat(this.$store.state.domainParentage).concat(this.$store.state.domainDependencyIds) }, $sort: { name: 1 }
      },
      $clear: true })
      await this.$store.dispatch('functions/find', { query: {
        domainId: { $in: [this.domain.id].concat(this.$store.state.domainParentage) }, $sort: { name: 1 }
      },
      $clear: true })
    },
    toggleNewPropertyDialog () {
      this.$emit('newProperty')
    },
    toggleNewFunctionDialog (functionType) {
      this.$emit('newFunction', { type: functionType })
    },
    editDomainFieldName (list, field) {
      this.fieldNameEdit = list.list + '-' + field.id
    },
    async deleteField (list, field) {
      await this.$store.dispatch(list.list + '/remove', field.id)
    },
    selectField (list, field) {
      if (list.title === 'Properties') {
        this.$store.commit('selectProperty', null)
        this.$nextTick(() => this.$store.commit('selectProperty', field))
      } else {
        this.$store.commit('selectFunction', null)
        this.$nextTick(() => this.$store.commit('selectFunction', field))
      }
    }
  }
}
</script>

<style lang="stylus">

</style>