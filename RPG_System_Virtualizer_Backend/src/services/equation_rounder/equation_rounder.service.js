// Initializes the `equation_rounder` service on path `/equation-rounder`
const { EquationRounder } = require('./equation_rounder.class');
const createModel = require('../../models/equation_rounder.model');
const hooks = require('./equation_rounder.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/equation-rounder', new EquationRounder(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('equation-rounder');

  service.hooks(hooks);
};
