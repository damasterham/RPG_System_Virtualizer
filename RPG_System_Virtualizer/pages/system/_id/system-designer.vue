<template>
  <v-app>
    <v-navigation-drawer v-model="domainDrawer" app>
      <v-list>
        <!-- List of all domains, add new / rename / delete domain functionality -->
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-app-bar>
        <v-app-bar-nav-icon clipped-left @click="domainDrawer = !domainDrawer">
          <v-icon>menu</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>System Designer</v-toolbar-title>
      </v-app-bar>
      <v-container fill-height>
        <v-row>
          <v-col id="Domain Overview" cols="3">
            <!-- Overview of properties and functions in the domain, add new / rename / delete properties/functions functionality -->
          </v-col>
          <v-divider vertical />
          <v-col id="Domain Family Settings" cols="3">
            <!-- Add domain parent and dependencies, as well as overview and removal of dependencies -->
          </v-col>
          <v-divider vertical />
          <v-col id="Property/Function Settings" cols="6">
            <v-row>
              <v-col id="Property Settings">
                <!-- Property overview & settings -->
              </v-col>
            </v-row>
            <v-row>
              <v-col id="Function Settings">
                <!-- function overview & settings -->
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      domainDrawer: false
    }
  }
}
</script>

<style lang="stylus">

</style>