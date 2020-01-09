// Initializes the `variables_properties` service on path `/variables-properties`
const { VariablesProperties } = require('./variables_properties.class');
const createModel = require('../../models/variables_properties.model');
const hooks = require('./variables_properties.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/variables-properties', new VariablesProperties(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('variables-properties');

  service.hooks(hooks);
};
