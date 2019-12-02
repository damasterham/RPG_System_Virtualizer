const assert = require('assert');
const app = require('../../src/app');

describe('\'properties\' service', () => {
  it('registered the service', () => {
    const service = app.service('properties');

    assert.ok(service, 'Registered the service');
  });
});
