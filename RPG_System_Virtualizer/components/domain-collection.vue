<template>
  <div>
    <v-row no-gutters>
      <p class="title ml-3">
        {{ domainCollection.name }}
      </p>
      <v-spacer />
      <v-chip class="mr-3" outlined text-color="blue-grey lighten-2">
        Domain Collection
      </v-chip>
    </v-row>
    <v-divider />
    <v-autocomplete
      v-model="domainCollectionDomainIds"
      label="Add Domain"
      name="something not triggering autofill"
      :items="domains"
      item-text="name"
      return-object
    />
    <v-list>
      <template v-for="(domainId, index) in domainCollectionDomainIds">
        <v-list-item :key="'domainCollectionDomainIds-' + domainId">
          <v-list-item-title>
            {{ $store.getters['domains/get'](domainId).name }}
          </v-list-item-title>
          <v-list-item-action>
            <v-btn icon @click="removeDomainFromCollection(domainId)">
              <v-icon>
                cancel
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="index < domainCollectionDomainIds.length - 1" :key="'domainCollectionDomainIds-divider-' + domainId" />
      </template>
    </v-list>
  </div>
</template>

<script>
export default {
  props: {
    domainCollection: {
      type: Object,
      default: () => { return { id: null, name: null, version: '0.0' } }
    }
  },
  computed: {
    domains () {
      const list = this.$store.getters['domains/list'].filter((domain) => {
        return !this.domainCollectionDomainIds.some(domainId => domainId === domain.id)
      })
      return list
    },
    domainCollectionDomainIds: {
      get () {
        return this.$store.getters.getDomainCollectionDomainIds()
      },
      set (value) {
        this.addDomainToCollection(value)
      }
    }
  },
  methods: {
    async addDomainToCollection (domain) {
      const res = await this.$store.dispatch('domain-collections-domains/create', {
        domainCollectionId: this.domainCollection.id,
        domainId: domain.id
      })
      this.$store.commit('addDomainCollectionDomainId', res.domainId)
      this.checkDependenciesFulfilled(domain)
    },
    async removeDomainFromCollection (domain) {
      const res = await this.$store.dispatch('domain-collections-domains/remove', [null, {
        query: {
          domainCollectionId: this.domainCollection.id,
          domainId: domain.id
        }
      }])
      this.$store.commit('removeDomainCollectionDomainId', res.domainId)
      // this.checkDependenciesFulfilled()
    },
    async checkDependenciesFulfilled (domain) {
      if (this.domainCollectionDomainIds.length === 0) { return }
      // TODO TODO TODO

      // For the specific domain added
      // Get parent domains of ids
      let domainContext = domain
      const heritage = []
      heritage.push(domain.id)
      while (domainContext.parentDomainId !== null) {
        heritage.push(domainContext.parentDomainId)
        domainContext = this.$store.getters['domains/get'](domainContext.parentDomainId)
      }
      console.log('DC-Heri', heritage)
      // foreach domain present, get domain dependency ids
      const dependencies = new Set()
      for (let i = 0; i < heritage.length; i++) {
        // const domain = this.$store.getters['domains/get'](heritage[i])
        const currentDependencies = await this.$store.dispatch('domain-dependencies/find', {
          query: {
            domainId: heritage[i]
          }
        })
        // Get domain dependency ids of domain
        currentDependencies.forEach((item) => {
          dependencies.add(item)
        })
        // this.$store.getters['domain-dependencies/list']
        //   .filter(item => item.domainId === heritage[i])
        //   .map(item => item.domainDependencyId)
        //   .forEach((item) => {
        //     dependencies.add(item)
        //   })
        // Or maybe make dispatch find?
      }
      // Add missing domain dependencies to the domainCollection
      dependencies.forEach((item) => {
        console.log('DC-DEEEP', item)
        const domainIds = this.$store.getters.getDomainCollectionDomainIds()
        console.log('DC-DOMID', domainIds)
        if (!domainIds.some(domainId => domainId === item.domainDependencyId)) {
          console.log('DC-Addnew')
          this.addDomainToCollection(this.$store.getters['domains/get'](item.domainDependencyId))
        }
      })

      console.log('DC-Dep', dependencies)
    }
  }
}
</script>

  <style lang="stylus" />
</template>