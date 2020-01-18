// Initializes the `systems` service on path `/systems`
const { Systems } = require('./systems.class');
const createModel = require('../../models/systems.model');
const hooks = require('./systems.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/systems', new Systems(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('systems');

  service.hooks(hooks);
};
