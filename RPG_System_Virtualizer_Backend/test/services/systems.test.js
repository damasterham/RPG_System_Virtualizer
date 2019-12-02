const assert = require('assert');
const app = require('../../src/app');

describe('\'systems\' service', () => {
  it('registered the service', () => {
    const service = app.service('systems');

    assert.ok(service, 'Registered the service');
  });
});
