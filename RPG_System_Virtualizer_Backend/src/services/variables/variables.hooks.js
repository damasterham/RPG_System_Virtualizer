
const incrementMinor = require('../../hooks/increment-minor');
const incrementMajor = require('../../hooks/increment-major');

const setVariableReference = require('../../hooks/set-variable-reference');

const retainReferenceType = require('../../hooks/retain-reference-type');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [incrementMinor(), retainReferenceType()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [setVariableReference()],
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
