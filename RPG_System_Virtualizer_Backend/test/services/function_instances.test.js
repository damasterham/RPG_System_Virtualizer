const assert = require('assert');
const app = require('../../src/app');

describe('\'function_instances\' service', () => {
  it('registered the service', () => {
    const service = app.service('function-instances');

    assert.ok(service, 'Registered the service');
  });
});
