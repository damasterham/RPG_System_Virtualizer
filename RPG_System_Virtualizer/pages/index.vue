<template>
  <v-app>
    <v-container>
      <v-row justify="center">
        <v-col cols="auto">
          <v-img src="https://img.favpng.com/14/4/16/dungeons-dragons-d20-system-dice-role-playing-game-dungeon-crawl-png-favpng-L1SH9ytuGpsM5tc579x0Hx1sv.jpg" />
          <p class="display-1 text-center">
            RPG System Virtualizer
          </p>
          <p class="title text-center font-italic">
            Virtualize YOUR fantasy
          </p>
          <v-btn block outlined nuxt to="/system">
            Get Started!
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <v-row justify="start">
        <v-col cols="2">
          <v-img height="250px" width="400px" contain src="https://image.freepik.com/free-photo/3d-brain-with-lightening_1048-11388.jpg" />
        </v-col>
        <v-col cols="10" align-self="center">
          <p class="headline">
            Design Your System
          </p>
          <p>
            Define Domains, properties and functions, and designate how they interact.
          </p>
        </v-col>
      </v-row>
      <v-divider />
      <v-row justify="end">
        <v-col cols="auto" align-self="center">
          <p class="headline">
            Layout Your Pages
          </p>
          <p>
            Design the layout of your objects, creatures and characters, for filling them out and using them in play.
          </p>
        </v-col>
        <v-col cols="2">
          <v-img height="250px" width="400px" contain src="https://www.oldschooladventures.org/whitebox/more/character_sheets/pdf/whiteBoxCharacterSheet.png" />
        </v-col>
      </v-row>
      <v-divider />
      <v-row justify="start">
        <v-col cols="2">
          <v-img height="250px" width="400px" contain src="https://image.freepik.com/free-photo/old-blacksmiths-workshop_109710-5209.jpg" />
        </v-col>
        <v-col cols="10" align-self="center">
          <p class="headline">
            Craft Your Elements
          </p>
          <p>
            Instantiate your domains, to create specific instances of creatures, characters and objects.
          </p>
        </v-col>
      </v-row>
      <v-divider />
    </v-container>
  </v-app>
</template>

<script>
export default {

}
</script>

<style lang="stylus">

</style>
