const assert = require('assert');
const app = require('../../src/app');

describe('\'properties_functions\' service', () => {
  it('registered the service', () => {
    const service = app.service('properties-functions');

    assert.ok(service, 'Registered the service');
  });
});
