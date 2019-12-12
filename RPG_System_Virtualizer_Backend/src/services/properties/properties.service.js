// Initializes the `properties` service on path `/properties`
const { Properties } = require('./properties.class');
const createModel = require('../../models/properties.model');
const hooks = require('./properties.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/properties', new Properties(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('properties');

  service.hooks(hooks);
};
