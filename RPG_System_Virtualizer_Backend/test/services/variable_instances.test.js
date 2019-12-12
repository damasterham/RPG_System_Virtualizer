const assert = require('assert');
const app = require('../../src/app');

describe('\'variable_instances\' service', () => {
  it('registered the service', () => {
    const service = app.service('variable-instances');

    assert.ok(service, 'Registered the service');
  });
});
