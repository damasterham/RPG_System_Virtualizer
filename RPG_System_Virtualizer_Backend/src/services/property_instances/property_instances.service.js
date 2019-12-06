// Initializes the `property_instances` service on path `/property-instances`
const { PropertyInstances } = require('./property_instances.class');
const createModel = require('../../models/property_instances.model');
const hooks = require('./property_instances.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/property-instances', new PropertyInstances(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('property-instances');

  service.hooks(hooks);
};
