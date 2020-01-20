export default {
  methods: {
    async m_getHeritage (domain, includeSelf = true) {
      let domainContext = domain
      const heritage = []
      if (includeSelf) { heritage.push(domain.id) }
      while (domainContext.parentDomainId !== null) {
        heritage.push(domainContext.parentDomainId)
        domainContext = this.$store.getters['domains/get'](domainContext.parentDomainId)
        if (!domainContext || domainContext === null) {
          domainContext = await this.$store.dispatch('domains/get', domainContext)
        }
      }
      return heritage
    }
  }
}