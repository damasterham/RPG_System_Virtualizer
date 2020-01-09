const assert = require('assert');
const app = require('../../src/app');

describe('\'variables\' service', () => {

  let systemService;
  let domainService;
  let propertyService;
  let functionService;

  before(async  () => {

  });


  it('registered the service', () => {
    const service = app.service('variables');

    assert.ok(service, 'Registered the service');
  });
});
