<template>
  <v-row no-gutters>
    <v-col cols="4" style="margin-right: 4px">
      <v-text-field
        :value="variableName"
        label="Name"
        @change="variableName = $event"
      />
    </v-col>
    <v-col style="margin-left: 4px">
      <v-autocomplete
        :value="variableReference"
        label="Reference"
        :items="references"
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
    <v-col v-if="deletable" cols="1">
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