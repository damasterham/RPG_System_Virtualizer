const assert = require('assert');
const app = require('../../src/app');

describe('\'equation_rounder\' service', () => {
  it('registered the service', () => {
    const service = app.service('equation-rounder');

    assert.ok(service, 'Registered the service');
  });
});
