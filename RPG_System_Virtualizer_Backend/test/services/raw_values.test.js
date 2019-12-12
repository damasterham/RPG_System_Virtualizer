const assert = require('assert');
const app = require('../../src/app');

describe('\'raw_values\' service', () => {
  it('registered the service', () => {
    const service = app.service('raw-values');

    assert.ok(service, 'Registered the service');
  });
});
