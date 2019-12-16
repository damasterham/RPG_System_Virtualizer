<template>
  <div>
    <v-list-item>
      <v-list-item-title class="subtitle-1">
        {{ title }}
      </v-list-item-title>
      <v-spacer />
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="$emit('clicked')">
            <v-icon>{{ icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ tooltipText }}</span>
      </v-tooltip>
      <slot name="moreButtons" />
    </v-list-item>
    <v-divider v-if="condition" />
  </div>
</template>

<script>
export default {
  props: {
    condition: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: 'info'
    },
    title: {
      type: String,
      default: 'List Item Title'
    },
    tooltipText: {
      type: String,
      default: 'Tooltip Text'
    }
  }
}
</script>

<style lang="stylus">

</style>