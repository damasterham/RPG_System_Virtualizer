const { Service } = require('feathers-sequelize');

exports.Domains = class Domains extends Service {
  async setup(app) {
    this.app = await app;
    this.dependencies = await this.app.get('sequelize').models.domain_dependencies;
  }

  async findAllDependencyIds(domainId){
    return this.dependencies.findAll({
      where: {
        domainId: domainId
      }
    });
  }

  async addDependency(domainId, depdencyId) {
    return this.dependencies.create({
      domainId: domainId,
      domainDependencyId: depdencyId
    });
  }

  async addParent(domainId, parentId) {
    return this.patch(domainId, {
      parentDomainId: parentId
    });
  }
};
