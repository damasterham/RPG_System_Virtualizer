// eslint-disable-next-line
import feathersClient from '~/plugins/feathers-client.js'
export const state = () => ({
  // Generic service modules
  modules: {},
  // Specific selected services
  system: null,
  domain: null,
  domainCollection: null,
  potentialDomainCollectionDomainIds: [],
  domainCollectionDomainIds: [],
  domainParentage: [],
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
  getDomainParentage: state => () => {
    return state.domainParentage
  },
  getProperty: state => () => {
    return state.property
  },
  getFunction: state => () => {
    return state.function
  },
  getDomainDependencyIds: state => () => {
    return state.domainDependencyIds
  },
  getDomainCollection: state => () => {
    return state.domainCollection
  },
  getPotentialDomainCollectionDomainIds: state => () => {
    return state.potentialDomainCollectionDomainIds
  },
  getDomainCollectionDomainIds: state => () => {
    return state.domainCollectionDomainIds
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
  selectDomainCollection (state, data) {
    state.domainCollection = data
  },
  setDomainCollectionDomainIds (state, data) {
    state.domainCollectionDomainIds = data
  },
  // setPotentialDomainCollectionDomainIds (state, data) {
  //   state.potentialDomainCollectionDomainIds = data
  // },
  addDomainCollectionDomainId (state, data) {
    const index = state.domainCollectionDomainIds.findIndex(item => item === data)
    if (index === -1) { state.domainCollectionDomainIds.push(data) }
  },
  removeDomainCollectionDomainId (state, data) {
    const index = state.domainCollectionDomainIds.findIndex(item => item === data)
    if (index > -1) { state.domainCollectionDomainIds.splice(index, 1) }
  },
  selectProperty (state, data) {
    state.property = data
  },
  selectFunction (state, data) {
    state.function = data
  },
  setDomainParentage (state, data) {
    state.domainParentage = data
  },
  setDomainDependencyIds (state, data) {
    state.domainDependencyIds.splice(0, state.domainDependencyIds.length, ...data)
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