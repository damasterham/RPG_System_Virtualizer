// Initializes the `variable_instances` service on path `/variable-instances`
const { VariableInstances } = require('./variable_instances.class');
const createModel = require('../../models/variable_instances.model');
const hooks = require('./variable_instances.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/variable-instances', new VariableInstances(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('variable-instances');

  service.hooks(hooks);
};
