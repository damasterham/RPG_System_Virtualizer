// Initializes the `properties_functions` service on path `/properties-functions`
const { PropertiesFunctions } = require('./properties_functions.class');
const createModel = require('../../models/properties_functions.model');
const hooks = require('./properties_functions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/properties-functions', new PropertiesFunctions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('properties-functions');

  service.hooks(hooks);
};
