<template>
  <v-app>
    <leftDrawer :drawer="domainDrawer">
      <template v-slot:default>
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab>
            Domain Collections
          </v-tab>
          <v-divider vertical />
          <v-tooltip top open-delay="1000">
            <template v-slot:activator="{ on }">
              <v-tab v-on="on">
                <span>Domains</span>
              </v-tab>
            </template>
            <span>All domains marked with 'instantiable' are shown here.</span>
          </v-tooltip>
          <v-tab-item>
            <v-divider />
            <v-list shaped>
              <template v-for="collection in domainCollections">
                <v-list-item
                  :key="collection.id"
                  :input-value="domainCollection !== null && collection.id === domainCollection.id"
                  color="blue-grey lighten-1"
                  @click="selectConcept(collection, 'collection')"
                >
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-list-item-title style="cursor: pointer" v-on="on">
                        {{ collection.name }}
                      </v-list-item-title>
                    </template>
                    <span>{{ collection.name }}</span>
                  </v-tooltip>
                </v-list-item>
              </template>
            </v-list>
          </v-tab-item>
          <v-tab-item>
            <v-divider />
            <v-list shaped>
              <template v-for="instantiableDomain in instantiableDomains">
                <v-list-item
                  :key="instantiableDomain.id"
                  :input-value="domain !== null && domain.id === instantiableDomain.id"
                  color="blue-grey lighten-1"
                  @click="selectConcept(instantiableDomain, 'domain')"
                >
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-list-item-title style="cursor: pointer" v-on="on">
                        {{ instantiableDomain.name }}
                      </v-list-item-title>
                    </template>
                    <span>{{ instantiableDomain.name }}</span>
                  </v-tooltip>
                </v-list-item>
              </template>
            </v-list>
          </v-tab-item>
        </v-tabs>
      </template>
    </leftDrawer>
    <v-content>
      <appToolbar
        :title="system.name ? 'Content Creator - ' + system.name : 'Content Creator'"
        @toggleLeftDrawer="domainDrawer = !domainDrawer"
      />
      <v-container fluid>
        <v-row>
          <v-btn
            v-if="domain !== null || domainCollection !== null"
            color="accent"
            fab
            fixed
            outlined
            right
            style="margin-top: 64px"
            top
            @click="domain !== null ? openNewDomainInstanceDialog() : openNewDomainCollectionInstanceDialog()"
          >
            <v-icon v-if="!waitingForDataFetch" large>
              add
            </v-icon>
            <v-progress-circular v-else indeterminate color="accent" />
          </v-btn>
          <v-col
            v-for="instance in instanceList"
            :key="instance.id"
            cols="4"
          >
            <v-card raised height="100%" width="100%" @click="selectInstance(instance)">
              <v-card-title>{{ instance.name }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <!-------------------------------------------------------------- Dialogs -->
    <!-- New Domain Instance -->
    <fillOutDialog :toggle="newDomainInstanceDialog">
      <template v-slot:content>
        <instanceForm v-if="formData.length > 0" ref="newDomainInstanceForm" :data-set="formData" />
      </template>
      <template v-slot:buttons>
        <v-spacer />
        <saveCancelButtons
          cancel-button-text="Cancel"
          commit-button-text="Create"
          :disable-commit="$refs.newDomainForm && $refs.newDomainForm.valid"
          @cancel="closeNewDomainInstanceDialog()"
          @commit="createNewDomainInstance()"
        />
      </template>
    </fillOutDialog>

    <!-- New DomainCollection Instance -->
    <fillOutDialog :toggle="newDomainCollectionInstanceDialog">
      <template v-slot:content>
        <instanceForm v-if="formData.length > 0" ref="newDomainCollectionInstanceForm" :data-set="formData" :instance-type="'domainCollection'" />
      </template>
      <template v-slot:buttons>
        <v-spacer />
        <saveCancelButtons
          cancel-button-text="Cancel"
          commit-button-text="Create"
          :disable-commit="newInstanceValid"
          @cancel="closeNewDomainCollectionInstanceDialog()"
          @commit="createNewDomainCollectionInstance()"
        />
      </template>
    </fillOutDialog>
  </v-app>
</template>

<script>
import appToolbar from '~/components/app-toolbar.vue'
import fillOutDialog from '~/components/fill-out-dialog.vue'
import instanceForm from '~/components/instance-form/instance-form.vue'
import leftDrawer from '~/components/left-drawer.vue'
import saveCancelButtons from '~/components/save-cancel-buttons.vue'
import service from '~/plugins/feathers-service.js'
export default {
  components: {
    appToolbar,
    fillOutDialog,
    instanceForm,
    leftDrawer,
    saveCancelButtons
  },
  async fetch ({ store, params }) {
    service('systems')(store)
    service('domain-collections')(store)
    service('domain-collections-domains')(store)
    service('domain-collection-instances')(store)
    service('domains')(store)
    service('domain-dependencies')(store)
    service('domain-instances')(store)
    service('properties')(store)
    service('property-instances')(store)
    service('raw-values')(store)
    service('raw-value-instances')(store)
    if (store.state.system === null) {
      const system = await store.dispatch('systems/get', params.id)
      store.commit('selectSystem', system)
    }
    await store.dispatch('domain-collections/find', { query: { systemId: store.state.system.id }, $clear: true })
    await store.dispatch('domains/find', { query: { instantiable: true, systemId: store.state.system.id }, $clear: true })
  },
  data () {
    return {
      domainDrawer: true,
      formData: [],
      newDomainInstanceDialog: false,
      newDomainCollectionInstanceDialog: false,
      newInstanceValid: true,
      sorting: 'A-Z',
      sorts: [
        'A-Z',
        'Z-A'
      ],
      tab: 0,
      waitingForDataFetch: false
    }
  },
  computed: {
    system () {
      return this.$store.state.system
    },
    domain: {
      get () {
        return this.$store.state.domain
      },
      set (val) {
        this.$store.commit('selectDomain', val)
        const parentage = []
        if (val !== null) {
          while (val.parentDomainId !== null) {
            parentage.push(val.parentDomainId)
            val = this.$store.getters['domains/get'](val.parentDomainId)
          }
        }
        this.$store.commit('setDomainParentage', parentage)
      }
    },
    domainCollection: {
      get () {
        return this.$store.state.domainCollection
      },
      set (val) {
        this.$store.commit('selectDomainCollection', val)
      }
    },
    domainCollections () {
      return this.$store.getters['domain-collections/list']
    },
    instantiableDomains () {
      return this.$store.getters['domains/list'].filter(item => item.instantiable)
    },
    instanceList () {
      return this.tab === 0
        ? this.domainCollectionInstances
        : this.instantiableDomainInstances
    },
    domainCollectionInstances () {
      if (this.domainCollection === null) { return [] }
      const list = []
      return list
        .concat(this.$store.getters['domain-collection-instances/list']
          .filter(item => item.domainCollectionId === this.domainCollection.id)
        ).sort((a, b) => {
          return this.sortAlphabetically(a, b, this.sorting === 'A-Z' ? 'ascending' : 'descending')
        })
    },
    instantiableDomainInstances () {
      if (this.domain === null) { return [] }
      const list = []
      return list
        .concat(this.$store.getters['domain-instances/list']
          .filter(item => item.domainId === this.domain.id)
        ).sort((a, b) => {
          return this.sortAlphabetically(a, b, this.sorting === 'A-Z' ? 'ascending' : 'descending')
        }
        ).map((domainI) => {
          const obj = { ...domainI, name: '' }
          const nameProperty = this.$store.getters['property-instances/list'].find((item) => {
            return item.name === 'Name'
          })
          console.log(obj, nameProperty)
          if (nameProperty) {
            const value = this.$store.getters['raw-value-instances/get'](nameProperty.id, 'propertyInstanceId')
            obj.name = value.value
          }
          return obj
        })
    }
  },
  created () {
    service('systems')(this.$store)
    service('domain-collections')(this.$store)
    service('domain-collections-domains')(this.$store)
    service('domain-collection-instances')(this.$store)
    service('domains')(this.$store)
    service('domain-dependencies')(this.$store)
    service('domain-instances')(this.$store)
    service('properties')(this.$store)
    service('property-instances')(this.$store)
    service('raw-values')(this.$store)
    service('raw-value-instances')(this.$store)
  },
  methods: {
    closeNewDomainInstanceDialog () {
      this.newDomainInstanceDialog = false
    },
    async createNewDomainInstance () {
      const domainI = await this.$store.dispatch('domain-instances/create', {
        domainId: this.domain.id
      })
      this.formData.forEach(async (prop) => {
        const propI = await this.$store.dispatch('property-instances/create', {
          domainInstanceId: domainI.id,
          propertyId: prop.id
        })
        if (prop.editable) {
          this.$store.dispatch('raw-value-instances/create', {
            propertyInstanceId: propI.id,
            value: this.$refs.newDomainInstanceForm.$refs['property_' + prop.id].value
          })
        }
      })
      this.closeNewDomainInstanceDialog()
    },
    async openNewDomainInstanceDialog () {
      this.waitingForDataFetch = true
      this.formData.splice(0)
      const properties = this.$store.getters['properties/list']
      await this.$store.dispatch('raw-values/find', { query: {
        propertyId: properties
          .filter(item => item.referenceType === 'raw_value')
          .map(item => item.id)
      },
      $clear: true })
      properties.forEach((property) => {
        const data = {}
        data.id = property.id
        data.label = property.name
        data.dataType = property.dataType
        if (property.referenceType === 'raw_value') {
          data.editable = true
          data.default = this.$store.getters['raw-values/get'](property.id, 'propertyId').defaultValue
        }
        this.formData.push(data)
      })
      console.log('formData', this.formData)
      this.waitingForDataFetch = false
      this.newDomainInstanceDialog = true
    },
    async openNewDomainCollectionInstanceDialog () {
      this.waitingForDataFetch = true
      this.formData.splice(0)
      const domainIds = await this.$store.dispatch('domain-collections-domains/find', { query: {
        domainCollectionId: this.domainCollection.id
      },
      $clear: true })
      console.log(domainIds)
      const domains = await this.$store.dispatch('domains/find', { query: {
        id: domainIds.map(item => item.domainId)
      },
      $clear: true })
      const domainsIdMap = domains.map(domain => domain.id)
      await this.$store.dispatch('domain-dependencies/find', { query: { domainId: domainsIdMap } })
      const props = await this.$store.dispatch('properties/find', { query: {
        domainId: domainsIdMap
      },
      $clear: true })
      await this.$store.dispatch('raw-values/find', { query: {
        propertyId: props.map(item => item.id)
      },
      $clear: true })
      this.sortDomainsOfCollection(domains).forEach((domain) => {
        const obj = {}
        obj.id = domain.id
        obj.name = domain.name
        obj.props = []
        props.filter(item => item.domainId === domain.id).forEach((prop) => {
          const data = {}
          data.id = prop.id
          data.label = prop.name
          data.dataType = prop.dataType
          if (prop.referenceType === 'raw_value') {
            data.editable = true
            data.default = this.$store.getters['raw-values/get'](prop.id, 'propertyId').defaultValue
          }
          obj.props.push(data)
        })
        this.formData.push(obj)
      })
      console.log(this.formData)
      this.waitingForDataFetch = false
      this.newDomainCollectionInstanceDialog = true
    },
    async selectInstance (instance) {
      await console.log(instance)
    },
    async selectConcept (concept, type) {
      console.log(concept, type)
      if (type === 'domain') {
        this.domainCollection = null // Clear selected domainCollection
        // Get Instances of selected Domain
        const domainI = await this.$store.dispatch('domain-instances/find', { query: {
          domainId: concept.id, domainCollectionId: null
        } })
        // Get property instances for all the domain instances
        await this.$store.dispatch('properties/find', { query: { domainId: concept.id }, $clear: true })
        const properties = await this.$store.dispatch('property-instances/find', { query: {
          domainInstanceId: domainI.map(item => item.id)
        },
        $clear: true })
        // Get values of properties for all the domain instances
        const rawVals = await this.$store.dispatch('raw-value-instances/find', { query: {
          propertyInstanceId: properties.map(item => item.id)
        } })
        rawVals.forEach((rawValProp) => {
          const obj = {}
          obj.val = rawValProp.value
          obj.name = properties.find(item => item.id === rawValProp.propertyInstanceId)
          console.log(obj.name, obj.val)
        })
        this.domain = concept
      } else {
        this.domain = null
        const domainCollections = await this.$store.dispatch('domain-collection-instances/find', { query: {
          domainCollectionId: concept.id
        },
        $clear: true })
        await this.$store.dispatch('domain-instances/find', { query: {
          domainCollectionInstanceId: domainCollections.map(item => item.id)
        } })
        this.domainCollection = concept
      }
    },
    sortAlphabetically (a, b, mode) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return mode === 'ascending' ? -1 : 1 }
      if (a.name.toLowerCase() > b.name.toLowerCase()) { return mode === 'ascending' ? 1 : -1 }
      return 0
    },
    assignSortAlgorithm (a, b) {
      switch (this.sorting) {
        case 'A-Z': return this.sortAlphabetically(a, b, 'ascending')
        case 'Z-A': return this.sortAlphabetically(a, b, 'descending')
      }
    },
    // Sorts domains of domainCollection in order of dependencies, so a domain's dependencies should all have come before it.
    sortDomainsOfCollection (collectionDomains = []) {
      console.log('sortDomainOfCollection unordered', [...collectionDomains])
      const orderedList = []
      while (collectionDomains.length > 0) {
        const tempList = [ ...collectionDomains ]
        tempList.forEach((item, index) => {
          const itemDependencies = this.$store.getters['domain-dependencies/list'].filter(dep => dep.domainId === item.id)
          if (itemDependencies.every(dep => orderedList.some(domain => domain.id === dep.domainDependencyId))) {
            orderedList.push(...collectionDomains.splice(index, 1))
          }
        })
      }
      console.log('sortDomainOfCollection ordered', [...orderedList])
      return orderedList
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