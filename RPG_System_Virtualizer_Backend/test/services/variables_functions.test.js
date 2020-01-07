const assert = require('assert');
const app = require('../../src/app');

describe('\'variables_functions\' service', () => {
  it('registered the service', () => {
    const service = app.service('variables-functions');

    assert.ok(service, 'Registered the service');
  });
});
