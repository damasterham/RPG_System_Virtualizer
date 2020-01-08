<template>
  <div>
    <v-row no-gutters>
      <v-col cols="5" style="margin-right: 4px">
        <v-text-field :value="variableName" label="Name" @change="variableName = $event" />
      </v-col>
      <v-col style="margin-left: 4px">
        <v-autocomplete :value="variableReference" label="Reference" @change="variableReference = $event" />
      </v-col>
      <v-col cols="1">
        <v-btn icon>
          <v-icon>delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    variable: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    variableName: {
      get () {
        return this.variable.name
      },
      async set (val) {

      }
    },
    variableReference: {
      get () {
        return null
      },
      async set (val) {

      }
    }
  }
}
</script>

<style>

</style>