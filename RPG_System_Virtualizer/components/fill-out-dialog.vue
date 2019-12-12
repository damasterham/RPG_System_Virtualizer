<template>
  <v-dialog :value="toggle" :height="height" :width="width" persistent>
    <v-card height="100%">
      <slot name="toolbar" />
      <v-container style="padding-right: 25px; padding-left: 25px">
        <v-row>
          <v-col cols="12">
            <slot name="content" />
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-col cols="auto">
            <slot name="buttons" />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    toggle: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '800px'
    },
    width: {
      type: String,
      default: '50%'
    }
  }
}
</script>

<style lang="stylus">

</style>