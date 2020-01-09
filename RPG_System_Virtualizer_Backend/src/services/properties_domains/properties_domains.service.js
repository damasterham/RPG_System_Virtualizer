// Initializes the `properties_domains` service on path `/properties-domains`
const { PropertiesDomains } = require('./properties_domains.class');
const createModel = require('../../models/properties_domains.model');
const hooks = require('./properties_domains.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/properties-domains', new PropertiesDomains(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('properties-domains');

  service.hooks(hooks);
};
