<template>
  <div>
    <v-dialog v-model="helpDialog" width="30vw">
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
            <li>{{ roundUp }} </li>
            <li>{{ roundDown }} </li>
            <li>{{ grouping }} </li>
          </ul>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row no-gutters>
      <v-col cols="11">
        <v-textarea
          :value="equation"
          :hint="symbolHelp"
          label="Definition"
          outlined
          no-resize
          @change="equation = $event"
        />
      </v-col>
      <v-col style="margin-left: 15px">
        <v-btn icon @click="toggleHelp">
          <v-icon>
            help
          </v-icon>
        </v-btn>
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
  </div>
</template>

<script>
import service from '~/plugins/feathers-service.js'

export default {
  props: {
    func: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

      // Help
      helpDialog: false,
      addition: 'addition: +',
      subtraction: 'subtraction: -',
      multiplication: 'multiplication: *',
      division: 'division: /',
      roundUp: 'rounding up: [',
      roundDown: 'rounding down: ]',
      grouping: 'grouping: ( )'
    }
  },
  computed: {
    rounding: {
      get () {
        const round = this.$store.getters['equation-rounder/get'](this.func.id)
        if (round) { return round }
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
    }
  },
  created () {
    service('equation-rounder')(this.$store)
  },
  mounted () {
    this.$store.dispatch('equation-rounder/find', { query: { functionId: this.func.id }, $clear: true })
  },
  methods: {
    toggleHelp () {
      this.helpDialog = !this.helpDialog
    }
  }
}
</script>

<style>

</style>