// Initializes the `domain_collection_instances` service on path `/domain-collection-instances`
const { DomainCollectionInstances } = require('./domain_collection_instances.class');
const createModel = require('../../models/domain_collection_instances.model');
const hooks = require('./domain_collection_instances.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/domain-collection-instances', new DomainCollectionInstances(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('domain-collection-instances');

  service.hooks(hooks);
};
