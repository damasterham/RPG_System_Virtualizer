// Initializes the `domain_dependencies` service on path `/domain-dependencies`
const { DomainDependencies } = require('./domain_dependencies.class');
const createModel = require('../../models/domain_dependencies.model');
const hooks = require('./domain_dependencies.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/domain-dependencies', new DomainDependencies(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('domain-dependencies');

  service.hooks(hooks);
};
