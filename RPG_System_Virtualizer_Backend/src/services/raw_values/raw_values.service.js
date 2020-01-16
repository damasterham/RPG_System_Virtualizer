// Initializes the `raw_values` service on path `/raw-values`
const { RawValues } = require('./raw_values.class');
const createModel = require('../../models/raw_values.model');
const hooks = require('./raw_values.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/raw-values', new RawValues(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('raw-values');

  service.hooks(hooks);
};
