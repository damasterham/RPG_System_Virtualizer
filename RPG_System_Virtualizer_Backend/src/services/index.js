const test = require('./test/test.service.js');
const systems = require('./systems/systems.service.js');
const domains = require('./domains/domains.service.js');
const properties = require('./properties/properties.service.js');
const functions = require('./functions/functions.service.js');
const variables = require('./variables/variables.service.js');
const instances = require('./instances/instances.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(test);
  app.configure(systems);
  app.configure(domains);
  app.configure(properties);
  app.configure(functions);
  app.configure(variables);
  app.configure(instances);
};
