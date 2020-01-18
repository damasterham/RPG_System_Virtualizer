const { Service } = require('feathers-sequelize');

exports.Domains = class Domains extends Service {
  async setup(app) {
    this.app = await app;
    this.dependencies = await this.app.get('sequelize').models.domain_dependencies;
  }

  // depcrecated
  async findAllDependencyIds(domainId){
    return this.dependencies.findAll({
      where: {
        domainId: domainId
      }
    });
  }

  // depcrecated
  async addDependency(domainId, depdencyId) {
    return this.dependencies.create({
      domainId: domainId,
      domainDependencyId: depdencyId
    });
  }

  // depcrecated
  async addParent(domainId, parentId) {
    return this.patch(domainId, {
      parentDomainId: parentId
    });
  }
};
