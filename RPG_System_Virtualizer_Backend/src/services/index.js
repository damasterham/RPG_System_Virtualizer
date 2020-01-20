const test = require('./test/test.service.js');
const systems = require('./systems/systems.service.js');
const domains = require('./domains/domains.service.js');
const properties = require('./properties/properties.service.js');
const functions = require('./functions/functions.service.js');
const variables = require('./variables/variables.service.js');
const rawValues = require('./raw_values/raw_values.service.js');
const domainInstances = require('./domain_instances/domain_instances.service.js');
const propertyInstances = require('./property_instances/property_instances.service.js');
const functionInstances = require('./function_instances/function_instances.service.js');
const variableInstances = require('./variable_instances/variable_instances.service.js');
const rawValueInstances = require('./raw_value_instances/raw_value_instances.service.js');
const domainDependencies = require('./domain_dependencies/domain_dependencies.service.js');
const propertiesProperties = require('./properties_properties/properties_properties.service.js');
const propertiesFunctions = require('./properties_functions/properties_functions.service.js');
const propertiesDomains = require('./properties_domains/properties_domains.service.js');
const variablesFunctions = require('./variables_functions/variables_functions.service.js');
const variablesDomains = require('./variables_domains/variables_domains.service.js');
const variablesProperties = require('./variables_properties/variables_properties.service.js');
const equationRounder = require('./equation_rounder/equation_rounder.service.js');
const propertySpecificVariables = require('./property_specific_variables/property_specific_variables.service.js');
const domainDependencyInstances = require('./domain_dependency_instances/domain_dependency_instances.service.js');
const domainCollections = require('./domain_collections/domain_collections.service.js');
const domainCollectionsDomains = require('./domain_collections_domains/domain_collections_domains.service.js');
const domainCollectionInstances = require('./domain_collection_instances/domain_collection_instances.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(test);
  app.configure(systems);
  app.configure(domains);
  app.configure(properties);
  app.configure(functions);
  app.configure(variables);
  app.configure(rawValues);
  app.configure(domainInstances);
  app.configure(propertyInstances);
  app.configure(functionInstances);
  app.configure(variableInstances);
  app.configure(rawValueInstances);
  app.configure(domainDependencies);
  app.configure(propertiesProperties);
  app.configure(propertiesFunctions);
  app.configure(propertiesDomains);
  app.configure(variablesFunctions);
  app.configure(variablesDomains);
  app.configure(variablesProperties);
  app.configure(equationRounder);
  app.configure(propertySpecificVariables);
  app.configure(domainDependencyInstances);
  app.configure(domainCollections);
  app.configure(domainCollectionsDomains);
  app.configure(domainCollectionInstances);
};
