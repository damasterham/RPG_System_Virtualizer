const assert = require('assert');
const app = require('../../src/app');

describe('\'domain_collections_domains\' service', () => {
  it('registered the service', () => {
    const service = app.service('domain-collections-domains');

    assert.ok(service, 'Registered the service');
  });
});
