<template>
  <v-app>
    <v-toolbar>
      <span class="headline">
        Select System
      </span>
    </v-toolbar>
    <v-container fill-height>
      <v-row>
        <v-col v-for="item in systems" :key="item.id" cols="3">
          <v-card raised height="100%" width="100%" @click="selectSystem(item)">
            <v-img v-if="item.addNew" height="200px" src="https://cdn.iview.abc.net.au/thumbs/1200/ck/CK1714V_59a4b949bbec1_1280.jpg" />
            <v-img v-else contain height="200px" :src="item.imagelink !== null ? item.imagelink : ''" />
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ item.shorthand }}</v-card-subtitle>
            <v-card-text>{{ item.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-------------------------------------------------------------- Create new System -->
    <FillOutDialog :toggle="createDialog" :height="'800px'" :width="'50%'">
      <template v-slot:toolbar>
        <v-toolbar>
          Creating New System
        </v-toolbar>
      </template>
      <template v-slot:content>
        <v-text-field v-model="newSystemName" label="Name" />
        <v-text-field v-model="newSystemShorthand" label="Shorthand" />
        <v-textarea v-model="newSystemDescription" label="Description" />
        <v-divider mb-2 />
        <v-text-field v-model="newSystemImage" label="Image Link" />
        <v-img :src="newSystemImage" contain height="200px" />
      </template>
      <template v-slot:buttons>
        <SaveCancelButtons
          :commit-button-text="'Create'"
          :disable-commit="newSystemName.length <= 0"
          @commit="create()"
          @cancel="emptyNewSystem()"
        />
      </template>
    </FillOutDialog>

    <!-------------------------------------------------------------- Inspect System -->
    <FillOutDialog :toggle="inspectDialog" :height="'800px'" :width="'50%'">
      <template v-slot:toolbar>
        <v-toolbar>
          <v-btn text color="Primary" @click="openSystemDesigner()">
            System Designer
          </v-btn>
          <v-btn text color="Primary">
            Layout Designer
          </v-btn>
          <v-btn text color="Primary">
            Element Creator
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:content>
        <v-text-field :value="systemName" label="Name" @change="systemName = $event" />
        <v-text-field :value="systemShorthand" label="Shorthand" @change="systemShorthand = $event" />
        <v-textarea :value="systemDescription" label="Description" @change="systemDescription = $event" />
        <v-divider mb-2 />
        <v-text-field :value="systemImage" label="Image Link" @change="systemImage = $event" />
        <v-img :src="systemImage" contain height="200px" />
      </template>
      <template v-slot:buttons>
        <v-btn color="Primary" outlined @click="inspectDialog = false">
          Cancel
        </v-btn>
      </template>
    </FillOutDialog>
  </v-app>
</template>

<script>
import SaveCancelButtons from '~/components/save-cancel-buttons.vue'
import FillOutDialog from '~/components/fill-out-dialog.vue'

import service from '~/plugins/feathers-service.js'
export default {
  components: {
    SaveCancelButtons,
    FillOutDialog
  },
  async fetch ({ store, params }) {
    service('systems')(store)
    await store.dispatch('systems/find', { query: { id: { $gte: 0 } }, $clear: true })
  },
  data () {
    return {
      createDialog: false,
      inspectDialog: false,

      newSystemName: '',
      newSystemShorthand: '',
      newSystemImage: '',
      newSystemDescription: '',
      system: {}
    }
  },
  computed: {
    systemName: {
      get () {
        return this.system.name
      },
      set (value) {
        this.system.name = value
        this.$store.dispatch('systems/patch', [this.system.id, { name: value }])
      }
    },
    systemShorthand: {
      get () {
        return this.system.shorthand
      },
      set (value) {
        this.system.shorthand = value
        this.$store.dispatch('systems/patch', [this.system.id, { shorthand: value }])
      }
    },
    systemImage: {
      get () {
        return this.system.imagelink || ''
      },
      set (value) {
        this.system.imagelink = value
        this.$store.dispatch('systems/patch', [this.system.id, { imagelink: value }])
      }
    },
    systemDescription: {
      get () {
        return this.system.description
      },
      set (value) {
        this.system.description = value
        this.$store.dispatch('systems/patch', [this.system.id, { description: value }])
      }
    },
    systems () {
      console.log(this.$store.getters['systems/list'])
      const listOfSystems = [ ...this.$store.getters['systems/list'] ]
      listOfSystems.push({
        addNew: true,
        name: 'Create New System',
        shorthand: '',
        imagelink: ''
      })
      return listOfSystems
    }
  },
  created () {
    service('systems')(this.$store)
  },
  methods: {
    selectSystem (system) {
      if (system.addNew) {
        this.createDialog = true
      } else {
        this.system = { ...system }
        this.inspectDialog = true
      }
    },
    openSystemDesigner () {
      this.$store.commit('selectSystem', this.system)
      this.$router.push({ name: 'system-id-systemDesigner', params: { id: this.system.id } })
    },
    create () {
      this.$store.dispatch('systems/create', {
        name: this.newSystemName,
        shorthand: this.newSystemShorthand,
        imagelink: this.newSystemImage,
        description: this.newSystemDescription
      })
      this.emptyNewSystem()
    },
    emptyNewSystem () {
      this.createDialog = false
      this.newSystemName = ''
      this.newSystemShorthand = ''
      this.newSystemDescription = ''
      this.newSystemImage = ''
    }
  }
}
</script>

<style lang="stylus">

</style>