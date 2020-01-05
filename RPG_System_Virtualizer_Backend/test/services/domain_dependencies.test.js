const assert = require('assert');
const app = require('../../src/app');

describe('\'domain_dependencies\' service', () => {
  it('registered the service', () => {
    const service = app.service('domain-dependencies');

    assert.ok(service, 'Registered the service');
  });
});
