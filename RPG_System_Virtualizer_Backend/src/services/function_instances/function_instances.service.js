// Initializes the `function_instances` service on path `/function-instances`
const { FunctionInstances } = require('./function_instances.class');
const createModel = require('../../models/function_instances.model');
const hooks = require('./function_instances.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/function-instances', new FunctionInstances(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('function-instances');

  service.hooks(hooks);
};
