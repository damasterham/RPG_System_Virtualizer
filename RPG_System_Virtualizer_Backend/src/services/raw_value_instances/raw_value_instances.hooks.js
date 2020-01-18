

const addDefaultRawValue = require('../../hooks/add-default-raw-value');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [addDefaultRawValue()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
