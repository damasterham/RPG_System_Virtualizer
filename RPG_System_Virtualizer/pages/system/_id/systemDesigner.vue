<template>
  <v-app>
    <leftDrawer :drawer="domainDrawer">
      <template v-slot:default>
        <!-- List of all domains, add new / rename / delete domain functionality -->
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab>
            Domain Collections
          </v-tab>
          <v-divider vertical />
          <v-tab>
            Domains
          </v-tab>
          <!-- Domain Collections -->
          <v-tab-item>
            <v-divider />
            <v-list dense shaped>
              <v-list-item @click="newDomainCollection()">
                <v-list-item-title>
                  Add Domain Collection
                </v-list-item-title>
                <v-list-item-action>
                  <v-icon>add</v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-divider />
              <template v-for="item in domainCollections">
                <v-list-item :key="item.id" :input-value="domainCollection && item.id === domainCollection.id" color="blue-grey lighten-1" @click="selectDomainCollection(item)">
                  <v-tooltip v-if="domainCollectionNameEdit !== item.id" right>
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
                    :value="domainCollectionNameEditValue"
                    label="Domain Collection Name"
                    @change="domainCollectionNameEditValue = $event"
                    @blur="domainCollectionNameEdit = 0"
                  />
                  <v-spacer />
                  <v-btn icon @click.stop="editDomainCollectionName(item.id)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn icon @click.stop="deleteDomainCollection(item)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-item>
                <v-divider :key="'divider' + item.id" />
              </template>
            </v-list>
          </v-tab-item>
          <!-- Domains -->
          <v-tab-item>
            <v-divider />
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
          </v-tab-item>
        </v-tabs>
        <!--
        <v-list dense shaped>
          <v-list-item>
            <v-list-item-title>
              Add Domain Collection
              <v-list-item-action>
                <v-icon>add</v-icon>
              </v-list-item-action>
            </v-list-item-title>
            <ListHeaderWithIconButton
            :key="">
          </v-list-item>
          <v-divider /> g
        </v-list>
        -->
      </template>
    </leftDrawer>
    <v-content>
      <appToolbar :title="system.name ? 'System Designer - ' + system.name : 'System Designer'" @toggleLeftDrawer="domainDrawer = !domainDrawer" />
      <v-container fluid>
        <!-- Domain Collection -->
        <v-row v-if="domainCollection !== null" dense style="height: 90.6vh">
          <v-col cols="3" style="max-height: 90.5vh; overflow-y: auto">
            <h2>Woop!</h2>
            <domainCollection :domain-collection="domainCollection" style="height: 99%" />
          </v-col>
        </v-row>
        <!-- Domain -->
        <v-row v-if="domain !== null" dense style="height: 90.6vh">
          <v-col id="Domain Family Settings" cols="3" style="max-height: 90.5vh; overflow-y: auto">
            <!-- Add domain parent and dependencies, as well as overview and removal of dependencies -->
            <domainInheritance :domain="domain" style="height: 99%" />
          </v-col>
          <v-divider v-if="domain !== null" vertical />
          <v-col id="Domain Overview" cols="3" style="max-height: 90.6vh; overflow-y: auto">
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
          <v-divider v-if="domain !== null" vertical />
          <v-col id="Property/Function Settings" style="height: 90.6vh; overflow-y: auto">
            <v-row no-gutters :style="'height: |x|; overflow-y: auto'.replace('|x|', property === null ? '0px' : func === null ? '90.6vh' : 90.6 / 2 + 'vh')">
              <v-col v-if="property !== null" id="Property Settings" cols="12" style="height: 100%">
                <!-- Property overview & settings -->
                <propertySettings :domain="domain" :property="property" />
              </v-col>
            </v-row>
            <v-divider v-if="func !== null && property !== null" />
            <v-row no-gutters :style="'height: |x|; overflow-y: auto'.replace('|x|', func === null ? '0px' : property === null ? '90.4vh' : 90.4 / 2 + 'vh')">
              <v-col v-if="func !== null" id="Function Settings" cols="12" style="height: 100%">
                <!-- function overview & settings -->
                <functionSettings :domain="domain" :func="func" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

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
  </v-app>
</template>

<script>
import domainInheritance from '~/components/domain-inheritance.vue'
import domainOverview from '~/components/domain-overview.vue'
import domainCollection from '~/components/domain-collection.vue'
import propertySettings from '~/components/property-settings.vue'
import functionSettings from '~/components/function-settings.vue'
import fillOutDialog from '~/components/fill-out-dialog.vue'
import SaveCancelButtons from '~/components/save-cancel-buttons.vue'
import leftDrawer from '~/components/left-drawer.vue'
import appToolbar from '~/components/app-toolbar.vue'

import service from '~/plugins/feathers-service.js'

export default {
  components: {
    appToolbar,
    domainInheritance,
    domainOverview,
    domainCollection,
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
  async fetch ({ store, params }) {
    service('domains')(store)
    service('domain-dependencies')(store)
    service('domain-collections')(store)
    service('domain-collections-domains')(store)
    service('properties')(store)
    service('properties-domains')(store)
    service('properties-functions')(store)
    service('properties-properties')(store)
    service('property-specific-variables')(store)
    service('raw-values')(store)
    service('functions')(store)
    service('equation-rounder')(store)
    service('variables')(store)
    service('variables-domains')(store)
    service('variables-functions')(store)
    service('variables-properties')(store)
    service('systems')(store)
    if (store.state.system === null) {
      const system = await store.dispatch('systems/get', params.id)
      store.commit('selectSystem', system)
    }
    await store.dispatch('domains/find', {
      query: {
        systemId: store.state.system.id,
        $sort: { name: 1 }
      },
      $clear: true
    })
    await store.dispatch('domain-collections/find', {
      query: {
        systemId: store.state.system.id,
        $sort: { name: 1 }
      },
      $clear: true
    })
  },
  data () {
    return {
      domainDrawer: true,
      domainNameEdit: 0,
      domainCollectionNameEdit: 0,
      tab: 1,

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
    domainCollection () {
      return this.$store.getters.getDomainCollection()
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
    domainCollections () {
      return this.$store.getters['domain-collections/list']
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
    },
    domainCollectionNameEditValue: {
      get () {
        const obj = this.domainCollections.find(item => item.id === this.domainCollectionNameEdit)
        if (obj) { return obj.name }
        return ''
      },
      set (value) {
        this.$store.dispatch('domain-collections/patch', [this.domainCollectionNameEdit, { name: value }])
        this.domainCollectionNameEdit = 0
      }
    }
  },
  created () {
    // console.log(this.$route)
    // console.log(this.$router)
    service('domains')(this.$store)
    service('domain-dependencies')(this.$store)
    service('domain-collections')(this.$store)
    service('domain-collections-domains')(this.$store)
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
    service('systems')(this.$store)
  },
  methods: {
    clearCurrent () {
      // Empty to rerender
      this.$store.commit('selectDomain', null)
      this.$store.commit('selectProperty', null)
      this.$store.commit('selectFunction', null)
      this.$store.commit('selectDomainCollection', null)
    },
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
      this.clearCurrent()
      if (this.$store.getters['domain-dependencies/list'].length === 0) {
        await this.$store.dispatch('domain-dependencies/find', { query: { domainId: this.$store.getters['domains/list'].map(item => item.id) }, clear: true })
      }
      this.$store.commit('setDomainDependencyIds', this.$store.getters['domain-dependencies/list'].filter(item => item.domainId === domain.id).map(item => item.domainDependencyId))
      await this.$store.dispatch('properties/find', { query: {
        domainId: [domain.id].concat(this.$store.state.domainParentage).concat(this.$store.state.domainDependencyIds)
      },
      $clear: true })
      await this.$store.dispatch('functions/find', { query: {
        domainId: [domain.id].concat(this.$store.state.domainParentage), $sort: { name: 1 }
      },
      $clear: true })
      this.$nextTick(() => {
        this.$store.commit('selectDomain', domain)
      })
    },
    deleteDomain (domain) {
      this.$store.dispatch('domains/remove', domain.id)
    },
    // Domain Collections
    async newDomainCollection () {
      const res = await this.$store.dispatch('domain-collections/create', {
        name: 'Domain Collection ' + (this.domainCollections.length + 1),
        systemId: this.system.id
      })
      this.$nextTick(() => this.editDomainCollectionName(res.id))
    },
    editDomainCollectionName (domainCollectionId) {
      this.domainCollectionNameEdit = domainCollectionId
    },
    selectDomainCollection (domainCollection) {
      this.clearCurrent()
      this.$nextTick(() => this.$store.commit('selectDomainCollection', domainCollection))
      // if (this.$store.getters['domain-collections-domains/list'].length === 0) {
      //   this.$store.commit('selectDomainCollection', )
      //   await this.$store.dispatch('domain-collections-domains/find', {
      //     query: {
      //       domainCollectionId: domainCollection.id
      //     },
      //     $clear: true
      //   })
      // }
    },
    deleteDomainCollection (domainCollection) {
      this.$store.dispatch('domain-collections/remove', domainCollection.id)
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