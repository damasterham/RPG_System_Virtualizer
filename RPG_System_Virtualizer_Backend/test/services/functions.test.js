const assert = require('assert');
const app = require('../../src/app');

describe('\'functions\' service', () => {
  it('registered the service', () => {
    const service = app.service('functions');

    assert.ok(service, 'Registered the service');
  });
});
