const assert = require('assert');
const app = require('../../src/app');

describe('\'properties\' service', () => {
  // eslint-disable-next-line no-unused-vars
  let sequelize;
  let system;
  let domainSome;
  let domainOther;
  let propertiesService;
  let domainsService;
  // eslint-disable-next-line no-unused-vars
  let functionsService;
  let rawValuesService;
  // eslint-disable-next-line no-unused-vars
  let idRawValue;
  let newPropertyRawValue;
  // eslint-disable-next-line no-unused-vars
  let newPropertyDirectLookup;
  let newPropertyFunction;
  let newPropertyDomain;
  // let patchedEntry_rawValue;

  before(async () => {
    sequelize = await app.get('sequelize');
    // Register properties service
    propertiesService = app.service('properties');
    // Create System
    const systemService = app.service('systems');
    system = await systemService.create({
      name: 'PropertyTest-System'
    });

    // Create Domain
    domainsService = app.service('domains');
    domainSome = await domainsService.create({
      systemId: system.id,
      name: 'PropertyTest-DomainSome'
    });
    domainOther = await domainsService.create({
      systemId: system.id,
      name: 'PropertyTest-DomainOther'
    });

    // Functions service
    functionsService = app.service('functions');

    // Raw values
    rawValuesService = app.service('raw-values');
  });

  it('registered the service', () => {
    assert.ok(propertiesService, 'Registered the service');
  });

  context('property with ref type raw_value', () => {

    // Raw value with default val
    it('created an entry, with auto created raw_value entry', async () => {
      newPropertyRawValue = await propertiesService.create({
        systemId: system.id,
        domainId: domainSome.id,
        name: 'PropertyTest-RawValue',
        dataType: 'int',
        referenceType: 'raw_value',
        // propertyReference: { domainId: domainSome.id },
        // Passed as data for raw values for hook, not to be peristed in properties
        // defaultValue: '1'
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
      // assert.ok(rawVal.defaultValue === '1', 'Default value for raw value was not as expecteds');
    });

    it('added default value to entry', async () => {
      const rawValue = await propertiesService.setDefaultValue(newPropertyRawValue.id, '1')
        .catch((err) => {
          console.log(err);
        });

      assert.ok(rawValue.propertyId === newPropertyRawValue.id, 'raw value entry is not associated with the property');
      assert.ok(rawValue.defaultValue === '1', 'raw value entry defualt value is not correct');
    });

    it('did not create property with same name', async () => {
      // Maybe handle promise instead of using assert.rejects
      await assert.rejects(propertiesService.create({
        systemId: system.id,
        domainId: domainSome.id,
        name: 'PropertyTest-RawValue',
        dataType: 'int',
        referenceType: 'raw_value',
        // propertyReference: { domakinId: domainSome.id },
        // defaultValue: '1'
      }),
      { name: 'BadRequest'},
      'Did not throw a BadRequest error on duplicate names'
      );

      // Also check reference not made???
    });

  });



  // // Raw value without default val
  // it('created an entry of ref type raw_value without default value', async () => {
  //   newPropertyRawValue = await propertiesService.create({
  //     systemId: system.id,
  //     domainId: domainSome.id,
  //     name: 'PropertyTest-RawValue-NoDefault',
  //     dataType: 'int',
  //     referenceType: 'raw_value',
  //     // propertyReference: { domainId: domainSome.id },
  //     // Did not pass default value, so will still make a corresponding raw_value entry, but without a defualt value
  //   });

  //   // Should probably be made in one call
  //   // Though seems feathers is not made for large single calls
  //   // "Hooks are commonly used to handle things like validation, logging, populating related entities,"
  //   // So i guess could be done by hooks
  //   // const rawVal = await raw_valueService.create({
  //   //   propertyId: newEntry_rawValue.id,
  //   //   defaultValue: '1'
  //   // });
  //   idRawValue = newPropertyRawValue.id;
  //   const rawVal = await rawValuesService.get(newPropertyRawValue.id);
  //   assert.ok(newPropertyRawValue.id, 'Did not create an entry');
  //   assert.ok(rawVal.propertyId, 'Did not create a raw value for entry');
  //   assert.ok(rawVal.defaultValue === null, 'Default value was not empty');

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

  context('property of ref type property (direct lookup)', () =>
  {
    it('created an entry', async () => {
      newPropertyDirectLookup = await propertiesService.create({
        systemId: system.id,
        domainId: domainSome.id,
        name: 'PropertyTest-Property',
        dataType: 'int',
        referenceType: 'property',
        // propertyReference: {
        //   propertyId: newPropertyRawValue.id,
        //   domainId: newPropertyRawValue.domainId
        // }
      });

      assert.ok(newPropertyDirectLookup.id, 'Did not create an entry');
      // const propRef = await sequelize.models.properties_properties.findOne({
      //   where: {
      //     property_id: newPropertyDirectLookup.id
      //   }
      // });
      // assert.ok(propRef.propertyId, 'Did not create reference in properties_properties');
      // assert.ok(propRef.propertyReferenceId === newPropertyRawValue.id, 'Did not add correct reference in properties_properties');
    });

    it('created a reference to raw_value property', async () =>
    {
      const propRef = await propertiesService.patch(
        newPropertyDirectLookup.id,
        {}, // Empty since only other data is to be updated
        {
          data: {
            referenceId: newPropertyRawValue.id,
            referenceType: newPropertyDirectLookup.referenceType
          }
        }
      );

      // const propRef = await propertiesService.setReference(
      //   newPropertyDirectLookup.referenceType,
      //   newPropertyRawValue.id);

      assert.ok(propRef.propertyId === newPropertyDirectLookup.id);
      assert.ok(propRef.propertyReferenceId === newPropertyRawValue.id);
    } );

    // it('did not create an entry of ref type property (direct lookup), missing domain ref', async () => {
    //   newPropertyDirectLookup = await assert.rejects(
    //     propertiesService.create({
    //       systemId: system.id,
    //       domainId: domainSome.id,
    //       name: 'PropertyTest-Property-Fail',
    //       dataType: 'int',
    //       referenceType: 'property',
    //       propertyReference: {
    //         propertyId: newPropertyRawValue.id,
    //         // domainId: newPropertyRawValue.domainId
    //       }
    //     }),
    //     {
    //       name: 'MissingDomainReference'
    //     },
    //     'Did not reject with MissingDomainReference'
    //   );
    // });

  });

  context('property with ref type function', () => {
    it('created an entry', async () => {
      newPropertyFunction = await propertiesService.create({
        systemId: system.id,
        domainId: domainSome.id,
        name: 'PropertyTest-PropertyFunction',
        dataType: 'int',
        referenceType: 'function',
        // propertyReference: {
        //   functionId: newFunction.id,
        //   domainId: newFunction.domainId
        // }  //newFunction.id
      });

      assert.ok(newPropertyFunction.id, 'Did not create a new property with reference type function');

    });

    it('created a reference to function', async () => {
      const newFunction = await functionsService.create({
        systemId: system.id,
        domainId: domainSome.id,
        name: 'PropertyTest-Function',
        dataType: 'int',
        functionType: 'equation',
        definition: 'x + 1',
      });

      const propertyFunctionReference = await propertiesService.setReference(
        newPropertyFunction.id,
        newPropertyFunction.referenceType,
        newFunction.id
      );

      assert.ok(propertyFunctionReference.propertyId, 'Did not create a reference between property and function');
      assert.ok(propertyFunctionReference.functionId === newFunction.id, 'Did not create a reference between property and function');
    });
  });



  // // OBS
  // // Currently you can create a property with an unset type, possible what we want so you can keep editing without losing stuff
  // // But when creating with the service it does not return the single entry that technically is createds
  // // 'should fail when attempting to create an entry of ref type domains, without domain dependency'
  // it('created new invalid entry of ref type domain, the property is created but the reference was not, because of lacking domain dependencies', async () => {
  //   // let newPropertyDomain;
  //   // eslint-disable-next-line no-unused-vars
  //   // const newInvalidProperty = await propertiesService.create({
  //   //   systemId: system.id,
  //   //   domainId: domainSome.id,
  //   //   name: 'PropertyTest-PropertyDomain-NoDependency',
  //   //   dataType: 'int',
  //   //   referenceType: 'domain',
  //   //   propertyReference: domainOther.id
  //   // }).catch((reason) => {
  //   //   assert.ok(reason.name == 'BadReferenceError', 'Hook: set-property-reference-type did not throw BadReferenceError');
  //   // });

  //   // assert.ok(newInvalidProperty.id, 'Did not get the created invalid property');


  //   const promise = propertiesService.create({
  //     systemId: system.id,
  //     domainId: domainSome.id,
  //     name: 'PropertyTest-PropertyDomain-NoDependency',
  //     dataType: 'int',
  //     referenceType: 'domain',
  //     propertyReference: { domainId: domainOther.id }
  //   });

  //   promise.then((newInvalidProperty) => {
  //     console.log('INVALID REF DOMAIN', newInvalidProperty);
  //     assert.ok(newInvalidProperty.id, 'Did not get the created invalid property');
  //   });

  //   promise.catch((reason) => {
  //     assert.ok(reason.name == 'BadReferenceError', 'Hook: set-property-reference-type did not throw BadReferenceError');
  //     // So here you would prompt a user to select another domain from domain dependencies
  //   });

  //   await promise;

  // });
  /*.then((newPropertyDomain) => {
      sequelize.models.property_domain_enums.findOne({
        where: {
          propertyId: newPropertyDomain.id
        }
      });
    }).then((propertyDomainReference) => {
      assert.ok(propertyDomainReference.propertyId === null, 'Created a reference between property and domain, when there should no be one');
    });*/

  // assert.rejects(propertiesService.create({
  //   systemId: system.id,
  //   domainId: domainSome.id,
  //   name: 'PropertyTest-PropertyDomain-NoDepndency',
  //   dataType: 'int',
  //   referenceType: 'domain',
  //   propertyReference: domainOther.id
  // }).then((newPropertyDomain) => {
  //   sequelize.models.property_domain_enums.findOne({
  //     where: {
  //       propertyId: newPropertyDomain.id
  //     }
  //   }).then((propertyDomainReference) => {
  //     assert.ok(propertyDomainReference.propertyId === null, 'Created a reference between property and domain, when there should no be one');
  //   });
  // }),
  // { name: 'BadRequest' },
  // // { name: 'BadReferenceError'},
  // 'Created a property domain reference, even when the domain was not in the properties domain dependencies'
  // );

  // if (newPropertyDomain)
  // {
  //   const propertyDomainReference = await sequelize.models.property_domain_enums.findOne({
  //     where: {
  //       propertyId: newPropertyDomain.id
  //     }
  //   });
  //   assert.ok(propertyDomainReference.propertyId === null, 'Created a reference between property and domain, when there should no be one');
  // }
  // assert.ok(propertyDomainReference.domainId === newDomain.id, 'Did not create a reference between property and domain');
  // });

  context('property with ref type domain', () => {

    it('created an entry', async () => {
      // Adds newDomain as dependency to domain
      // await domainsService.addDependency(domainSome, domainOther);

      newPropertyDomain = await propertiesService.create({
        systemId: system.id,
        domainId: domainSome.id,
        name: 'PropertyTest-PropertyDomain',
        dataType: 'int',
        referenceType: 'domain',
        // propertyReference: { domainId: domainOther.id }
      });

      assert.ok(newPropertyDomain.id, 'did not create a property of ref type domain');
    });

    it('created a reference to other domain', async () => {
      const propertyDomainReference = await propertiesService.setReference(
        newPropertyDomain.id,
        newPropertyDomain.referenceType,
        domainOther.id);

      assert.ok(propertyDomainReference.propertyId, 'Did not create a reference between property and domain');
      assert.ok(propertyDomainReference.domainId === domainOther.id, 'Did not create a reference between property and domain');
    });

    it('did not create an entry of ref type domains, because of missing dependency', async () => {
      // Adds newDomain as dependency to domain
      // domainsService.addDependency(domainSome, domainOther);
      await assert.rejects(propertiesService.create({
        systemId: system.id,
        domainId: domainOther.id,
        name: 'PropertyTest-PropertyDomain-Fail',
        dataType: 'int',
        referenceType: 'domain',
        propertyReference: { domainId: domainSome.id }
      }),
      {
        name: 'MissingDomainReference'
      },
      'Did not reject with MissingDomainReference'
      );

    });

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
