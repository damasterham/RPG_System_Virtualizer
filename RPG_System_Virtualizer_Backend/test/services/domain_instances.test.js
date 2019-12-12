const assert = require('assert');
const app = require('../../src/app');

describe('\'domain_instances\' service', () => {
  it('registered the service', () => {
    const service = app.service('domain-instances');

    assert.ok(service, 'Registered the service');
  });
});
