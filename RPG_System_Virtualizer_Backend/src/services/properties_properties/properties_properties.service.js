// Initializes the `properties_properties` service on path `/properties-properties`
const { PropertiesProperties } = require('./properties_properties.class');
const createModel = require('../../models/properties_properties.model');
const hooks = require('./properties_properties.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/properties-properties', new PropertiesProperties(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('properties-properties');

  service.hooks(hooks);
};
