const assert = require('assert');
const app = require('../../src/app');

describe('\'properties\' service', () => {
  let system;
  let domain;
  let service;
  let domainService;
  let rawValueService;
  let idRawValue;
  let newPropertyRawValue;
  let newPropertyDirectLookup;
  let newPropertyFunction;
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
      systemId: system.id,
      name: 'test'
    });

    // Raw values
    rawValueService = app.service('raw-values');
  });

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  // Raw value
  it('created an entry of ref type raw_value with default value', async () => { 
    newPropertyRawValue = await service.create({
      systemId: system.id,
      domainId: domain.id,
      name: 'testProperty',
      dataType: 'int',
      referenceType: 'raw_value',
      // Passed as data for raw values for hook, not to be peristed in properties
      defaultValue: '1'
    });

    // Should probably be made in one call
    // Though seems feathers is not made for large single calls
    // "Hooks are commonly used to handle things like validation, logging, populating related entities,"
    // So i guess could be done by hooks 
    // const rawVal = await raw_valueService.create({
    //   propertyId: newEntry_rawValue.id,
    //   defaultValue: '1'
    // });
    idRawValue = newPropertyRawValue.id;
    console.log('new entry:', newPropertyRawValue);
    const rawVal = await rawValueService.get(newPropertyRawValue.id);
    assert.ok(newPropertyRawValue.id, 'Did not create an entry');
    assert.ok(rawVal.propertyId, 'Did not create a raw value for entry');
    console.log('Defaultvalue: ', rawVal.defaultValue);
    assert.ok(rawVal.defaultValue === '1', 'Default value for raw value was not as expecteds');

  });

  // Raw value
  it('created an entry of ref type raw_value without default value', async () => { 
    newPropertyRawValue = await service.create({
      systemId: system.id,
      domainId: domain.id,
      name: 'testProperty',
      dataType: 'int',
      referenceType: 'raw_value',
      // Passed as data for raw values for hook, not to be peristed in properties
    });

    // Should probably be made in one call
    // Though seems feathers is not made for large single calls
    // "Hooks are commonly used to handle things like validation, logging, populating related entities,"
    // So i guess could be done by hooks 
    // const rawVal = await raw_valueService.create({
    //   propertyId: newEntry_rawValue.id,
    //   defaultValue: '1'
    // });
    idRawValue = newPropertyRawValue.id;
    console.log('new entry:', newPropertyRawValue);
    const rawVal = await rawValueService.get(newPropertyRawValue.id);
    assert.ok(newPropertyRawValue.id, 'Did not create an entry');
    assert.ok(rawVal.propertyId, 'Did not create a raw value for entry');
    console.log('Defaultvalue: ', rawVal.defaultValue);
    assert.ok(rawVal.defaultValue === null, 'Default value was not empty');

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
    newPropertyDirectLookup = await service.create({
      system_id: system.id,
      domain_id: domain.id,
      name: 'testProperty',
      dataType: 'int',
      referenceType: 'property',
    });
    console.log('new entry:', newPropertyRawValue);

    assert.ok(newPropertyRawValue.id, 'Did not create an entry');
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
