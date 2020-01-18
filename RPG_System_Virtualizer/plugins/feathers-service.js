import feathersClient from '~/plugins/feathers-client'
export default function createService (namespace, options = {}) {
  const globalOptions = {
    enableEvents: true,
    service: namespace
  }
  options = Object.assign({}, globalOptions, options)
  const service = feathersClient.service(options.service)
  const module = {
    namespaced: true,
    state: {
      current: {},
      list: [],
      query: {}
    },
    mutations: {
      setCurrent (state, item) {
        state.current = item
      },
      addItems (state, items) {
        state.list = state.list.concat(items)
      },
      clear (state) {
        state.list = []
      },
      addItem (state, args) {
        let index = state.list.length
        let item = args
        if (Array.isArray(args)) {
          index = args[0]
          item = args[1]
        }
        state.list.splice(index, 0, item)
      },
      updateItem (state, item) {
        if (state.current && state.current.id === item.id) {
          state.current = item
        }
        const index = state.list.findIndex(element => element.id === item.id)
        if (index > -1) {
          state.list.splice(index, 1, item)
        } else {
          state.list.push(item)
        }
      },
      // Recieves an object with a primaryidentifier:String field and a value:<T>
      updateItemWithKey (state, item) {
        const key = item.primaryIdentifier
        item = item.value
        if (state.current && state.current[key] === item[key]) {
          state.current = item
        }
        const index = state.list.findIndex(element => element[key] === item[key])
        if (index > -1) {
          state.list.splice(index, 1, item)
        } else {
          state.list.push(item)
        }
      },
      removeItem (state, id, key = 'id') {
        if (typeof id === 'object' && id !== null) {
          key = id.key
          id = id.id
        }
        if (state.current && state.current[key] === id) {
          state.current = null
        }
        state.list = state.list.filter(element => element[key] !== id)
      },
      removeItems (state, id, key = 'id') {
        state.list = state.list.filter(element => !id.every(el => el !== element[key]))
      },
      setQuery (state, query) {
        state.query = query
      }
    },
    actions: {
      async find ({ state, commit }, params) {
        try {
          const clear = params.$clear === true
          delete params.$clear
          const res = await service.find(params)
          if (res && !clear) {
            commit('addItems', res)
            return res
          } else {
            commit('clear')
            commit('addItems', res)
            return res
          }
        } catch (error) {
          return Promise.reject(error)
        }
      },
      async get ({ commit }, id) {
        try {
          const res = await service.get(id)
          commit('setCurrent', res)
          commit('updateItem', res)
          return res
        } catch (error) {
          return Promise.reject(error)
        }
      },
      async data ({ state, commit }, params) {
        try {
          const res = await service.find(params)
          return res
        } catch (error) {
          return Promise.reject(error)
        }
      },
      async create ({ commit }, data) {
        try {
          const res = await service.create(data)
          commit('setCurrent', res)
          commit('addItem', res)
          return res
        } catch (error) {
          return Promise.reject(error)
        }
      },
      async update ({ commit }, args) {
        try {
          const id = args[0]
          const data = args[1]
          const res = await service.update(id, data)
          commit('updateItem', res)
          return res
        } catch (error) {
          return Promise.reject(error)
        }
      },
      async patch ({ commit }, args) {
        try {
          const id = args[0]
          const data = args[1]
          const res = await service.patch(id, data)
          commit('updateItem', res)
          return res
        } catch (error) {
          return Promise.reject(error)
        }
      },
      async remove ({ commit }, idOrArray) {
        try {
          let id
          let params
          if (Array.isArray(idOrArray)) {
            id = idOrArray[0]
            params = idOrArray[1]
          } else {
            id = idOrArray
          }
          params = params || {}
          const res = await service.remove(id, params)
          commit('removeItem', id)
          return res
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },
    getters: {
      current: (state) => {
        return state.current
      },
      get: state => (id, key = 'id') => {
        return state.list.find(item => item[key] === id)
      },
      list: (state) => {
        return state.list
      },
      query: (state) => {
        return state.query
      }
    }
  }
  return (store) => {
    const preserveState = store.state.hasOwnProperty(namespace)
    if (process.server) {
      if (!preserveState) {
        store.registerModule(namespace, module)
      }
    } else if (!store.state.modules.hasOwnProperty(namespace)) {
      store.registerModule(namespace, module, { preserveState })
      store.commit('addModule', namespace)
      if (options.enableEvents) {
        // Listen to socket events when available.
        service.on('created', item => store.commit(`${namespace}/addItem`, item))
        service.on('updated', item => store.commit(`${namespace}/updateItem`, item))
        service.on('patched', item => store.commit(`${namespace}/updateItem`, item))
        service.on('removed', item => store.commit(`${namespace}/removeItem`, item))
      }
    }
  }
}