const assert = require('assert');
const app = require('../../src/app');

describe('\'property_specific_variables\' service', () => {
  it('registered the service', () => {
    const service = app.service('property-specific-variables');

    assert.ok(service, 'Registered the service');
  });
});
