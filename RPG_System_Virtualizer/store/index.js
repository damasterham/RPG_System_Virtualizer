// eslint-disable-next-line
import feathersClient from '~/plugins/feathers-client.js'
export const state = () => ({
  modules: {},
  system: null,
  domain: null
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
  }
}

export const actions = {

}