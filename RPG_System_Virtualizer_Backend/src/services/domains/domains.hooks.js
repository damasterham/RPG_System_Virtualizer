

const incrementMinor = require('../../hooks/increment-minor');

const incrementMajor = require('../../hooks/increment-major');

const createPropertNameForDomain = require('../../hooks/create-property-name-for-domain');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [incrementMinor()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createPropertNameForDomain()],
    update: [],
    patch: [],
    remove: [incrementMajor()]
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
