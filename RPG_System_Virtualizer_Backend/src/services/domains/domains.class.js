const { Service } = require('feathers-sequelize');

exports.Domains = class Domains extends Service {
  setup(app) {
    this.app = app;
  }

  addDependency(domain, depdency) {
    const domainDepdencies = this.app.get('sequelize').models.domain_dependencies;
    domainDepdencies.create({
      domainId: domain.id,
      domainDependencyId: depdency.id
    });

  }
};
