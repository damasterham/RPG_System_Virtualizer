// Initializes the `domain_dependency_instances` service on path `/domain-dependency-instances`
const { DomainDependencyInstances } = require('./domain_dependency_instances.class');
const createModel = require('../../models/domain_dependency_instances.model');
const hooks = require('./domain_dependency_instances.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/domain-dependency-instances', new DomainDependencyInstances(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('domain-dependency-instances');

  service.hooks(hooks);
};
