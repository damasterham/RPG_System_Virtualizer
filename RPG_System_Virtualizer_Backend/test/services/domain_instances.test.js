/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-vars */
const assert = require('assert');
const app = require('../../src/app');

describe('\'domain_instances\' service', () => {

  let systemService;
  let domainService;
  let domainDependencyService;
  let propertyService;
  let rawValueService;
  let functionService;
  let variableService;
  let propertySpecificVariableService;
  let domainInstanceService;
  let domainDependencyInstanceService;
  let propertyInstanceService;
  let rawValueInstanceService;
  let functionInstanceService;

  before(async () => {
    systemService = await app.service('systems');
    domainService = await app.service('domains');
    domainDependencyService = await app.service('domain-dependencies');
    propertyService = await app.service('properties');
    rawValueService = await app.service('raw-values');
    functionService = await app.service('functions');
    variableService = await app.service('variables');
    propertySpecificVariableService = await app.service('property-specific-variables');

    domainInstanceService = await app.service('domain-instances');
    domainDependencyInstanceService = await app.service('domain-dependency-instances');
    propertyInstanceService = await app.service('property-instances');
    rawValueInstanceService = await app.service('raw-value-instances');
  });

  it('registered the service', () => {
    const service = app.service('domain-instances');

    assert.ok(service, 'Registered the service');
  });

  context('D&D RPG System', () => {
    let dnd;
    it('Created D&D as a System', async () => {
      dnd = await systemService.create({
        name: 'D&D'
      });
      assert.ok(dnd.id, 'Did not create the system');
    });
    context('Character Sheet', () => {
      const att = ['Strength', 'Dexterity', 'Constitution', 'Wisdom', 'Intelligence', 'Charisma'];
      let attributes;
      let modifiers;
      context('Definition',() => {
        // Attributes
        it('Created Domain Attributes', async () => {
          attributes = await domainService.create({
            systemId: dnd.id,
            name: 'Attributes'
          });
          assert.ok(attributes.id, 'Did no create the domain');
        });
        it('Added Raw Value properties, Properties: Str, Dex, Con, Wis, Int, Cha', async () => {
          for (let index = 0; index < att.length; index++) {
            const element = att[index];
            attributes[element] = await propertyService.create({
              systemId: dnd.id,
              domainId: attributes.id,
              name: element,
              dataType: 'int',
              referenceType: 'raw_value'
            });
            assert.ok(attributes[element].id, `Did not create property: ${element}`);
          }
        });
        // Modifiers
        it('Created Domain AttributeModifiers', async () => {
          modifiers = await domainService.create({
            systemId: dnd.id,
            name: 'AttributeModifiers'
          });
          assert.ok(modifiers.id, 'Did no create the domain');
        });
        it('Added Attribute as dependency to AttributeModifiers', async () => {
          modifiers.dependencies = [];
          modifiers.dependencies.push(await domainDependencyService.create({
            domainId: modifiers.id,
            domainDependencyId: attributes.id
          }));
          assert.ok(modifiers.dependencies.length === 1, 'Did not add dependency');
        });
        it('Added property reference properties, Properties: Str, Dex, Con, Wis, Int, Cha', async () => {
          for (let index = 0; index < att.length; index++) {
            const element = att[index];
            modifiers[element] = await propertyService.create({
              systemId: dnd.id,
              domainId: modifiers.id,
              name: element + ' Modifier',
              dataType: 'int',
              referenceType: 'function'
            });
            assert.ok(modifiers[element].id, `Did not create property: ${element} Modifier`);
          }
        });
        it('Added CalculateModifier function', async () => {
          modifiers.calculateModifier = await functionService.create({
            systemId: dnd.id,
            domainId: modifiers.id,
            name: 'CalculateModifier',
            dataType: 'int',
            functionType: 'equation'
          });
          assert.ok(modifiers.calculateModifier.id, 'Did not create function');
        });
        it('Added variable to CalculateModifier function', async () => {
          modifiers.calculateModifier.variables = [];
          modifiers.calculateModifier.variables.push(
            await variableService.create({
              systemId: dnd.id,
              domainId: modifiers.id,
              functionId: modifiers.calculateModifier.id,
              name: 'x',
              dataType: modifiers.calculateModifier.dataType,
              referenceType: 'property' // attribute type
            })
          );
          assert.ok(modifiers.calculateModifier.variables.length === 1, 'Did not create variable');
          assert.ok(modifiers.calculateModifier.variables[0].id, 'Did not create variable');
        });
        it('Sets CalculateModifiers variable to Attribute domain', async () => {
          modifiers.calculateModifier.variables[0].reference = await variableService.patch(
            modifiers.calculateModifier.variables[0].id, // x
            {
              referenceType: 'domain'
            },
            {
              query: {
                data: {
                  referenceId: modifiers.dependencies[0].domainId // attributes
                }
              }
            }
          );
          assert.ok(modifiers.calculateModifier.variables[0].reference.domainId, 'Did not create variable for CalculateMdodifiers function');
        });
        it('Sets modifier properties\' function to CalculateModifier', async () => {
          for (let index = 0; index < att.length; index++) {
            const element = att[index];

            modifiers[element].reference = await propertyService.patch(
              modifiers[element].id,
              {
                fullTest: true
              },
              {
                query: {
                  data: {
                    referenceId: modifiers.calculateModifier.id,
                    referenceType: modifiers[element].referenceType // func
                  }
                }
              }
            );

            assert.equal(
              modifiers[element].reference.propertyId,
              modifiers[element].id,
              `Did not set property reference: ${element} Modifier correctly`);

            assert.equal(
              modifiers[element].reference.referenceId,
              modifiers.calculateModifier.id,
              'Did not set property reference function correctly');
          }
        });
        it('Sets specific variables references for property functions, since domain', async () => {
          for (let index = 0; index < att.length; index++) {
            const element = att[index];
            modifiers[element].variable = await propertySpecificVariableService.create({
              propertyId: modifiers[element].id,
              // search psuedo -> variableId: from modifiers.functions where modifiers.[element].reference.referenceId === modifier.functions.functionId
              variableId: modifiers.calculateModifier.variables[0].id, // where x
              // propertyReferenceId: modifiers.dependencies[0][element].id // [attributes][str,dex,...]
              propertyReferenceId: attributes[element].id
            });

            // variableService.setReference(
            //   //id
            //   // ref type
            //   // ref id
            // );
            assert.ok(modifiers[element].variable.propertyId, 'Did not set specific variable reference');
            assert.ok(modifiers[element].variable.propertyReferenceId, 'Did not set specific variable reference');
          }
          assert.ok(true, 'Woop');
        });
        it('Created a Domain Collection of Attributes and Modifiers, to bind them when instanced', async () => {

        });

        // it('Set property reference from AttributeModfiers to Attributes', async () => {
        //   // modifiers.properties_properties = [];
        //   for (let index = 0; index < att.length; index++) {
        //     const element = att[index];

        //     // modifiers.properties_properties.push(
        //     modifiers[element].reference = await propertyService.patch(modifiers[element].id, {}, {
        //       data: {
        //         referenceId: attributes[element].id,
        //         referenceType: modifiers[element].referenceType
        //       }
        //     });
        //     // );

        //     assert.equal(modifiers[element].reference.propertyId, modifiers[element].id,
        //       `Did not set property reference: ${element} Modifier correctly`);
        //     assert.equal(modifiers[element].reference.propertyReferenceId, attributes[element].id,
        //       `Did not set property reference: ${element} correctly`);
        //   }

        //   assert.ok(true, 'Woop!');
        // });



        // UI will use domains to create forms for input, so you will input what is possibles
        // based on a domain

      });

      context('Instantiation', () => {
        context('Bob\'s Character Sheet', () => {
          const attArr = [16,10,14,8,11,15];
          let bobsAttributes;
          let bobsModifiers;
          it('Created an instance of Attributes', async () => {
            // Attributes
            bobsAttributes = await domainInstanceService.create({
              domainId: attributes.id
            });
            assert.ok(bobsAttributes.domainId, 'Did not create an instance of Attributes');
          });
          // Get the properties of the domain and create a new properties for bob
          it('Created instanced properties for Attributes', async () => {
            for (let index = 0; index < att.length; index++) {
              const element = att[index];
              bobsAttributes[element] = await propertyInstanceService.create({
                propertyId: attributes[element].id
              });
              assert.ok(bobsAttributes[element].id, 'Did not create property');
            }
          });
          // UI Gets the properties type references and displays if user input is to be made
          it('Gets the instanced properties references', async () => {
            for (let index = 0; index < att.length; index++) {
              const element = att[index];
              if(bobsAttributes[element].referenceType === 'raw_value') {
                bobsAttributes[element].reference = rawValueService.get(bobsAttributes[element].id);
              }

              assert.ok(bobsAttributes[element].id, 'Did not create property');
            }
          });
          // Default fill
          it('Creates raw values for properties Attributes, with defaults', async () => {
            for (let index = 0; index < att.length; index++) {
              const element = att[index];
              // Hook add default value if present
              bobsAttributes[element].instancedReference = await rawValueInstanceService.create({});
              assert.ok(bobsAttributes[element].id, 'Did not create property');
            }
          });
          // User actually fills in values
          it('Patches raw values of properties Attributes'), async () => {
            for (let index = 0; index < att.length; index++) {
              const element = att[index];
              bobsAttributes[element].instancedReference = await rawValueInstanceService.patch({
                value: attArr[index]
              });

              // assert.equal(bobsAttributes[element].value, attArr[index], `Attribute ${element} was not ${attArr[index]}`);
            }
          };

          // Cheat and assume that dependencies can be selected globaly form a  drop down
          it('Created instance of AttributeModifiers', async () =>{
            bobsModifiers = await domainInstanceService.create({
              domainId: modifiers.id
            });
            assert.ok(bobsModifiers.domainId, 'Did not create an instance of ');
          });
          it('Created instanced properties for AttributeModifier', async () => {
            for (let index = 0; index < att.length; index++) {
              const element = att[index];
              bobsModifiers[element] = await propertyInstanceService.create({
                propertyId: modifiers[element].id
              });
              assert.ok(bobsModifiers[element].id, 'Did not create property');
            }
          });
          it('Selected/Created dependency instance Attributes for AttributeModifiers', async () => {
            // Context for modifier dependenices in modifiers.dependencies[0]
            bobsModifiers.dependencies = [];
            bobsModifiers.dependencies.push(await domainDependencyInstanceService.create({
              domainInstanceId: bobsModifiers.id,
              domainDependencyInstanceId: bobsAttributes.id
            }));
            assert.ok(bobsModifiers.dependencies[0].id, 'Did not create domain dependency instance');
          });
          it('Calculate Attribute Moddifers', async () => {

            // Get calculateion with
            // (modPropId, modDependencyId)
          });
        });
      });


      context('Utilization', () => {

      });
    });
  });
});