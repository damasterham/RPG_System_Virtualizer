// Initializes the `variables_functions` service on path `/variables-functions`
const { VariablesFunctions } = require('./variables_functions.class');
const createModel = require('../../models/variables_functions.model');
const hooks = require('./variables_functions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/variables-functions', new VariablesFunctions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('variables-functions');

  service.hooks(hooks);
};
