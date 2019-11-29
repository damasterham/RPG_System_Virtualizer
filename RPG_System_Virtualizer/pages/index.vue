<template>
  <v-app dark>
    <h1>System Designer</h1>

    <v-btn color="success" @click="onClick">
{{ text }}!
</v-btn>

    <v-list>
      <v-list-tile v-for="(item, index) in tests" avatar :key="index">
        {{ item.value }} | {{ item.id }}
      </v-list-tile>
    </v-list>
  </v-app>
</template>

<script>
// import G from '~/plugins/globalvariables'
import { mapGetters } from 'vuex'
import client from '~/plugins/feathers-client'

const test = 'test' // G.services.test;

export default {
  data () {
    return {
      text: 'Woop'
    }
  },
  computed: {
    ...mapGetters(test, {
      tests: 'list'
    })
  },
  created () {
    // console.log(client)
    client.service(test) // (this.$store)
  },
  methods: {
    onClick () {
      this.text += 'Create new test'
      this.$store.dispatch(test + '/create', { value: 'new test' })
    }
  }
}
</script>

<style lang="stylus">

</style>
