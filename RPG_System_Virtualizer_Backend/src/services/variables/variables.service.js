// Initializes the `variables` service on path `/variables`
const { Variables } = require('./variables.class');
const createModel = require('../../models/variables.model');
const hooks = require('./variables.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/variables', new Variables(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('variables');

  service.hooks(hooks);
};
