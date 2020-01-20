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
            <!--
            {{ $store.getters['domains/get'](domainId).name }}
            -->
            <span v-if="$store.getters['domain-dependencies/list'].some(dd => dd.domainDependencyId === domainId)" class="grey--text 100">
              {{
                getDomain(
                  $store.getters['domain-dependencies/list'].filter(dd => dd.domainDependencyId === domainId)[0].domainId
                ).name
              }}
              &#62;
            </span>
            {{ getDomain(domainId).name }}
            <span v-if="getDomain(domainId).parentDomainId !== null" class="grey--text 100">
              :
              {{
                getParent(domainId).name
              }}
            </span>
          </v-list-item-title>
          <v-list-item-action>
            <v-btn icon @click="attemptToRemoveDomainFromCollection(domainId)">
              <v-icon>
                cancel
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-divider v-if="index < domainCollectionDomainIds.length - 1" :key="'domainCollectionDomainIds-divider-' + domainId" />
      </template>
    </v-list>
    <!-- Dependency & Lineage Removal  -->
    <v-dialog
      v-model="dependencyDeletionDialog"
      scrollable
      persistent
      :overlay="true"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title class="headline red">
          Delete dependent domains
        </v-card-title>
        <v-card-text>
          <p class="mt-3">
            You are attempting to delete the domain
            <!-- specific domain -->
            <span class=" white--text">
              {{ domainToBeRemoved.name }}
            </span>
            which is depended upon by other domains.
            If you want to delete the domain, you will have to delete at domains dependent upon it.
            Domians to be removed from Domain Collection:
          </p>

          <!-- list of domains dependent upon -->
          <v-list desnse disabled>
            <!--
            <v-subheader class="title white--text">
              <v-icon small>
                fiber_manual_record
              </v-icon>
              {{ domainToBeRemoved.name }}
            </v-subheader>
            -->
            <v-list-item v-for="(dependant, i) in actualToBeRemoved" :key="i">
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon small>
                    fiber_manual_record
                  </v-icon>
                  {{ dependant.name }}
                  <v-list-item-title />
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          Are you sure you want to delete that domain and domains dependent upon it?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <saveCancelButtons
            cancel-button-text="Cancel"
            commit-button-text="Delete"
            @cancel="dependencyDeletionDialog = false"
            @commit="removeDomainsFromCollection(actualToBeRemoved) // .map(d => d.id).concat(domainToBeRemoved.id));
                     dependencyDeletionDialog = false"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template></v-dialog>
  </div>
</template>

<script>
import saveCancelButtons from '~/components/save-cancel-buttons.vue'
import heritage from '~/components/mixins/heritage.js'
// import domainCollectionAddition from '~/components/mixins/domainCollectionAddition.js'

export default {
  components: { saveCancelButtons },
  mixins: [heritage], // , domainCollectionAddition],
  props: {
    domainCollection: {
      type: Object,
      default: () => { return { id: null, name: null, version: '0.0' } }
    }
  },
  data () {
    return {
      dependencyDeletionDialog: false,
      domainToBeRemoved: {},
      domainsToBeRemoved: new Set(), // []
      actualToBeRemoved: []
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
    // ,
    // dependantsToBeRemoved (domainIds) {
    //   return this.$store.getters['domains/list'].filter(d => d.id === domain.id)
    // }
  },
  // async created () {
  //   // Adds relevant domains from domain collection with full dependencies on component load
  //   console.log('Mounted', this.$store.getters.getPotentialDomainCollectionDomainIds())
  //   if (this.$store.getters.getPotentialDomainCollectionDomainIds().length > 0) {
  //     // this.addDomainToCollection({ id: this.$store.getters.getPotentialDomainCollectionDomainIds()[0] })
  //     const bullishitGarbageAssPromiseList = []
  //     this.$store.getters.getPotentialDomainCollectionDomainIds()
  //       .forEach((id) => {
  //         console.log('Trying to add', this.getDomain(id))
  //         bullishitGarbageAssPromiseList.push(this.addDomainToCollection({ id }))
  //       })
  //     await Promise.all(bullishitGarbageAssPromiseList)
  //   }
  //   // this.$store.getters.getPotentialDomainCollectionDomainIds()
  //   //   .forEach(async (id) => {
  //   //     console.log('Trying to add', this.getDomain(id))
  //   //     await this.addDomainToCollection({ id })
  //   //   })
  // },
  methods: {
    getDomain (domainId) {
      return this.$store.getters['domains/get'](domainId)
    },
    getParent (domainId) {
      // console.log(domainId)
      const d = this.getDomain(domainId)
      // console.log(d)
      const p = this.getDomain(d.parentDomainId)
      // console.log(p)
      return p // this.getDomain(.parentDomainId)
    },
    async addDomainToCollection (domain) {
      // await this.m_addDomainToCollection(domain)
      // console.log('Add d id', { ...domain })
      // let res = await this.$store.dispatch('domain-collections-domains/data', {
      //   query: {
      //     domainCollectionId: this.domainCollection.id,
      //     domainId: domain.id
      //   }
      // })

      // console.log('?Res', res)

      // res = res[0]

      // console.log('?Res', res)

      // // = this.$store.getters['domain-collection-domains/get'](null, [])
      // if (!res) { /// (res.length === 0) { // if (!res || res === null || res.length === 0) {
      // console.log('Garbage')
      // console.log('G!', res)
      const res = await this.$store.dispatch('domain-collections-domains/create', {
        domainCollectionId: this.domainCollection.id,
        domainId: domain.id
      })
      // }

      console.log('Add res', res)
      this.$store.commit('addDomainCollectionDomainId', res.domainId)
      // this.checkDependenciesFulfilled(domain)
      this.checkParentsAndDependenciesFulfilled(domain)
    },
    async checkParentsAndDependenciesFulfilled (domain) {
      console.log('CheckParentDep')
      // Get domains heritage
      // const heritage = await this.m_getHeritage(domain, false)
      // console.log('DC-Heri', heritage)
      // const hDomains = this.$store.getters['domains/list'].filter(d => heritage.some(id => id === d.id))
      // console.log('DC-Heri-D', hDomains)

      // Get domains dependencies
      const dependencies = await this.$store.dispatch('domain-dependencies/data', {
        query: {
          domainId: domain.id
        }
      })
      console.log('DC-Depens', dependencies)
      const dDomains = this.$store.getters['domains/list'].filter(d => dependencies.some(dep => dep.domainDependencyId === d.id))
      console.log('DC-Depens-D', dDomains)

      // Add recursivly
      // hDomains.forEach((h) => {
      const parent = this.getParent(domain.id)
      if (parent) { this.addDomainToCollection(parent) }
      // })
      dDomains.forEach((d) => {
        this.addDomainToCollection(d)
      })
    },
    attemptToRemoveDomainFromCollection (domainId) {
      // Get specific domain attempting to remove
      this.domainToBeRemoved = this.getDomain(domainId)
      // Clear the set of all to be removed
      this.domainsToBeRemoved.clear()
      // Recusivly get all domains to be removed
      this.attemptToRemoveDomainsAndSubDomains(domainId)

      console.log('AllPossibleToBeRemoved', this.domainsToBeRemoved)

      //     .filter(dependant => this.domainCollectionDomainIds
      //       .some(id => id === dependant.domainId))
      console.log('DomCol', this.domainCollectionDomainIds)
      this.actualToBeRemoved = [ ...this.domainsToBeRemoved ].filter(d => this.domainCollectionDomainIds.some(id => d.id === id))

      console.log('AllToBeRemoved', this.actualToBeRemoved)

      if (this.actualToBeRemoved && this.actualToBeRemoved.length > 1) {
        // Prompt user about their deletion
        this.dependencyDeletionDialog = true
      } else if (this.actualToBeRemoved && this.actualToBeRemoved.length === 1) {
        // Remove if is just the 1 since that would mean none are dependant on it
        this.removeDomainsFromCollection(this.actualToBeRemoved)
      }
    },
    attemptToRemoveDomainsAndSubDomains (domainId) {
      // Get domain to be deleted
      this.domainsToBeRemoved.add(this.getDomain(domainId))
      // Get domains children
      // let children = []
      // dependants.forEach((dependant) => {
      //  Gets children
      const childrenIds = this.$store.getters['domains/list']
        .filter(domain => domain.parentDomainId === domainId)
        .map(domain => domain.id)
      console.log('Children of ' + domainId, childrenIds)
      // })

      childrenIds.forEach((childId) => {
        this.attemptToRemoveDomainsAndSubDomains(childId)
      })

      // Get domains dependant on domain
      const dependantIds = this.$store.getters['domain-dependencies/list']
        .filter(dependant => dependant.domainDependencyId === domainId)
        .map(dependant => dependant.domainId)
      console.log('Dependeants of ' + domainId, dependantIds)
      //   .filter(dependant => contextDependants.some(domain => dependant.domainDependencyId === domain.domainId))
      // dependants = dependants.concat(contextDependants)

      dependantIds.forEach((depId) => {
        this.attemptToRemoveDomainsAndSubDomains(depId)
      })

      // When all is done
    },
    // [Deprecated]
    // async attemptToRemoveDomainFromCollection (domainId) {
    //   // Get domain to be removed
    //   this.domainToBeRemoved = this.$store.getters['domains/get'](domainId)
    //   // Get dependants of the said domain
    //   let dependants = []
    //   let contextDependants = [{ domainId: this.domainToBeRemoved.id }]
    //   console.log('Context', contextDependants)
    //   //  [{ domainId: this.domainToBeRemoved.id }]
    //   while (contextDependants && contextDependants.length > 0) {
    //     contextDependants = this.$store.getters['domain-dependencies/list']
    //       .filter(dependant => contextDependants.some(domain => dependant.domainDependencyId === domain.domainId))
    //     dependants = dependants.concat(contextDependants)
    //   }
    //   console.log(dependants)
    //   // Get children of any dependencies
    //   // Get dependants of children
    //   let children = []
    //   dependants.forEach((dependant) => {
    //     //  Gets children
    //     children = this.$store.getters['domains/list'].filter(domain => domain.parentDomainId === dependant.domainId)
    //     console.log('Children of ' + dependant.domainId, children)
    //   })

    //   // Reduce to only domains present in domain collections and map to ids
    //   const dependantIds = dependants
    //     .filter(dependant => this.domainCollectionDomainIds
    //       .some(id => id === dependant.domainId))
    //     .map(dependant => dependant.domainId)
    //   console.log('Dependants', this.$store.getters['domains/list'].filter(d => dependantIds.some(id => id === d.id)))
    //   // If there are any dependants
    //   if (dependantIds && dependantIds.length > 0) {
    //     this.domainsToBeRemoved = this.$store.getters['domains/list'].filter(d => dependantIds.some(id => d.id === id)) // Could use domain
    //     // Prompt user to delete domains that have this as dependency  (recursive)
    //     this.dependencyDeletionDialog = true
    //   } else {
    //     // Or remove the domain that has no depenedants
    //     await this.removeDomainsFromCollection(this.domainToBeRemoved.id)
    //   }
    // },
    async removeDomainsFromCollection (domains) {
      console.log('Remove', domains)
      const resSet = await this.$store.dispatch('domain-collections-domains/remove', [null, {
        query: {
          domainCollectionId: this.domainCollection.id,
          domainId: domains.map(domain => domain.id)
        }
      }])
      console.log(resSet)
      resSet.forEach((dcd) => {
        this.$store.commit('removeDomainCollectionDomainId', dcd.domainId)
      })
    },
    // [Deprecated]
    async checkDependenciesFulfilled (domain) {
      // if (this.domainCollectionDomainIds.length === 0) { return }
      // For the specific domain added
      // Get parent domains of ids
      const heritage = await this.m_getHeritage(domain)
      console.log('DC-Heri', heritage)

      // foreach domain parent present, get domain dependency ids
      // Gets the dependency from domain and its parents without including its parent as added domain
      const dependencies = new Set()
      for (let i = 0; i < heritage.length; i++) {
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