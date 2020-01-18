const assert = require('assert');
const app = require('../../src/app');

describe('\'properties_domains\' service', () => {
  it('registered the service', () => {
    const service = app.service('properties-domains');

    assert.ok(service, 'Registered the service');
  });
});
