/* eslint-disable require-atomic-updates */
const assert = require('assert');
const app = require('../../src/app');
const mathjs = require('mathjs');

describe('\'functions\' service', () => {
  let system;
  let domain;
  let property;
  let functionService;
  let variableService;
  let propertyService;
  let rawValueService;
  let domainService;
  // let newEntry;
  // let patchedEntry;

  before(async () => {
    functionService = app.service('functions');
    variableService = app.service('variables');

    // Create System
    const systemService = app.service('systems');
    system = await systemService.create({
      name: 'FunctionTests-System'
    });

    // Create Domain
    domainService = app.service('domains');
    domain = await domainService.create({
      systemId: system.id,
      name: 'FunctionTests-Domain'
    });

    // Create random Prop
    propertyService = app.service('properties');
    rawValueService = app.service('raw-values');
    property = await propertyService.create({
      systemId: system.id,
      domainId: domain.id,
      referenceType: 'raw_value',
      name: 'FunctionsTests-Property',
      dataType: 'int'
    });
    property.reference = await rawValueService.create({
      propertyId: property.id,
    });


    // property.reference = await propertyService.patch(
    //   property.id,
    //   {},
    //   {
    //     query: {
    //       data: {
    //         propertyId: property.id,
    //       }
    //     }
    //   }
    // );

  });

  it('registered the service', () => {
    assert.ok(functionService, 'Did not register the service');
  });

  // Should be invalid, as fucton must take at least 1 parameter
  context('Equations', () => {
    context ('without variables', () => {
      let entry;
      let withEquation;

      it('Created an entry', async () => {
        entry = await functionService.create({
          systemId: system.id,
          domainId: domain.id,
          name: 'TestFunction-Equation-NoVariable',
          // definition: '6 / 2',
          dataType: 'int',
          functionType: 'equation'
        });

        assert.ok(entry.id, 'Did not create an entry');
      });

      it('Patched an entry with an equation definition', async () => {
        withEquation = await functionService.patch(entry.id, {
          definition: '2 + 3'
        });

        assert.equal(withEquation.definition, '2 + 3', 'Was not the correct definition');
      });

      it ('Calculated the equation', async () => {
        assert.equal(mathjs.evaluate(withEquation.definition), 5, 'Did not evaluate correcly');
      });
    });

    context('with 1 variable', () => {
      let entry;
      let withEquation;
      let variable;
      let variableWithRef;

      it('Created an entry', async () => {
        entry = await functionService.create({
          systemId: system.id,
          domainId: domain.id,
          name: 'TestFunction-Equation-OneVariable',
          dataType: 'int',
          functionType: 'equation'
        });
        assert.ok(entry.id, 'Did not create an entry');
      });

      it('Patched an entry with equation', async () => {
        withEquation = await functionService.patch(entry.id, {
          definition: 'x + 2' // variable is x
        });
        assert.equal(withEquation.definition, 'x + 2', 'Was not the correct definition');
      });

      it ('Added variable to function', async () => {
        variable = await variableService.create({
          systemId: system.id,
          domainId: domain.id,
          functionId: withEquation.id, // ref to function
          name: 'x', // Will be unique a unique variable for the function
          dataType: withEquation.dataType,
        });

        assert.ok(variable.id, 'Did not create variable');
      });

      it('Patches variable with specific references', async () => {
        variableWithRef = await variableService.patch(
          variable.id,
          { referenceType: 'property' },
          { query: { data: { referenceId: property.id } } }
        );
        assert.ok(variableWithRef.id, 'Is not same variable');
        assert.equal(variableWithRef.reference.referenceId, property.id, 'Did not set reference correct');
      });
      // Caluculation with varialbes will have to work on instances

    });
  });
  // it('patched an entry', async () => {
  //   patchedEntry = await service.patch(newEntry.id, { name: 'newName' });
  //   ('Patched Entry:', patchedEntry);

  //   assert.ok(patchedEntry.name === 'newName', 'Did not patch an entry');
  //   assert.ok(patchedEntry.version === '0.1', 'Did not increment minor version number');
  // });

  // it('removed an entry', async () => {
  //   const res = await service.remove(patchedEntry.id);
  //   assert.ok(res.id, 'entry was not removed');
  //   const domain = await domainService.get(res.domain_id);
  //   assert.ok(domain.version === '1.0');
  // });
});
