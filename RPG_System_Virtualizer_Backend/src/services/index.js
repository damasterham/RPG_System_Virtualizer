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
};
