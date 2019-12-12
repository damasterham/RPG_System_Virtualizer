const assert = require('assert');
const app = require('../../src/app');

describe('\'properties\' service', () => {
  let sequelize;
  let system;
  let domain;
  let propertiesService;
  let domainsService;
  let functionsService;
  let rawValuesService;
  // eslint-disable-next-line no-unused-vars
  let idRawValue;
  let newPropertyRawValue;
  // eslint-disable-next-line no-unused-vars
  let newPropertyDirectLookup;
  // let newPropertyFunction;
  // let patchedEntry_rawValue;

  before(async () => {
    sequelize = await app.get('sequelize');
    // Register properties service
    propertiesService = app.service('properties');
    // Create System
    const systemService = app.service('systems');
    system = await systemService.create({
      name: 'test'
    });

    // Create Domain
    domainsService = app.service('domains');
    domain = await domainsService.create({
      systemId: system.id,
      name: 'test'
    });

    // Functions service
    functionsService = app.service('functions');

    // Raw values
    rawValuesService = app.service('raw-values');
  });

  it('registered the service', () => {
    assert.ok(propertiesService, 'Registered the service');
  });

  // Raw value with default val
  it('created an entry of ref type raw_value with default value', async () => {
    newPropertyRawValue = await propertiesService.create({
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
    const rawVal = await rawValuesService.get(newPropertyRawValue.id);
    assert.ok(newPropertyRawValue.id, 'Did not create an entry');
    assert.ok(rawVal.propertyId, 'Did not create a raw value for entry');
    assert.ok(rawVal.defaultValue === '1', 'Default value for raw value was not as expecteds');

  });

  // Raw value without default val
  it('created an entry of ref type raw_value without default value', async () => {
    newPropertyRawValue = await propertiesService.create({
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
    const rawVal = await rawValuesService.get(newPropertyRawValue.id);
    assert.ok(newPropertyRawValue.id, 'Did not create an entry');
    assert.ok(rawVal.propertyId, 'Did not create a raw value for entry');
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
    newPropertyDirectLookup = await propertiesService.create({
      systemId: system.id,
      domainId: domain.id,
      name: 'testProperty',
      dataType: 'int',
      referenceType: 'property',
      propertyReference: newPropertyRawValue.id
    });

    assert.ok(newPropertyDirectLookup.id, 'Did not create an entry');
    const propRef = await sequelize.models.properties_properties.findOne({
      where: {
        property_id: newPropertyDirectLookup.id
      }
    });
    assert.ok(propRef.propertyId, 'Did not create reference in properties_properties');
    assert.ok(propRef.propertyReferenceId === newPropertyRawValue.id, 'Did not add correct reference in properties_properties');
  });


  it('created an entry of ref type function with reference', async () => {
    const newFunction = await functionsService.create({
      systemId: system.id,
      domainId: domain.id,
      name: 'PropertyTest-Function',
      dataType: 'int',
      functionType: 'equation',
      definition: 'x + 1',
    });

    const newPropertyFunction = await propertiesService.create({
      systemId: system.id,
      domainId: domain.id,
      name: 'PropertyTest-PropertyFunction',
      dataType: 'int',
      referenceType: 'function',
      propertyReference: newFunction.id
    });

    assert.ok(newPropertyFunction.id, 'Did not create a new property with reference type function');

    const propertyFunctionReference = await sequelize.models.properties_functions.findOne({
      where: {
        propertyId: newPropertyFunction.id
      }
    });
    assert.ok(propertyFunctionReference.propertyId, 'Did not create a reference between property and function');
    assert.ok(propertyFunctionReference.functionId === newFunction.id, 'Did not create a reference between property and function');
  });

  it('failed when attempting to create an entry of ref type domains, without domain dependency', async () => {
    const newDomain = await domainsService.create({
      systemId: system.id,
      name: 'otherDomain'
    });

    const newPropertyDomain = await propertiesService.create({
      systemId: system.id,
      domainId: domain.id,
      name: 'PropertyTest-PropertyDomain',
      dataType: 'int',
      referenceType: 'domain',
      propertyReference: newDomain.id
    });

    const propertyDomainReference = await sequelize.models.property_domain_enums.findOne({
      where: {
        propertyId: newPropertyDomain.id
      }
    });

    assert.ok(propertyDomainReference.propertyId === null, 'Created a reference between property and domain, when there should no be one');
    // assert.ok(propertyDomainReference.domainId === newDomain.id, 'Did not create a reference between property and domain');
  });

  it('created an entry of ref type domains', async () => {
    const newDomain = await domainsService.create({
      systemId: system.id,
      name: 'otherDomain'
    });

    // Adds newDomain as dependency to domain
    domainsService.addDependency(domain, newDomain);

    const newPropertyDomain = await propertiesService.create({
      systemId: system.id,
      domainId: domain.id,
      name: 'PropertyTest-PropertyDomain',
      dataType: 'int',
      referenceType: 'domain',
      propertyReference: newDomain.id
    });

    const propertyDomainReference = await sequelize.models.property_domain_enums.findOne({
      where: {
        propertyId: newPropertyDomain.id
      }
    });

    assert.ok(propertyDomainReference.propertyId, 'Did not create a reference between property and domain');
    assert.ok(propertyDomainReference.domainId === newDomain.id, 'Did not create a reference between property and domain');
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
