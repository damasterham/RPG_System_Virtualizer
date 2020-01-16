// Initializes the `property_specific_variables` service on path `/property-specific-variables`
const { PropertySpecificVariables } = require('./property_specific_variables.class');
const createModel = require('../../models/property_specific_variables.model');
const hooks = require('./property_specific_variables.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate'),
    multi:['remove', 'patch']
  };

  // Initialize our service with any options it requires
  app.use('/property-specific-variables', new PropertySpecificVariables(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('property-specific-variables');

  service.hooks(hooks);
};
