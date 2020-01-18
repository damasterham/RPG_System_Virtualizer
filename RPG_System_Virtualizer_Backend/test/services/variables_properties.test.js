const assert = require('assert');
const app = require('../../src/app');

describe('\'variables_properties\' service', () => {
  it('registered the service', () => {
    const service = app.service('variables-properties');

    assert.ok(service, 'Registered the service');
  });
});
