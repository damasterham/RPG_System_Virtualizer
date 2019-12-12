// Initializes the `domain_instances` service on path `/domain-instances`
const { DomainInstances } = require('./domain_instances.class');
const createModel = require('../../models/domain_instances.model');
const hooks = require('./domain_instances.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/domain-instances', new DomainInstances(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('domain-instances');

  service.hooks(hooks);
};
