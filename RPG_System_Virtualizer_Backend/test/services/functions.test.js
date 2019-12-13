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
      name: 'FunctionTests-System'
    });

    // Create Domain
    domainService = app.service('domains');
    domain = await domainService.create({
      system_id: system.id,
      name: 'FunctionTests-Domain'
    });
  });

  it('registered the service', () => {
    assert.ok(service, 'Did not register the service');
  });

  it('created an entry', async () => {
    newEntry = await service.create({
      systemId: system.id,
      domainId: domain.id,
      name: 'testFunction',
      definition: '6 / 2',
      dataType: 'int',
      functionType: 'equation'
    });

    assert.ok(newEntry.id, 'Did not create an entry');
  });

  it('patched an entry', async () => {
    patchedEntry = await service.patch(newEntry.id, { name: 'newName' });
    ('Patched Entry:', patchedEntry);

    assert.ok(patchedEntry.name === 'newName', 'Did not patch an entry');
    assert.ok(patchedEntry.version === '0.1', 'Did not increment minor version number');
  });

  it('removed an entry', async () => {
    const res = await service.remove(patchedEntry.id);
    assert.ok(res.id, 'entry was not removed');
    const domain = await domainService.get(res.domain_id);
    assert.ok(domain.version === '1.0');
  });
});
