const assert = require('assert');
const app = require('../../src/app');

describe('\'domains\' service', () => {
  
  let systemService;
  let system;
  let service;
  let newEntry;
  let patchedEntry;

  before(async () => {
    // Create System
    systemService = await app.service('systems');
    system = await systemService.create({
      name: 'DomainsTest-System'
    });
  });

  it('registered "domains" service', async () => {
    service = await app.service('domains');

    assert.ok(service, 'Registered the service');
  });

  it('created a domain entry', async () => {
    newEntry = await service.create({
      systemId: system.id,
      name: 'DomainsTest-Domain',
      shorthand: 'DT-D'
    });

  });
  
  it('patched an entry', async () => {
    patchedEntry = await service.patch(newEntry.id, { name: 'newName' });
    console.log('Patched Entry:', patchedEntry);

    assert.ok(patchedEntry.name === 'newName', 'Did not patch an entry');
    assert.ok(patchedEntry.version === '0.1', 'Did not increment minor version number');
    
    const sys = await systemService.get(patchedEntry.systemId);
    assert.ok(sys.version === '0.0', 'Incremented major version number for parent');
  });

  it('removed an entry', async () => {
    const res = await service.remove(patchedEntry.id);
    console.log('removed entry:', res);

    assert.ok(res.id, 'entry was not removed');
    const sys = await systemService.get(patchedEntry.systemId);
    assert.ok(sys.version === '1.0', 'Did not increment major version number for parent');
  });

  // TODO

  // Add parent domain

  // Remove parent domain, check if in use???
  // Should removing a parent domain increment major verison??? probably

  // 




  // eslint-disable-next-line no-constant-condition
  if('bla', () => {
    assert.ok(newEntry.name === 'DomainsTest-Domain', 'bla');
  });

});