const { Service } = require('feathers-sequelize');

exports.Domains = class Domains extends Service {
  setup(app) {
    this.app = app;
  }

  async addDependency(domain, depdency) {
    const domainDepdencies = this.app.get('sequelize').models.domain_dependencies;
    return domainDepdencies.create({
      domainId: domain.id,
      domainDependencyId: depdency.id
    });

  }
};
