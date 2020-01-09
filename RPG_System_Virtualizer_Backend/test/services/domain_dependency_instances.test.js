const assert = require('assert');
const app = require('../../src/app');

describe('\'domain_dependency_instances\' service', () => {
  it('registered the service', () => {
    const service = app.service('domain-dependency-instances');

    assert.ok(service, 'Registered the service');
  });
});
