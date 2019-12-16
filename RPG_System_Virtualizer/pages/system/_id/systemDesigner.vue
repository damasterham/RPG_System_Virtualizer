<template>
  <v-app>
    <v-navigation-drawer v-model="domainDrawer" app>
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
          <v-list-item :key="item.id" @click="selectDomain(item)">
            <v-tooltip v-if="domainNameEdit !== item.id" right>
              <template v-slot:activator="{ on }">
                <v-list-item-title v-on="on">
                  {{ item.name }}
                </v-list-item-title>
              </template>
              <span>{{ item.name }}</span>
            </v-tooltip>
            <v-text-field
              v-else
              ref="domainNameEditField"
              autofocus
              :value="domainNameEditValue"
              label="Domain Name"
              @change="domainNameEditValue = $event"
              @blur="domainNameEdit = 0"
            />
            <v-spacer />
            <v-btn icon @click="editDomainName(item.id)">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn icon @click="deleteDomain(item)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-item>
          <v-divider :key="'divider' + item.id" />
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-app-bar>
        <v-app-bar-nav-icon clipped-left @click="domainDrawer = !domainDrawer">
          <v-icon>menu</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>System Designer{{ system.name ? ' - ' : '' }}{{ system.name }}</v-toolbar-title>
      </v-app-bar>
      <v-container fluid fill-height>
        <v-row dense style="height: 100%">
          <v-col id="Domain Overview" cols="3">
            <domainOverview
              :domain="domain"
              @newProperty="newProperty()"
              @newFunction="newFunction($event)"
            />
            <!-- Overview of properties and functions in the domain, add new / rename / delete properties/functions functionality -->
          </v-col>
          <v-divider vertical />
          <v-col id="Domain Family Settings" cols="3">
            <domainInheritance :domain="domain" />
            <!-- Add domain parent and dependencies, as well as overview and removal of dependencies -->
          </v-col>
          <v-divider vertical />
          <v-col id="Property/Function Settings" cols="6">
            <v-row>
              <v-col id="Property Settings">
                <propertySettings :domain="domain" />
                <!-- Property overview & settings -->
              </v-col>
            </v-row>
            <v-row>
              <v-col id="Function Settings">
                <functionSettings :domain="domain" />
                <!-- function overview & settings -->
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <!-- New property Dialog -->
      <fillOutDialog :toggle="newPropDialog">
        <template v-slot:content>
          <v-text-field v-model="newPropName" />
        </template>
      </fillOutDialog>
      <!-- New Function Dialog -->
      <fillOutDialog :toggle="newFuncDialog">
        <template v-slot:content>
          <v-text-field readonly :value="newFuncType | capitalizeFirstLetter" />
          <v-text-field v-model="newFuncName" />
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

import service from '~/plugins/feathers-service.js'

export default {
  components: {
    domainInheritance,
    domainOverview,
    propertySettings,
    functionSettings,
    fillOutDialog
  },
  filters: {
    capitalizeFirstLetter (val) {
      return val.charAt(0).toUpperCase() + val.substring(1)
    }
  },
  data () {
    return {
      domainDrawer: false,
      domainNameEdit: 0,

      // New property
      newPropDialog: false,
      newProp: {},
      newPropName: '',

      // New Function
      newFuncDialog: false,
      newFunc: {},
      newFuncName: '',
      newFuncType: ''
    }
  },
  computed: {
    system () {
      const system = this.$store.getters.getSystem()
      if (system !== null) { return system }
      return {}
    },
    domains () {
      const domains = [...this.$store.getters['domains/list']]
      domains.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        } else { return 0 }
      })
      return domains
    },
    domain () {
      return this.$store.getters.domain
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
    if (!this.$store.state.system) { service('systems')(this.$store) }
    service('domains')(this.$store)
    service('properties')(this.$store)
    service('functions')(this.$store)
  },
  async mounted () {
    const system = await this.$store.dispatch('systems/get', this.$route.params.id)
    this.$store.commit('selectSystem', system)
    await this.$store.dispatch('domains/find', { query: {
      systemId: this.system.id
    } })
  },
  methods: {
    async newDomain () {
      const res = await this.$store.dispatch('domains/create', {
        name: 'Domain ' + this.domains.length,
        systemId: this.system.id
      })
      this.$nextTick(() => this.editDomainName(res.id))
    },
    editDomainName (domainId) {
      this.domainNameEdit = domainId
    },
    selectDomain (domain) {
      this.$store.commit('selectDomain', domain)
    },
    deleteDomain (domain) {
      this.$store.dispatch('domains/remove', domain.id)
    },
    newProperty () {
      this.newPropDialog = true
    },
    newFunction (ev) {
      this.newFuncDialog = true
      this.newFuncType = ev.type
    }
  }
}
</script>

<style lang="stylus">

</style>