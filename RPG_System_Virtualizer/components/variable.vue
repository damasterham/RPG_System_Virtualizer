<template>
  <v-row no-gutters>
    <v-col cols="4" style="margin-right: 4px">
      <v-text-field
        :value="variableName"
        :readonly="readonly"
        label="Name"
        @change="variableName = $event"
      />
    </v-col>
    <v-col style="margin-left: 4px">
      <v-autocomplete
        :value="variableReference"
        :readonly="readonly"
        :items="references"
        label="Reference"
        item-text="name"
        return-object
        @change="variableReference = $event"
      >
        <template v-slot:item="varRef">
          <v-row>
            <v-col>
              <v-row>
                <v-chip outlined text-color="blue-grey lighten-2">
                  {{ varRef.item.type }}
                </v-chip>
                &nbsp;
                <span class="mt-1">{{ varRef.item.name }}</span>
              </v-row>
              <v-divider inset />
            </v-col>
          </v-row>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col v-if="deletable && !readonly" cols="1">
      <v-btn icon class="mt-3" @click="deleteVariable">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import client from '~/plugins/feathers-client.js'
const variableClient = client.service('variables')

export default {
  props: {
    variable: {
      type: Object,
      default: () => { return {} }
    },
    func: {
      type: Object,
      default: () => {}
    },
    domain: {
      type: Object,
      default: () => {}
    },
    specific: {
      type: Boolean,
      default: false
    },
    specificValue: {
      type: Object,
      default: () => {}
    },
    references: {
      type: Array,
      default: () => []
    },
    deletable: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    variableName: {
      get () {
        return this.variable.name
      },
      async set (val) {
        await this.$store.dispatch('variables/patch', [this.variable.id, { name: val }])
      }
    },
    variableReference: {
      get () {
        if (!this.specific) {
          if (this.variable.referenceType && this.variable.referenceType !== null) {
            let referenceNamespace = ''
            let objectNamespace = ''
            switch (this.variable.referenceType) {
              case 'function': referenceNamespace = 'variables-functions'; objectNamespace = 'functions'; break
              case 'domain': referenceNamespace = 'variables-domains'; objectNamespace = 'domains'; break
              case 'property': referenceNamespace = 'variables-properties'; objectNamespace = 'properties'; break
              default: break
            }
            let reference = this.$store.getters[referenceNamespace + '/get'](this.variable.id, 'variableId')
            if (reference && reference !== null) {
              reference = this.$store.getters[objectNamespace + '/get'](reference[this.variable.referenceType + 'Id'])
              if (reference && reference !== null) {
                const res = { name: reference.name, id: reference.id }
                res.type = this.variable.referenceType.charAt(0).toUpperCase() + this.variable.referenceType.substring(1)
                if (res.type !== 'Domain') { res.domainId = reference.domainId } else { res.name = res.name.toUpperCase() }
                if (res.domainId && res.domainId !== this.domain.id) {
                  res.name = this.$store.getters['domains/get'](res.domainId).name.toUpperCase() + '.' + res.name
                }
                console.log('variable variableReference get', res)
                return res
              }
            }
          }
        } else if (this.specificValue) {
          const property = this.$store.getters['properties/get'](this.specificValue.propertyReferenceId)
          const domain = this.$store.getters['domains/get'](property.domainId)
          return {
            name: domain.name.toUpperCase() + '.' + property.name,
            type: 'Property',
            id: property.id,
            domainId: domain.id
          }
        }
        return null
      },
      set (val) {
        if (this.specific) {
          this.patchSpecificVariableReference(val)
        } else { this.patchVariableReference(val) }
      }
    }
  },
  async mounted () {
    console.log('Variable mounted()', this.variable)
    if (this.variable.referenceType && this.variable.referenceType !== null) {
      switch (this.variable.referenceType) {
        case 'function': await this.$store.dispatch('variables-functions/find', { query: { variableId: this.variable.id } }); break
        case 'domain': await this.$store.dispatch('variables-domains/find', { query: { variableId: this.variable.id } }); break
        case 'property': await this.$store.dispatch('variables-properties/find', { query: { variableId: this.variable.id } }); break
        default: break
      }
    }
  },
  methods: {
    deleteVariable () {
      const refType = this.variable.referenceType
      if (refType !== null) {
        let namespace = ''
        switch (this.variable.referenceType) {
          case 'function': namespace = 'variables-functions'; break
          case 'domain': namespace = 'variables-domains'; break
          case 'property': namespace = 'variables-properties'; break
          default: break
        }
        this.$store.dispatch(namespace + '/remove', [null, { query: { variableId: this.variable.id } }])
      }
      this.$store.dispatch('variables/remove', this.variable.id)
    },
    patchVariableReference (val) {
      variableClient.patch(this.variable.id, { referenceType: val.type.toLowerCase() }, { query: { data: { referenceId: val.id } } }).then((res) => {
        console.log('patchVariableReference', { ...res }, { ...val })
        console.log(this.variable)
        switch (this.variable.referenceType) { // Remove existing reference from local store
          case 'function': this.$store.commit('variables-functions/removeItem', { id: this.variable.id, key: 'variableId' }); break
          case 'domain': this.$store.commit('variables-domains/removeItem', { id: this.variable.id, key: 'variableId' }); break
          case 'property': this.$store.commit('variables-properties/removeItem', { id: this.variable.id, key: 'variableId' }); break
          default: break
        }
        if (this.variable.referenceType !== res.referenceType) {
          switch (res.referenceType) { // Create new reference in local store, using res.reference
            case 'function': this.$store.commit('variables-functions/addItem', res.reference); break
            case 'domain': this.$store.commit('variables-domains/addItem', res.reference); break
            case 'property': this.$store.commit('variables-properties/addItem', res.reference); break
            default: break
          }
        }
        delete res.reference // delete reference & update variable
        this.$store.commit('variables/updateItem', res)
      })
    },
    patchSpecificVariableReference (val) {
      console.log('patchSpecificVariableReference val', val)
      this.$emit('updateSpecific', val)
    }
  }
}
</script>

<style>

</style>