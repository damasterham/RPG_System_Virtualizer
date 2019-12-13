const incrementMinor = require('../../hooks/increment-minor');

const incrementMajor = require('../../hooks/increment-major');

const setPropertyReferenceType = require('../../hooks/set-property-reference-type');

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
    create: [setPropertyReferenceType()],
    update: [],
    patch: [setPropertyReferenceType()],
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
