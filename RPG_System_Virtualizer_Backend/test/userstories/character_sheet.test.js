/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-vars */
const assert = require('assert');
const app = require('../../src/app');
const mathjs = require('mathjs');

describe('User Story [1.1.1 - 1.1.3] D&D Character Sheet', () => {

  let systemService;
  let domainService;
  let domainDependencyService;
  let domainCollectionService;
  let domainCollectionDomainsService;
  let propertyService;
  let rawValueService;
  let functionService;
  let variableService;
  let equationRounderService;
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
    domainCollectionService = await app.service('domain-collections');
    domainCollectionDomainsService = await app.service('domain-collections-domains'); // Could add custom hooks on patch for this, like with the others
    propertyService = await app.service('properties');
    rawValueService = await app.service('raw-values');
    functionService = await app.service('functions');
    variableService = await app.service('variables');
    equationRounderService = await app.service('equation-rounder');
    propertySpecificVariableService = await app.service('property-specific-variables');

    domainInstanceService = await app.service('domain-instances');
    domainDependencyInstanceService = await app.service('domain-dependency-instances');
    propertyInstanceService = await app.service('property-instances');
    rawValueInstanceService = await app.service('raw-value-instances');
  });

  // it('registered the service', () => {
  //   const service = app.service('domain-instances');

  //   assert.ok(service, 'Registered the service');
  // });

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
      let characterSheet;
      context('Definition',() => {
        // Attributes
        it('Created Domain Attributes', async () => {
          attributes = await domainService.create({
            systemId: dnd.id,
            name: 'Attributes'
          });
          assert.ok(attributes, 'Did no create the domain');
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

            // Could get this data back from same, propertService.create call
            attributes[element].reference = await rawValueService.get(attributes[element].id);
            assert.ok(attributes[element].reference, 'Hook did not create corresponding raw value');
            assert.ok(attributes[element].reference.propertyId, 'Hook did not create corresponding raw value');
          }
        });
        it('Sets default value 10 for Raw Value proeprties of Attributes', async () => {
          for (let index = 0; index < att.length; index++) {
            const element = att[index];

            attributes[element].reference = await rawValueService.patch(attributes[element].id, {
              defaultValue: 10
            });
            assert.ok(attributes[element].reference, 'Did not patch corresponding raw value');
            assert.ok(attributes[element].reference.propertyId, 'Did not pactch corresponding raw value');
            assert.equal(attributes[element].reference.defaultValue, 10, 'Default value was not set to 10');
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
        it('Sets CalculateModifier\'s definition', async () => {
          modifiers.calculateModifier = await functionService.patch(
            modifiers.calculateModifier.id,
            {
              definition: 'x / 2 - 5'
            });
          assert.ok(modifiers.calculateModifier.id, 'Did not patch function');
          assert.equal(modifiers.calculateModifier.definition, 'x / 2 - 5', 'Did not patch function');
        });
        it('Adds CalculateModifier\'s equation rounder', async () => {
          modifiers.calculateModifier.rounding = await equationRounderService.create({
            functionId: modifiers.calculateModifier.id
          });
          assert.ok(modifiers.calculateModifier.rounding, 'Did not create equation rounder for CalculateModifier');
          assert.ok(modifiers.calculateModifier.rounding.functionId, 'Did not create equation rounder for CalculateModifier');
          assert.equal(modifiers.calculateModifier.rounding.value, 0.5, 'Was not default value of 0.5');
        });
        it('Sets CalculateModifier\'s rounding value', async () => {
          modifiers.calculateModifier.rounding = await equationRounderService.patch(
            modifiers.calculateModifier.rounding.functionId, {
              value: 0
            });
          assert.ok(modifiers.calculateModifier.rounding, 'Did not patch equation rounder for CalculateModifier');
          assert.ok(modifiers.calculateModifier.rounding.functionId, 'Did not patch equation rounder for CalculateModifier');
          assert.equal(modifiers.calculateModifier.rounding.value, 0, 'Did not patch equation rounder for CalculateModifier');
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
          modifiers.calculateModifier.variables[0] = await variableService.patch(
            modifiers.calculateModifier.variables[0].id, // x
            {
              referenceType: 'domain'
            },
            {
              query: {
                data: {
                  referenceId: modifiers.dependencies[0].domainDependencyId // attributes
                }
              }
            }
          );
          assert.ok(modifiers.calculateModifier.variables[0].reference.domainId, 'Did not create variable for CalculateMdodifiers function');
          assert.equal(modifiers.calculateModifier.variables[0].reference.domainId, attributes.id, 'Was not correct variable domain reference');
        });
        // Seemes to display undefined in test log but passes tests?
        it('Sets modifier properties\' function to CalculateModifier', async () => {
          for (let index = 0; index < att.length; index++) {
            const element = att[index];

            modifiers[element].reference = await propertyService.patch(
              modifiers[element].id,
              {
                // fullTest: true
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
          characterSheet = await domainCollectionService.create({});
          assert.ok(characterSheet, 'Did not create Character Sheet domain collection');
          assert.ok(characterSheet.id, 'Did not create Character Sheet domain collection');
        });
        it('Adds the Attribute and AttributeModifiers domains to the CharacterSheet domain collecion', async () => {
          characterSheet.domainRefs = [];
          // characterSheet.domains = [];

          characterSheet.domainRefs.push(await domainCollectionDomainsService.create({
            domainId: attributes.id,
            domainCollectionId: characterSheet.id
          }));

          assert.ok(characterSheet.domainRefs[0], 'Did not add Attributes to CharacterSheet');
          assert.equal(characterSheet.domainRefs[0].domainId, attributes.id, 'Did not add Attributes to CharacterSheet');
          assert.equal(characterSheet.domainRefs[0].domainCollectionId, characterSheet.id, 'Did not add Attributes to CharacterSheet');

          // Should check if domain collection has domain pressent in domain dependencies
          // Other wise warn that you need to add dependency
          characterSheet.domainRefs.push(await domainCollectionDomainsService.create({
            domainId: modifiers.id,
            domainCollectionId: characterSheet.id
          }));

          assert.ok(characterSheet.domainRefs[1], 'Did not add Modifiers to CharacterSheet');
          assert.equal(characterSheet.domainRefs[1].domainId, modifiers.id, 'Did not add Modifiers to CharacterSheet');
          assert.equal(characterSheet.domainRefs[1].domainCollectionId, characterSheet.id, 'Did not add Modifiers to CharacterSheet');
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
          /// Attributes

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
              assert.ok(bobsAttributes[element].id, 'Did not create property instance');
            }
          });
          // UI Gets the properties type references and displays if user input is to be made
          // it('Gets the instanced properties references', async () => {
          //   for (let index = 0; index < att.length; index++) {
          //     const element = att[index];
          //     if(bobsAttributes[element].referenceType === 'raw_value') {
          //       bobsAttributes[element].reference = rawValueService.get(bobsAttributes[element].propertyId);
          //     }

          //     assert.ok(bobsAttributes[element].reference, 'Did not create raw value reference');
          //     assert.ok(bobsAttributes[element].reference.propertyId, 'Did not create raw value reference');
          //   }
          // });
          // Default fill
          it('Creates instanced raw values for properties Attributes, with defaults', async () => {
            for (let index = 0; index < att.length; index++) {
              const element = att[index];
              // Hook add default value if present
              bobsAttributes[element].reference = await rawValueInstanceService.create({
                propertyInstanceId: bobsAttributes[element].id
              });
              assert.ok(bobsAttributes[element].reference, 'Did not create raw value instance');
              assert.ok(bobsAttributes[element].reference.propertyInstanceId, 'Did not create raw value instance');
              assert.equal(bobsAttributes[element].reference.value, 10, 'Did not get the default value of 10 for raw value');
            }
          });
          // User actually fills in values
          it('Patches raw values of properties Attributes', async () => {
            for (let index = 0; index < att.length; index++) {
              const element = att[index];
              bobsAttributes[element].reference = await rawValueInstanceService.patch(
                bobsAttributes[element].reference.propertyInstanceId,
                {
                  value: attArr[index]
                });
              assert.ok(bobsAttributes[element].reference, 'Did not patch raw value instance');
              assert.ok(bobsAttributes[element].reference.propertyInstanceId, 'Did not patch raw value instance');
              assert.equal(bobsAttributes[element].reference.value, attArr[index], `Attribute ${element} was not ${attArr[index]}`);
            }
          });

          /// Modifiers

          // Context is from characterSheet domain collection
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
          // This is contextuallized underneath
          it('Selected/Created dependency instance Attributes for AttributeModifiers', async () => {
            // Context for modifier dependenices in modifiers.dependencies[0]
            bobsModifiers.dependencies = [];
            bobsModifiers.dependencies.push(await domainDependencyInstanceService.create({
              domainInstanceId: bobsModifiers.id,
              domainDependencyInstanceId: bobsAttributes.id
            }));
            assert.ok(bobsModifiers.dependencies[0], 'Did not create domain dependency instance');
          });
          // Not stored as the frontend store, so assumes that things are gotten via. id references through store
          it('Calculate Attribute Moddifers', async () => {
            bobsModifiers.functions;
            for (let index = 0; index < att.length; index++) {
              const element = att[index];

              // Simple assumed reference get of value
              // get function, pass variable

              let equation = modifiers.calculateModifier.definition;
              equation = ' ' + equation + ' '; // Adds whitespaces to be able chec generally check for spacing between words
              const regex = new RegExp(`\\s${modifiers.calculateModifier.variables[0].name}\\s`, 'g');
              equation = equation.replace(
                regex, // /\sx\s/g  // x
                ' ' + bobsAttributes[element].reference.value + ' ' // number
              );
              equation = equation.trimStart().trimEnd();
              bobsModifiers[element].value = mathjs.evaluate(equation);
              // because dnd always rounds down use fix, rounds towards
              // should get equation rounder if function is type int, and use that floating point between 0-1 to
              // determine when to round up? so 0 never round up, ergo always round down
              // 0.1 round up at 0.1, 0.5 round up at 0.5, 1 always round up
              // So should be gotten from the property? or function? specifically

              const rounding = modifiers.calculateModifier.rounding.value;
              // This should be extracted into its own class function something
              let resValue = bobsModifiers[element].value;
              // get decimals
              const deci = resValue % 1;

              if (deci != 0)
                // round down
                if (deci > rounding)
                  resValue = mathjs.floor(resValue);
                // round up
                else
                  resValue = mathjs.ceil(resValue);

              // console.log(resValue);
              bobsModifiers[element].value = resValue; //= mathjs.fix(bobsModifiers[element].value);
            }
            // The end value that is desired

            // Get property from property instance

            // Get referece from property (function)

            // get function from reference, and store

            // bobsModifiers.functions;

            // get variables from function

            /// get reference from variable (domain)
            //// get domain from reference (to know what dependency you are looking for)
            //// get specified property variables

            // get property (raw value) from specified property variable

            // get property instance from contextual domain dependency?

            // get property from specified referenec



            // bobsModifiers[element] = await propertyInstanceService.create({
            //   propertyId: modifiers[element].id
            // });
            // assert.ok(bobsModifiers[element].id, 'Did not create property');


            assert.equal(bobsModifiers.Strength.value, 3, 'Bobs Strength modifier was not +3');
            assert.equal(bobsModifiers.Dexterity.value, 0, 'Bobs Dexterity modifier was not +0');
            assert.equal(bobsModifiers.Constitution.value, 2, 'Bobs Constitution modifier was not +2');
            assert.equal(bobsModifiers.Wisdom.value, -1, 'Bobs Wisdom modifier was not -1');
            assert.equal(bobsModifiers.Intelligence.value, 0, 'Bobs Intelligence modifier was not 0');
            assert.equal(bobsModifiers.Charisma.value, 2, 'Bobs Charisma modifier was not 2');
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