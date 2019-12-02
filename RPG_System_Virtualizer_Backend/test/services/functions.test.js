const assert = require('assert');
const app = require('../../src/app');

describe('\'functions\' service', () => {
  let system;
  let domain;
  let service;
  let domainService;
  let newEntry;
  let patchedEntry;

  before(async () => {
    service = app.service('functions');
    // Create System
    const systemService = app.service('systems');
    system = await systemService.create({
      name: 'test'
    });

    // Create Domain
    domainService = app.service('domains');
    domain = await domainService.create({
      system_id: system.id,
      name: 'test'
    });
  });

  it('registered the service', () => {
    assert.ok(service, 'Did not register the service');
  });

  it('created an entry', async () => {
    newEntry = await service.create({
      system_id: system.id,
      domain_id: domain.id,
      name: 'testFunction',
      definition: '6 / 2',
      data_type: 'int',
      function_type: 'equation'
    });
    console.log('new entry:', newEntry);

    assert.ok(newEntry.id, 'Did not create an entry');
  });

  it('patched an entry', async () => {
    patchedEntry = await service.patch(newEntry.id, { name: 'newName' });
    console.log('Patched Entry:', patchedEntry);

    assert.ok(patchedEntry.name === 'newName', 'Did not patch an entry');
    assert.ok(patchedEntry.version === '0.1', 'Did not increment minor version number');
  });

  it('removed an entry', async () => {
    const res = await service.remove(patchedEntry.id);
    console.log('removed entry:', res);
    assert.ok(res.id, 'entry was not removed');
    const domain = await domainService.get(res.domain_id);
    console.log('major version increment domain:', domain);
    assert.ok(domain.version === '1.0');
  });
});
