<template>
  <div>
    <v-dialog v-model="helpDialog" width="40vw">
      <v-card>
        <v-card-title>
          Equation Help
          <v-spacer />
          <v-btn icon @click="toggleHelp">
            <v-icon large>
              close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          The Equations tool support the following mathematical operators: <br>
          <ul>
            <li>{{ addition }} </li>
            <li>{{ subtraction }} </li>
            <li>{{ multiplication }} </li>
            <li>{{ division }} </li>
            <li>{{ grouping }} </li>
          </ul>
          Use the slider below the 'Definition' field to assign when to round up or down.<br>
          Set it to 0 to always round down, and 1 to always round up.
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row no-gutters>
      <v-col cols="11">
        <v-textarea
          :value="equation"
          label="Definition"
          outlined
          no-resize
          @change="equation = $event"
        />
      </v-col>
      <v-col align-self="center" style="margin-left: 15px">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="toggleHelp" v-on="on">
              <v-icon>
                help
              </v-icon>
            </v-btn>
          </template>
          <span>
            Open Help Dialog
          </span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="createNewVariable()" v-on="on">
              <v-icon>
                add
              </v-icon>
            </v-btn>
          </template>
          <span>
            Create new variable
          </span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row v-if="func.dataType === 'int'" no-gutters>
      <v-slider
        v-model="rounding"
        :label="parseFloat(rounding).toFixed(2)"
        min="0"
        max="1"
        step="0.05"
      />
    </v-row>
    <v-divider inset style="margin-right: 72px; margin-bottom: 10px" />
    <variableList
      :domain="domain"
      :func="func"
      :variables="variables"
      :add-variable="addVariable"
    />
  </div>
</template>

<script>
import variableList from '~/components/function-settings/variable-list.vue'
import service from '~/plugins/feathers-service.js'

export default {
  components: {
    variableList
  },
  props: {
    domain: {
      type: Object,
      default: () => {}
    },
    func: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      addVariable: false,
      // Help
      helpDialog: false,
      addition: 'Addition:         +',
      subtraction: 'Subtraction:      -',
      multiplication: 'Multiplication:   *',
      division: 'Division:         /',
      grouping: 'Grouping:         ( )'
    }
  },
  computed: {
    rounding: {
      get () {
        const rounding = this.$store.getters['equation-rounder/get'](this.func.id, 'functionId')
        if (rounding && typeof rounding.value === 'number') { return rounding.value }
        return 0.5
      },
      async set (value) {
        await this.$store.dispatch('equation-rounder/patch', [this.func.id, { value }])
      }
    },
    equation: {
      get () {
        return this.func.definition
      },
      async set (val) {
        await this.$store.dispatch('functions/patch', [this.func.id, { definition: val }])
      }
    },
    variables () {
      return this.$store.getters['variables/list'].filter(item => item.functionId === this.func.id)
    }
  },
  created () {
    service('equation-rounder')(this.$store)
    service('variables')(this.$store)
  },
  async mounted () {
    await this.$store.dispatch('variables/find', { query: { functionId: this.func.id }, $clear: true })
    const res = await this.$store.dispatch('equation-rounder/find', { query: { functionId: this.func.id }, $clear: true })
    if (res.length === 0) { await this.$store.dispatch('equation-rounder/create', { functionId: this.func.id, value: 0.5 }) }
  },
  methods: {
    toggleHelp () {
      this.helpDialog = !this.helpDialog
    },
    createNewVariable () {
      this.$store.dispatch('variables/create', { name: '', functionId: this.func.id, dataType: this.func.dataType })
    }
  }
}
</script>

<style>

</style>