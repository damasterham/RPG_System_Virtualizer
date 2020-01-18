const assert = require('assert');
const app = require('../../src/app');

describe('\'domain_collections\' service', () => {
  it('registered the service', () => {
    const service = app.service('domain-collections');

    assert.ok(service, 'Registered the service');
  });
});
