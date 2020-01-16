<template>
  <v-app>
    <leftDrawer :drawer="domainDrawer">
      <template v-slot:default>
        <!-- List of all domains, add new / rename / delete domain functionality -->
        <v-list dense shaped>
          <v-list-item @click="newDomain()">
            <v-list-item-title>
              Add Domain
            </v-list-item-title>
            <v-list-item-action>
              <v-icon>add</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-divider />
          <template v-for="item in domains">
            <v-list-item :key="item.id" :input-value="domain && item.id === domain.id" color="blue-grey lighten-1" @click="selectDomain(item)">
              <v-tooltip v-if="domainNameEdit !== item.id" right>
                <template v-slot:activator="{ on }">
                  <v-list-item-title style="cursor: pointer" v-on="on">
                    {{ item.name }}
                  </v-list-item-title>
                </template>
                <span>{{ item.name }}</span>
              </v-tooltip>
              <v-text-field
                v-else
                autofocus
                :value="domainNameEditValue"
                label="Domain Name"
                @change="domainNameEditValue = $event"
                @blur="domainNameEdit = 0"
              />
              <v-spacer />
              <v-btn icon @click.stop="editDomainName(item.id)">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn icon @click.stop="deleteDomain(item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-list-item>
            <v-divider :key="'divider' + item.id" />
          </template>
        </v-list>
      </template>
    </leftDrawer>
    <v-content>
      <v-app-bar>
        <v-app-bar-nav-icon clipped-left @click="domainDrawer = !domainDrawer">
          <v-icon>menu</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>System Designer{{ system.name ? ' - ' : '' }}{{ system.name }}</v-toolbar-title>
      </v-app-bar>
      <v-container fluid>
        <v-row dense style="height: 90.6vh">
          <v-col id="Domain Family Settings" cols="3" style="max-height: 90.5vh; overflow-y: auto">
            <!-- Add domain parent and dependencies, as well as overview and removal of dependencies -->
            <domainInheritance v-if="domain !== null" :domain="domain" style="height: 99%" />
          </v-col>
          <v-divider vertical />
          <v-col id="Domain Overview" cols="3" style="max-height: 90.5vh; overflow-y: auto">
            <!-- Overview of properties and functions in the domain, add new / rename / delete properties/functions functionality -->
            <domainOverview
              v-if="domain !== null"
              ref="domainOverview"
              :domain="domain"
              :property="$store.getters.getProperty()"
              :func="$store.getters.getFunction()"
              @newProperty="newProperty()"
              @newFunction="newFunction($event)"
            />
          </v-col>
          <v-divider vertical />
          <v-col id="Property/Function Settings">
            <v-row no-gutters :style="'height: |x|; overflow-y: auto'.replace('|x|', func === null ? '90.5vh' : 90.4 / 2 + 'vh')">
              <v-col v-if="property !== null" id="Property Settings" cols="12" style="height: 100%">
                <!-- Property overview & settings -->
                <propertySettings :domain="domain" :property="property" />
              </v-col>
            </v-row>
            <v-divider v-if="func !== null && property !== null" />
            <v-row no-gutters :style="'height: |x|; overflow-y: auto'.replace('|x|', property === null ? '90.5vh' : 90.4 / 2 + 'vh')">
              <v-col v-if="func !== null" id="Function Settings" cols="12" style="height: 100%">
                <!-- function overview & settings -->
                <functionSettings :domain="domain" :func="func" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <!-------------------------------------------------------------- Dialogs -->
      <!-- New property Dialog -->
      <fillOutDialog :toggle="newPropDialog">
        <template v-slot:content>
          <v-form ref="newPropForm" v-model="newPropValid">
            <v-text-field v-model="newPropName" :rules="rules" label="Property Name" @change="logIt(newPropName)" />
            <v-autocomplete v-model="newPropType" :rules="rules" :items="dataTypes" label="Property Data Type" @change="logIt(newPropType)" />
            <v-autocomplete v-model="newPropValue" :rules="rules" :items="valueTypes" label="Property Value Source" @change="logIt(newPropValue)" />
          </v-form>
        </template>
        <template v-slot:buttons>
          <v-spacer />
          <SaveCancelButtons
            cancel-button-text="Cancel"
            commit-button-text="Create"
            :disable-commit="!newPropValid"
            @cancel="closeNewPropDialog()"
            @commit="createNewProperty()"
          />
        </template>
      </fillOutDialog>

      <!-- New Function Dialog -->
      <fillOutDialog :toggle="newFuncDialog">
        <template v-slot:content>
          <v-form ref="newFuncForm" v-model="newFuncValid">
            <v-text-field v-model="newFuncName" :rules="rules" label="Function Name" />
            <v-text-field readonly :value="newFuncType | capitalizeFirstLetter" />
            <v-autocomplete v-model="newFuncDataType" :rules="rules" :items="selectableDataTypes" label="Function Data Type" />
          </v-form>
        </template>
        <template v-slot:buttons>
          <v-spacer />
          <SaveCancelButtons
            cancel-button-text="Cancel"
            commit-button-text="Create"
            :disable-commit="!newFuncValid"
            @cancel="closeNewFuncDialog()"
            @commit="createNewFunction()"
          />
        </template>
      </fillOutDialog>
    </v-content>
  </v-app>
</template>

<script>
import domainInheritance from '~/components/domain-inheritance.vue'
import domainOverview from '~/components/domain-overview.vue'
import propertySettings from '~/components/property-settings.vue'
import functionSettings from '~/components/function-settings.vue'
import fillOutDialog from '~/components/fill-out-dialog.vue'
import SaveCancelButtons from '~/components/save-cancel-buttons.vue'
import leftDrawer from '~/components/left-drawer.vue'

import service from '~/plugins/feathers-service.js'

export default {
  components: {
    domainInheritance,
    domainOverview,
    fillOutDialog,
    functionSettings,
    leftDrawer,
    propertySettings,
    SaveCancelButtons
  },
  filters: {
    capitalizeFirstLetter (val) {
      return val.charAt(0).toUpperCase() + val.substring(1)
    }
  },
  data () {
    return {
      domainDrawer: true,
      domainNameEdit: 0,
      dataTypes: [
        { text: 'Decimal', value: 'float' },
        { text: 'Number', value: 'int' },
        { text: 'Text', value: 'string' },
        { text: 'True/False', value: 'boolean' }
      ],
      valueTypes: [
        { text: 'Function', value: 'function' },
        { text: 'Property', value: 'property' },
        { text: 'User Input', value: 'raw_value' },
        { text: 'Domain', value: 'domain' }
      ],

      // Rules
      rules: [
        v => !!v || 'Field is Required'
      ],

      // New property
      newPropDialog: false,
      newPropValid: false,
      newProp: {},
      newPropName: '',
      newPropType: '',
      newPropValue: '',

      // New Function
      newFuncDialog: false,
      newFuncValid: false,
      newFunc: {},
      newFuncName: '',
      newFuncType: '',
      newFuncDataType: ''
    }
  },
  computed: {
    selectableDataTypes () {
      switch (this.newFuncType) {
        case 'equation': return this.dataTypes.filter(item => item.value !== 'string' && item.value !== 'boolean')
        case 'lookup': return this.dataTypes.filter(item => item.value === 'int')
        default: return this.dataTypes
      }
    },
    system () {
      const system = this.$store.state.system
      if (system !== null) { return system }
      return { id: 0 }
    },
    domain () {
      return this.$store.getters.getDomain()
    },
    property () {
      return this.$store.getters.getProperty()
    },
    func () {
      return this.$store.getters.getFunction()
    },
    domains () {
      return this.$store.getters['domains/list']
    },
    propertyMinFill () {
      return this.newPropName && this.newPropName !== null && this.newPropName !== '' &&
        this.newPropType && this.newPropType !== null && this.newPropType !== '' &&
        this.newPropValue && this.newPropValue !== null && this.newPropValue !== ''
    },
    functionMinFill () {
      return this.newFuncName && this.newFuncName !== null && this.newFuncName !== '' &&
        this.newFuncDataType && this.newFuncDataType !== null && this.newFuncDataType !== ''
    },
    domainNameEditValue: {
      get () {
        const obj = this.domains.find(item => item.id === this.domainNameEdit)
        if (obj) { return obj.name }
        return ''
      },
      set (value) {
        this.$store.dispatch('domains/patch', [this.domainNameEdit, { name: value }])
        this.domainNameEdit = 0
      }
    }
  },
  created () {
    service('domains')(this.$store)
    service('domain-dependencies')(this.$store)
    service('properties')(this.$store)
    service('properties-domains')(this.$store)
    service('properties-functions')(this.$store)
    service('properties-properties')(this.$store)
    service('property-specific-variables')(this.$store)
    service('raw-values')(this.$store)
    service('functions')(this.$store)
    service('equation-rounder')(this.$store)
    service('variables')(this.$store)
    service('variables-domains')(this.$store)
    service('variables-functions')(this.$store)
    service('variables-properties')(this.$store)
    if (this.$store.state.system === null) { service('systems')(this.$store) }
  },
  async mounted () {
    if (this.$store.state.system === null) {
      const system = await this.$store.dispatch('systems/get', this.$route.params.id)
      this.$store.commit('selectSystem', system)
    }
    this.$nextTick(async () => {
      await this.$store.dispatch('domains/find', { query: {
        systemId: this.system.id, $sort: { name: 1 }
      },
      $clear: true })
    })
  },
  methods: {
    // Domains
    async newDomain () {
      const res = await this.$store.dispatch('domains/create', {
        name: 'Domain ' + (this.domains.length + 1),
        systemId: this.system.id
      })
      this.$nextTick(() => this.editDomainName(res.id))
    },
    editDomainName (domainId) {
      this.domainNameEdit = domainId
    },
    async selectDomain (domain) {
      this.$store.commit('selectDomain', null)
      this.$store.commit('selectProperty', null)
      this.$store.commit('selectFunction', null)
      if (this.$store.getters['domain-dependencies/list'].length === 0) {
        await this.$store.dispatch('domain-dependencies/find', { query: { }, clear: true })
      }
      this.$store.commit('setDomainDependencyIds', this.$store.getters['domain-dependencies/list'].filter(item => item.domainId === domain.id).map(item => item.domainDependencyId))
      await this.$store.dispatch('properties/find', { query: {
        domainId: { $in: [domain.id].concat(this.$store.state.domainParentage).concat(this.$store.state.domainDependencyIds) }
      },
      $clear: true })
      await this.$store.dispatch('functions/find', { query: {
        domainId: { $in: [domain.id].concat(this.$store.state.domainParentage) }, $sort: { name: 1 }
      },
      $clear: true })
      this.$nextTick(() => {
        this.$store.commit('selectDomain', domain)
      })
    },
    deleteDomain (domain) {
      this.$store.dispatch('domains/remove', domain.id)
    },

    // Properties
    newProperty () {
      this.newProp.systemId = this.system.id
      this.newProp.domainId = this.domain.id
      this.newPropDialog = true
    },
    closeNewPropDialog () {
      this.newPropType = this.newPropValue = this.newPropName = ''
      this.newProp = {}
      this.newPropDialog = false
    },
    async createNewProperty () {
      this.newProp.name = this.newPropName
      this.newProp.dataType = this.newPropType
      this.newProp.referenceType = this.newPropValue
      const res = await this.$store.dispatch('properties/create', this.newProp)
      this.$store.commit('selectProperty', null)
      this.$nextTick(() => this.$store.commit('selectProperty', res))
      this.closeNewPropDialog()
    },

    // Functions
    newFunction (ev) {
      this.newFunc.systemId = this.system.id
      this.newFunc.domainId = this.domain.id
      this.newFuncType = ev.type
      this.newFuncDialog = true
    },
    closeNewFuncDialog () {
      this.newFuncType = this.newFuncName = this.newFuncDataType = ''
      this.newFunc = {}
      this.newFuncDialog = false
    },
    async createNewFunction () {
      this.newFunc.name = this.newFuncName
      this.newFunc.functionType = this.newFuncType
      this.newFunc.dataType = this.newFuncDataType
      const res = await this.$store.dispatch('functions/create', this.newFunc)
      this.$store.commit('selectFunction', null)
      this.$nextTick(() => this.$store.commit('selectFunction', res))
      this.closeNewFuncDialog()
    },

    // Utility
    logIt (x) {
      console.log(x)
    },
    logArray (x) {
      x.forEach(item => console.log(item))
    },
    logKeyValue (x) {
      Object.keys(x).forEach(key => console.log(`${key}: ${x[key]}`))
    }
  }
}
</script>

<style>
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #424242;
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #424242;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  background-color: #555;
}
</style>