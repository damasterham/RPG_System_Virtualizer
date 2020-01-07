const assert = require('assert');
const app = require('../../src/app');

describe('\'properties_properties\' service', () => {
  it('registered the service', () => {
    const service = app.service('properties-properties');

    assert.ok(service, 'Registered the service');
  });
});
