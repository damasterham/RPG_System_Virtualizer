const incrementMinor = require('../../hooks/increment-minor');

const incrementMajor = require('../../hooks/increment-major');

const setPropertyReferenceType = require('../../hooks/set-property-reference-type');

const validateIsValidPropertyReference = require('../../hooks/validate-is-valid-property-reference');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateIsValidPropertyReference()],
    update: [],
    patch: [incrementMinor(), validateIsValidPropertyReference()],
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
