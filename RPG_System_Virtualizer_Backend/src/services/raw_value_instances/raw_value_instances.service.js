// Initializes the `raw_value_instances` service on path `/raw-value-instances`
const { RawValueInstances } = require('./raw_value_instances.class');
const createModel = require('../../models/raw_value_instances.model');
const hooks = require('./raw_value_instances.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/raw-value-instances', new RawValueInstances(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('raw-value-instances');

  service.hooks(hooks);
};
