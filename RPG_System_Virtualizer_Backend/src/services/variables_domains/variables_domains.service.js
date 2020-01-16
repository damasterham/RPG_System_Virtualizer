// Initializes the `variables_domains` service on path `/variables-domains`
const { VariablesDomains } = require('./variables_domains.class');
const createModel = require('../../models/variables_domains.model');
const hooks = require('./variables_domains.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/variables-domains', new VariablesDomains(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('variables-domains');

  service.hooks(hooks);
};
