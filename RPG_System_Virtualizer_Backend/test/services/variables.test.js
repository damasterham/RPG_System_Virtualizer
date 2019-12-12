const assert = require('assert');
const app = require('../../src/app');

describe('\'variables\' service', () => {
  it('registered the service', () => {
    const service = app.service('variables');

    assert.ok(service, 'Registered the service');
  });
});
