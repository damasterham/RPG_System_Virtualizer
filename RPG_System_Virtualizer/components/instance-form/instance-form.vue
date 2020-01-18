<template>
  <!-- Domain Instance -->
  <div v-if="instanceType === 'domain'" style="border: 2px solid #546E7A; border-radius: 10px; padding-left: 10px; padding-right: 10px">
    <p class="title mb-2 mt-2">
      New {{ this.$store.state.domain.name }} Instance
    </p>
    <v-divider />
    <v-form>
      <template v-for="prop in dataset">
        <components :is="prop.component" :key="prop.id" :ref="'property_' + prop.id" :data="prop" />
      </template>
    </v-form>
  </div>
  <!-- Domain Collection instance -->
  <v-stepper v-else v-model="currentStep" alt-labels>
    <v-stepper-header>
      <template v-for="(step, index) in dataset">
        <v-stepper-step
          :key="'header-' + step.id"
          :step="index + 1"
          :complete="currentStep > index"
        >
          {{ step.name }}
        </v-stepper-step>
        <v-divider v-if="index < dataset.length - 1" :key="'divider-' + step.id" />
      </template>
    </v-stepper-header>
    <v-stepper-items>
      <template v-for="(step, index) in dataset">
        <v-stepper-content :key="step.id" :step="index + 1">
          <v-row no-gutters>
            <v-col cols="1" align-self="center">
              <v-btn :disabled="currentStep === 1" icon @click="changeScreen(-1)">
                <v-icon large>
                  keyboard_arrow_left
                </v-icon>
              </v-btn>
            </v-col>
            <v-col class="pr-2">
              <div style="border: 2px solid #546E7A; border-radius: 10px; padding-left: 10px; padding-right: 10px">
                <v-form>
                  <template v-for="(prop, propIndex) in step.props">
                    <components :is="prop.component" :key="prop.id" :ref="'property_' + prop.id" :data="prop" @change="validityUpdate($event, propIndex)" />
                  </template>
                </v-form>
              </div>
            </v-col>
            <v-col cols="1" align-self="center">
              <v-btn :disabled="!currentStepValid || currentStep === dataset.length" icon @click="changeScreen(+1)">
                <v-icon large>
                  keyboard_arrow_right
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
      </template>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import boolean from '~/components/instance-form/boolean.vue'
import decimal from '~/components/instance-form/decimal.vue'
import number from '~/components/instance-form/number.vue'
import string from '~/components/instance-form/string.vue'

export default {
  components: {
    boolean,
    decimal,
    number,
    string
  },
  props: {
    dataSet: {
      type: Array,
      default: () => []
    },
    instanceType: {
      type: String,
      default: () => 'domain'
    }
  },
  data () {
    return {
      currentStep: 1,
      mounted: false,
      validity: []
    }
  },
  computed: {
    valid () {
      Object.keys(this.$refs).forEach((key) => {
        if (!this.$refs[key].valid) { return false }
      })
      return true
    },
    currentStepValid () {
      return this.validity.every((item) => {
        return item
      })
    },
    dataset () {
      // modify Dataset to include things such as rules, etc.
      const data = [...this.dataSet]
      if (this.instanceType === 'domain') {
        data.forEach((item) => {
          switch (item.dataType) {
            case 'string': item.component = string; break
            case 'int': item.component = number; break
            case 'float': item.component = decimal; break
            case 'boolean': item.component = boolean; break
            default: break
          }
          item.rules = []
          item.rules.push(this.isNotUndefined)
          item.rules.push(this.isNotNull)
        })
        return data.sort((a, b) => { return a.name === 'Name' ? -1 : b.name === 'Name' ? 1 : 0 })
      } else if (this.instanceType === 'domainCollection') {
        data.forEach((domain) => {
          domain.props.forEach((item) => {
            switch (item.dataType) {
              case 'string': item.component = string; break
              case 'int': item.component = number; break
              case 'float': item.component = decimal; break
              case 'boolean': item.component = boolean; break
              default: break
            }
            item.rules = []
            item.rules.push(this.isNotUndefined)
            item.rules.push(this.isNotNull)
          })
          domain.props.sort((a, b) => { return a.name === 'Name' ? -1 : b.name === 'Name' ? 1 : 0 })
        })
      }
      return data
    }
  },
  mounted () {
    console.log(this.dataset)
    this.dataset[this.currentStep - 1].props.forEach(item => this.validity.push(item.default !== undefined && item.default !== null))
    this.mounted = true
  },
  methods: {
    validityUpdate (e, index) {
      this.validity.splice(index, 1, e)
    },
    changeScreen (mod) {
      console.log(this.currentStep, mod, this.currentStep + mod)
      this.validity.splice(0)
      this.dataset[this.currentStep - 1 + mod].props.forEach((item, index) => {
        if (this.$refs['property_' + item.id] && this.$refs['property_' + item.id][0].value) {
          this.validity.push(item.rules.every(rule => rule(this.$refs['property_' + item.id][0].value) === true))
        } else { this.validity.push(item.default !== undefined && item.default !== null) }
      })
      this.currentStep += mod
      console.log(this.validity)
    },
    isNotUndefined (v) {
      return !!v || 'Must not be empty!'
    },
    isNotNull (v) {
      return v !== null || 'Must not be empty'
    }
  }
}
</script>

<style>

</style>