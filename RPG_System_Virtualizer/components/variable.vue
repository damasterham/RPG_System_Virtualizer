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
              return res
            }
          }
        }
        return null
      },
      set (val) {
        variableClient.patch(this.variable.id, { referenceType: val.type.toLowerCase() }, { query: { data: { referenceId: val.id } } }).then((res) => {
          console.log('variableReference set res', res)
          // Remove existing reference from local store
          let namespace = ''
          switch (this.variable.referenceType) {
            case 'function': namespace = 'variables-functions'; break
            case 'domain': namespace = 'variables-domains'; break
            case 'property': namespace = 'variables-properties'; break
            default: break
          }
          this.$store.commit(namespace + '/removeItem', this.variable.id)
          // Create new reference in local store, using res.reference
          switch (res.referenceType) {
            case 'function': namespace = 'variables-functions'; break
            case 'domain': namespace = 'variables-domains'; break
            case 'property': namespace = 'variables-properties'; break
            default: break
          }
          this.$store.commit(namespace + '/addItem', res.reference)
          // delete reference & update variable
          delete res.reference
          this.$store.commit('variables/updateItem', res)
        })
      }
    }
  },
  async mounted () {
    if (this.variable.referenceType && this.variable.referenceType !== null) {
      let namespace = ''
      switch (this.variable.referenceType) {
        case 'function': namespace = 'variables-functions'; break
        case 'domain': namespace = 'variables-domains'; break
        case 'property': namespace = 'variables-properties'; break
        default: break
      }
      await this.$store.dispatch(namespace + '/find', { query: { variableId: this.variable.id } })
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
    }
  }
}
</script>

<style>

</style>