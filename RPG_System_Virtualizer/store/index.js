// eslint-disable-next-line
import feathersClient from '~/plugins/feathers-client.js'
export const state = () => ({
  modules: {},
  system: null,
  domain: null,
  domainDependencyIds: [],
  property: null,
  function: null
})
export const getters = {
  hasModule: state => (id) => {
    return state.modules.hasOwnProperty(id)
  },
  getSystem: state => () => {
    return state.system
  },
  getDomain: state => () => {
    return state.domain
  },
  getProperty: state => () => {
    return state.property
  },
  getFunction: state => () => {
    return state.function
  },
  getDomainDependencyIds: state => () => {
    return state.domainDependencyIds
  }
}
export const mutations = {
  addModule (state, data) {
    state.modules[data] = true
  },
  selectSystem (state, data) {
    state.system = data
  },
  selectDomain (state, data) {
    state.domain = data
  },
  selectProperty (state, data) {
    state.property = data
  },
  selectFunction (state, data) {
    state.function = data
  },
  setDomainDependencyIds (state, data) {
    state.domainDependencyIds = data
  },
  addDomainDependencyId (state, data) {
    const index = state.domainDependencyIds.findIndex(item => item === data)
    if (index === -1) { state.domainDependencyIds.push(data) }
  },
  removeDomainDependencyId (state, data) {
    const index = state.domainDependencyIds.findIndex(item => item === data)
    if (index > -1) { state.domainDependencyIds.splice(index, 1) }
  }
}

export const actions = {

}