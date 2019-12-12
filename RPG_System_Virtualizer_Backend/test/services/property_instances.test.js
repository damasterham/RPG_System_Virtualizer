const assert = require('assert');
const app = require('../../src/app');

describe('\'property_instances\' service', () => {
  it('registered the service', () => {
    const service = app.service('property-instances');

    assert.ok(service, 'Registered the service');
  });
});
