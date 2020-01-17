

const getDefinitionVersion = require('../../hooks/get-definition-version');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [getDefinitionVersion()],
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
