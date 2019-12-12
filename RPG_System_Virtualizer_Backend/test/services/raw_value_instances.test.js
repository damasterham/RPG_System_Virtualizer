const assert = require('assert');
const app = require('../../src/app');

describe('\'raw_value_instances\' service', () => {
  it('registered the service', () => {
    const service = app.service('raw-value-instances');

    assert.ok(service, 'Registered the service');
  });
});
