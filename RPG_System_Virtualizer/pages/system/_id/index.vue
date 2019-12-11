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
            <v-img v-if="!item.addNew" v-show="item.imagelink.length > 0" height="200px" :src="item.imagelink" />
            <v-img v-else height="200px" src="https://cdn.iview.abc.net.au/thumbs/1200/ck/CK1714V_59a4b949bbec1_1280.jpg" />
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>{{ item.shorthand }}</v-card-subtitle>
            <v-card-text>{{ item.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-------------------------------------------------------------- Create new System -->
    <v-dialog v-model="createDialog" height="800px" width="50%">
      <v-card height="100%">
        <v-container fill-height style="padding-right: 25px; padding-left: 25px">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field v-model="newSystemName" label="Name" />
              <v-text-field v-model="newSystemShorthand" label="Shorthand" />
              <v-textarea v-model="newSystemDescription" label="Description" />
              <v-text-field v-model="newSystemImage" label="Image Link" />
              <v-img v-show="newSystemImage.length > 0" height="200px" :src="newSystemImage" />
            </v-flex>
            <v-spacer />
            <v-flex xs12>
              <SaveCancelButtons
                :commit-button-text="'Create'"
                :disable-commit="newSystemName.length <= 0"
                @commit="create()"
                @cancel="toggleCreateDialog()"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>

    <!-------------------------------------------------------------- Inspect System -->
    <v-dialog v-model="inspectDialog">
      <v-card height="100%">
        <v-container fill-height style="padding-right: 25px; padding-left: 25px">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field :value="systemName" label="Name" @change="systemName = $event" />
              <v-text-field :value="systemShorthand" label="Shorthand" @change="systemShorthand = $event" />
              <v-text-field :value="systemImage" label="Image Link" @change="systemImage = $event" />
              <v-textarea :value="systemDescription" label="Description" @change="systemDescription = $event" />
            </v-flex>
            <v-spacer />
            <v-flex xs12>
              <!-- Buttons to access the different components of the system (System Designer, Layout Designer, Element Creator, System Utilizer) -->
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import SaveCancelButtons from '~/components/save-cancel-buttons.vue'

import service from '~/plugins/feathers-service.js'
export default {
  components: {
    SaveCancelButtons
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
        return this.system.imagelink
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
      const listOfSystems = [ ...this.$store.getters['systems/list'] ]
      listOfSystems.push({
        addNew: true,
        name: 'Create New System',
        shorthand: ''
      })
      return listOfSystems
    }
  },
  created () {
    service('systems')(this.$store)
  },
  mounted () {
    this.$store.commit('systems/clear')
    this.$store.dispatch('systems/find', { query: { id: { $gte: 0 } } })
    console.log(this.$store)
  },
  methods: {
    selectSystem (system) {
      if (system.addNew) {
        this.toggleCreateDialog()
      } else {
        console.log('system selected:', system)
        this.system = { ...system }
        this.inspectDialog = true
      }
    },
    toggleCreateDialog () {
      this.createDialog = !this.createDialog
    },
    create () {
      this.$store.dispatch('systems/create', {
        name: this.newSystemName,
        shorthand: this.newSystemShorthand,
        imagelink: this.newSystemImage,
        description: this.newSystemDescription
      })
      this.toggleCreateDialog()
      this.newSystemName = ''
      this.newSystemShorthand = ''
      this.newSystemDescription = ''
      this.newSystemImage = ''
    },
    logIt (x) {
      console.log(x)
    }
  }
}
</script>

<style lang="stylus">

</style>