const assert = require('assert');
const app = require('../../src/app');

describe('\'properties\' service', () => {
  let system;
  let domain;
  let service;
  let domainService;
  let id_rawValue;
  let newEntry_rawValue;
  // let patchedEntry_rawValue;

  before(async () => {
    // Register properties service
    service = app.service('properties');
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
    assert.ok(service, 'Registered the service');
  });

  // Raw value
  it('created an entry of ref type raw_value', async () => {
    newEntry_rawValue = await service.create({
      system_id: system.id,
      domain_id: domain.id,
      name: 'testProperty',
      default_value: '1',
      data_type: 'int',
      reference_type: 'raw_value'
    });
    id_rawValue = newEntry_rawValue.id;
    console.log('new entry:', newEntry_rawValue);

    assert.ok(newEntry_rawValue.id, 'Did not create an entry');
  });

  // it('patched an entry of ref type raw_value', async () => {
  //   patchedEntry_rawValue = await service.patch(newEntry_rawValue.id, { name: 'altTestProperty' });
  //   console.log('Patched Entry:', patchedEntry_rawValue);

  //   assert.ok(patchedEntry_rawValue.name === 'altTestProperty', 'Did not patch an entry');
  //   assert.ok(patchedEntry_rawValue.version === '0.1', 'Did not increment minor version number');
  // });

  // it('removed an entry of ref type raw_value', async () => {
  //   const res = await service.remove(patchedEntry_rawValue.id);
  //   console.log('removed entry:', res);
  //   assert.ok(res.id, 'entry was not removed');
  //   const domain = await domainService.get(res.domain_id);
  //   console.log('major version increment domain:', domain);
  //   assert.ok(domain.version === '1.0');
  // });

  // Property ref
  it('created an entry of ref type property (direct lookup)', async () => {
    newEntry_rawValue = await service.create({
      system_id: system.id,
      domain_id: domain.id,
      name: 'testProperty',
      data_type: 'int',
      reference_type: 'property',
      reference: id_rawValue
    });
    console.log('new entry:', newEntry_rawValue);

    assert.ok(newEntry_rawValue.id, 'Did not create an entry');
  });

  // it('read referenced entry of entry ref type property (direct lookup)', async () => {
  //   const refValue = await service
  // });


  // it('patched an entry of ref type raw_value', async () => {
  //   patchedEntry_rawValue = await service.patch(newEntry_rawValue.id, { name: 'altTestProperty' });
  //   console.log('Patched Entry:', patchedEntry_rawValue);

  //   assert.ok(patchedEntry_rawValue.name === 'altTestProperty', 'Did not patch an entry');
  //   assert.ok(patchedEntry_rawValue.version === '0.1', 'Did not increment minor version number');
  // });

  // it('removed an entry of ref type raw_value', async () => {
  //   const res = await service.remove(patchedEntry_rawValue.id);
  //   console.log('removed entry:', res);
  //   assert.ok(res.id, 'entry was not removed');
  //   const domain = await domainService.get(res.domain_id);
  //   console.log('major version increment domain:', domain);
  //   assert.ok(domain.version === '1.0');
  // });
  

});
