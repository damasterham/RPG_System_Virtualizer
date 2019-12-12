// eslint-disable-next-line
import feathersClient from '~/plugins/feathers-client.js'
export const state = () => ({
  modules: {}
})
export const getters = {
  hasModule: state => (id) => {
    return state.modules.hasOwnProperty(id)
  }
}
export const mutations = {
  addModule (state, data) {
    state.modules[data] = true
  }
}

export const actions = {

}