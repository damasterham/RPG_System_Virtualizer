// Initializes the `functions` service on path `/functions`
const { Functions } = require('./functions.class');
const createModel = require('../../models/functions.model');
const hooks = require('./functions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/functions', new Functions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('functions');

  service.hooks(hooks);
};
