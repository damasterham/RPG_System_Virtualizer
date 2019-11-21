<template>
<v-app dark>
    <h1>System Designer</h1>

    <v-btn color="success" @click="onClick" >{{text}}!</v-btn>
</v-app>
</template>

<script>
export default {
  data () {
    return {
      text: 'Woop'
    }
  },
  methods: {
    onClick ()
    {
      this.text += 'Woop'
    }
  }
}
</script>

<style lang="stylus">

</style>
