// Initializes the `domain_collections` service on path `/domain-collections`
const { DomainCollections } = require('./domain_collections.class');
const createModel = require('../../models/domain_collections.model');
const hooks = require('./domain_collections.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/domain-collections', new DomainCollections(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('domain-collections');

  service.hooks(hooks);
};
