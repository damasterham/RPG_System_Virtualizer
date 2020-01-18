const assert = require('assert');
const app = require('../../src/app');

describe('\'variables_domains\' service', () => {
  it('registered the service', () => {
    const service = app.service('variables-domains');

    assert.ok(service, 'Registered the service');
  });
});
