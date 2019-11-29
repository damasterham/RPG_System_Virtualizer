<template>
  <v-app dark>
    <h1>System Designer</h1>

    <v-btn color="success" @click="onClick">
      {{ text }}!
    </v-btn>

    <v-list>
      <v-list-tile v-for="(item, index) in list" :key="index">
        {{ item.value }} | {{ item.id }}
      </v-list-tile>
    </v-list>
  </v-app>
</template>

<script>
import service from '~/plugins/feathers-service'

export default {
  data () {
    return {
      text: 'Woop'
    }
  },
  computed: {
    list () {
      return []
    }
  },
  created () {
    console.log('created started')
    service('test')(this.$store)
    console.log('created finished')
  },
  mounted () {
    console.log('mounted started')
    // client.service('test')(this.$store)
    console.log('mounted finished')
  },
  methods: {
    async onClick () {
      this.text += 'Create new test'
      console.log(await this.$store.dispatch('test/find', {
        query: {
          $limit: -1
        }
      }))
      // this.$store.dispatch('test/create', { value: 'new test' })
    }
  }
}
</script>

<style lang="stylus">

</style>
