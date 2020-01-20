import Vue from 'vue'
// eslint-disable-next-line
import feathersClient from '~/plugins/feathers-client.js'
export const state = () => ({
  modules: {},
  system: null,
  domain: null,
  domainCollection: null,
  domainParentage: [],
  domainDependencyIds: [],
  property: null,
  function: null,
  newInstance: {}
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
  getNewInstance: state => () => {
    return state.newInstance
  },
  getNewInstanceProperty: state => (id) => {
    console.log('getNewInstanceProperty', id)
    const prop = state.newInstance['property_' + id]
    console.log('getNewInstanceProperty', prop, state.newInstance)
    return prop ? prop.value : undefined
  },
  getNewInstanceVariable: state => (propId, varId) => {
    console.log('getNewInstanceVariable', propId, varId)
    const variable = state.newInstance['property_' + propId + '_variable_' + varId]
    console.log('getNewInstanceVariable', variable, state.newInstance)
    return variable ? variable.value : undefined
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
    // TODO: should be moved to methods in specific component
    if (data !== null && state.modules.domains) {
      let dom = data
      const parentage = []
      while (dom.parentDomainId !== null) {
        parentage.push(dom.parentDomainId)
        dom = this.getters['domains/get'](dom.parentDomainId)
      }
      state.domainParentage = parentage
    }
  },
  selectDomainCollection (state, data) {
    state.domainCollection = data
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
    state.domainDependencyIds = data
  },
  addDomainDependencyId (state, data) {
    const index = state.domainDependencyIds.findIndex(item => item === data)
    if (index === -1) { state.domainDependencyIds.push(data) }
  },
  removeDomainDependencyId (state, data) {
    const index = state.domainDependencyIds.findIndex(item => item === data)
    if (index > -1) { state.domainDependencyIds.splice(index, 1) }
  },

  /* ------------------------ Instancing ------------------------ */
  scaffoldNewInstanceFields (state, data) {
    console.log('scaffoldNewInstanceFields', data)
    const obj = {}
    if (data[0].props) {
      data.forEach((domain) => {
        domain.props.forEach((prop) => {
          obj['property_' + prop.id] = {
            value: null,
            propertyListeners: [],
            variableListeners: []
          }
        })
      })
    } else {
      data.forEach((prop) => {
        obj['property_' + prop.id] = {
          value: null,
          propertyListeners: [],
          variableListeners: []
        }
      })
    }
    state.newInstance = { ...obj }
  },
  // data: { to:int, from:int }. to: Is listened to, from: Is listening
  addPropertyListenerInNewInstance (state, data) {
    const obj = { ...state.newInstance['property_' + data.to] }
    const propertyListeners = obj.propertyListeners
    if (propertyListeners.every(item => item !== data.from)) {
      propertyListeners.push(data.from)
      this.commit('setNewInstanceProperty', {
        id: data.from,
        val: obj.value
      })
      obj.propertyListeners = [...propertyListeners]
      Vue.set(state.newInstance, 'property_' + data.to, obj)
    }
  },
  // data: { to:int, from:{ propId:int, varId:int }, functionId:int }. to: Is listened to, from: Is listening
  addVariableListenerInNewInstance (state, data) {
    console.log('addVariableListenerInNewInstance', data)
    const obj = { ...state.newInstance['property_' + data.to] }
    const variableListeners = obj.variableListeners
    if (variableListeners.every((item) => { return item.propId !== data.from.propId && item.varId !== data.from.varId })) {
      variableListeners.push(data.from)
      this.commit('setNewInstanceVariable', {
        propId: data.from.propId,
        varId: data.from.varId,
        functionId: data.functionId,
        val: obj.value
      })
      obj.variableListeners = [...variableListeners]
      Vue.set(state.newInstance, 'property_' + data.to, obj)
    }
  },
  // data: { id:int, val:Any }. id: The property being update, val: The new value
  setNewInstanceProperty (state, data) {
    const obj = { ...state.newInstance['property_' + data.id] }
    console.log('setNewInstanceProperty: obj, data', obj, data)
    obj.value = data.val
    obj.propertyListeners.forEach((id) => {
      this.commit('setNewInstanceProperty', { id, val: data.val })
    })
    obj.variableListeners.forEach((ids) => {
      this.commit('setNewInstanceVariable', { ...ids, val: data.val })
    })
    Vue.set(state.newInstance, 'property_' + data.id, obj)
  },
  // data: { propId:int, varId:int }. propId: Property dependent on variable, varId: Variable id
  setNewInstanceVariable (state, data) {
    if (data.val === undefined) { data.val = null }
    const obj = { ...state.newInstance['property_' + data.propId + '_variable_' + data.varId] }
    console.log('setNewInstanceVariable obj data', obj, data)
    if (obj.value === undefined) {
      console.log('variable is undefined, scaffolding')
      obj.propertyListeners = []
      obj.variableListeners = []
      obj.functionListeners = []
    }
    obj.value = data.val
    Vue.set(state.newInstance, 'property_' + data.propId + '_variable_' + data.varId, obj)
    obj.propertyListeners.forEach((item) => {
      this.commit('setNewInstanceProperty', { id: item, val: data.val })
    })
    obj.variableListeners.forEach((item) => {
      this.commit('setNewInstanceVariable', { propId: item.propId, varId: item.varId, val: data.val })
    })
    obj.functionListeners.forEach((item) => {
      this.commit('recomputeFunctionInNewInstance', item)
    })
  },
  deleteNewInstanceProperty (state, id) {
    console.log('deleteNewInstanceProperty', id)
    state.newInstance['property_' + id].value = null
    state.newInstance['property_' + id].propertyListeners.forEach((id) => {
      this.commit('deleteNewInstanceProperty', id)
    })
    state.newInstance['property_' + id].variableListeners.forEach((id) => {
      this.commit('deleteNewInstanceProperty', id)
    })
  },
  resetNewInstance (state) {
    state.newInstance = {}
  },
  // data: { definition:string, functionId:int, propertyId:int }
  setFunctionInNewInstance (state, data) {
    console.log('setFunctionInNewInstance')
    const obj = {}
    obj.definition = data.definition
    obj.functionId = data.functionId
    obj.propertyId = data.propertyId
    obj.propertyListeners = []
    obj.variableListeners = []
    let equation = ' ' + data.definition + ' '
    this.getters['variables/list']
      .filter(variable => variable.functionId === data.functionId)
      .forEach((variable) => {
        const regex = new RegExp(`\\s${variable.name}`, 'g')
        equation = equation.replace(
          regex,
          ' ' + this.getters.getNewInstanceVariable(data.propertyId, variable.id) + ' '
        )
        this.commit('addFunctionListener', { propId: data.propertyId, varId: variable.id })
      })
    obj.value = equation
    Vue.set(state.newInstance, 'property_' + data.propertyId, obj)
  },
  // data:int
  recomputeFunctionInNewInstance (state, data) {
    console.log('recomputeFunctionInNewInstance', data)
    const obj = { ...state.newInstance['property_' + data] }
    let equation = ' ' + obj.definition + ' '
    this.getters['variables/list']
      .filter(variable => variable.functionId === obj.functionId)
      .forEach((variable) => {
        const regex = new RegExp(`\\s${variable.name}`, 'g')
        equation = equation.replace(
          regex,
          ' ' + this.getters.getNewInstanceVariable(obj.propertyId, variable.id) + ' '
        )
      })
    console.log('compare before/after:', obj.value, equation)
    obj.value = equation
    Vue.set(state.newInstance, 'property_' + data, obj)
  },
  // data: { propId:int, varId:int }
  addFunctionListener (state, data) {
    console.log('addFunctionListener', data)
    const obj = { ...state.newInstance['property_' + data.propId + '_variable_' + data.varId] }
    obj.functionListeners.push(data.propId)
    console.log('listening to variable:', obj)
    console.log('newInstance', state.newInstance)
  }
}

export const actions = {

}