const incrementMinor = require('../../hooks/increment-minor');

const incrementMajor = require('../../hooks/increment-major');

// const setPropertyReferenceType = require('../../hooks/set-property-reference-type');

// const validateIsValidPropertyReference = require('../../hooks/validate-is-valid-property-reference');

const createRawValueForProperty = require('../../hooks/create-raw-value-for-property');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [incrementMinor()/*, validateIsValidPropertyReference()*/],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [createRawValueForProperty()],
    update: [],
    patch: [/*setPropertyReferenceType()*/],
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
