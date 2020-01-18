// Initializes the `domain_collections_domains` service on path `/domain-collections-domains`
const { DomainCollectionsDomains } = require('./domain_collections_domains.class');
const createModel = require('../../models/domain_collections_domains.model');
const hooks = require('./domain_collections_domains.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/domain-collections-domains', new DomainCollectionsDomains(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('domain-collections-domains');

  service.hooks(hooks);
};
