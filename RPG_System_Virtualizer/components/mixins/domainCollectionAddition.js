import heritage from '~/components/mixins/heritage.js'

export default {
  mixins: [heritage],
  methods: {
    async m_addDomainToCollection (domain) {
      const res = await this.$store.dispatch('domain-collections-domains/create', {
        domainCollectionId: this.domainCollection.id,
        domainId: domain.id
      })
      console.log('Add res', res)
      this.$store.commit('addDomainCollectionDomainId', res.domainId)
      // this.checkDependenciesFulfilled(domain)
      this.m_checkParentsAndDependenciesFulfilled(domain)
    },
    async m_checkParentsAndDependenciesFulfilled (domain) {
      // Get domains heritage
      const heritage = await this.m_getHeritage(domain, false)
      console.log('DC-Heri', heritage)
      const hDomains = this.$store.getters['domains/list'].filter(d => heritage.some(id => id === d.id))
      console.log('DC-Heri-D', hDomains)

      // Get domains dependencies
      const dependencies = await this.$store.dispatch('domain-dependencies/find', {
        query: {
          domainId: domain.id
        }
      })
      console.log('DC-Depens', dependencies)
      const dDomains = this.$store.getters['domains/list'].filter(d => dependencies.some(dep => dep.domainDependencyId === d.id))
      console.log('DC-Depens-D', dDomains)

      // Add recursivly
      hDomains.forEach((h) => {
        this.m_addDomainToCollection(h)
      })
      dDomains.forEach((d) => {
        this.m_addDomainToCollection(d)
      })
    }
  }
}