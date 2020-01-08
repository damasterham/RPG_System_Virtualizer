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
      query: {},
      pagination: {
        limit: 0,
        page: 0,
        progress: 0,
        skip: 0,
        total: 0
      }
    },
    mutations: {
      setCurrent (state, item) {
        state.current = item
      },
      addItems (state, items) {
        state.list = [...state.list, ...items]
      },
      clear (state) {
        state.list = []
        state.pagination = {
          limit: 0,
          page: 0,
          progress: 0,
          skip: 0,
          total: 0
        }
      },
      addItem (state, args) {
        let index = state.list.length
        let item = args
        if (Array.isArray(args)) {
          index = args[0]
          item = args[1]
        }
        // state.list = [...state.list, item]
        state.list = [...state.list.slice(0, index), item, ...state.list.slice(index)]
      },
      updateItem (state, item) {
        if (state.current && state.current.id === item.id) {
          state.current = item
        }
        const index = state.list.findIndex(element => element.id === item.id)
        if (index > -1) {
          state.list = [...state.list.slice(0, index), item, ...state.list.slice(index + 1)]
        } else {
          // state.list = [...state.list.slice(0, state.list.length), item]
        }
      },
      removeItem (state, id, key = 'id') {
        if (state.current && state.current[key] === id) {
          state.current = null
        }
        state.list = state.list.filter(element => element[key] !== id)
      },
      removeItems (state, id, key = 'id') {
        state.list = state.list.filter(element => !id.every(el => el !== element[key]))
      },
      pagination (state, pagination) {
        state.pagination = pagination
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
          let res = await service.find(params)
          if (res.data && !clear) {
            let progress = Math.round((100 * (res.skip + res.limit)) / res.total)
            if (progress > 100) { progress = 100 }
            commit('pagination', {
              limit: res.limit,
              skip: res.skip,
              total: res.total,
              page: state.pagination.page + 1,
              progress
            })
            commit('addItems', res.data)
            return res.data
          } else {
            if (res.data) { res = res.data }
            commit('clear')
            commit('addItems', res)
            return res
          }
        } catch (error) {
          return Promise.reject(error)
        }
      },
      async nextPage ({ state, commit }, clear, query = null) {
        if (query === null) { query = state.query }
        try {
          if (clear) {
            commit('clear')
          }
          const res = await service.find({
            query: {
              ...query,
              ...{ $skip: state.pagination.limit + state.pagination.skip }
            }
          })
          let progress = Math.round((100 * (res.skip + res.limit)) / res.total)
          if (progress > 100) {
            progress = 100
          }
          if (clear) {
            commit('clear')
          }
          commit('pagination', {
            limit: res.limit,
            skip: res.skip,
            total: res.total,
            page: state.pagination.page + 1,
            progress
          })
          commit('addItems', res.data)
          return res
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
          let res = await service.find(params)
          if (res.data) {
            let data = res.data
            while (res.total > res.skip + res.limit) {
              params.query = {
                ...params.query,
                ...{ $skip: res.limit + res.skip }
              }
              res = await service.find(params)
              data = [...data, ...res.data]
            }
            return data
          } else {
            return res
          }
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
      pagination: (state) => {
        return state.pagination
      },
      query: (state) => {
        return state.query
      }
    }
  }
  return (store) => {
    const preserveState = store.state.hasOwnProperty(namespace)
    store.registerModule(namespace, module, {
      preserveState
    })
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