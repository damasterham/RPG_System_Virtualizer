// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const domainInstances = sequelizeClient.define('domain_instances', {
    domainCollectionId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    version: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  domainInstances.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // The id of the Domain Definition
    domainInstances.belongsTo(models.domains,{
      onDelete: 'cascade'
    });

    // Domain dependency instances
    domainInstances.belongsToMany(domainInstances, {
      as: 'domainDependencyInstances',
      through: 'domain_dependency_instances',
      foreignKey: {
        name: 'domainInstanceId',
      }
    });

    // Domain collection instances
    domainInstances.belongsTo(models.domain_collection_instances, {
      onDelete: 'cascade'
    });
    // Could use junction tables
    // Because optional, can either be under a domain collection or standalone if flagged instantiable
    // domainInstances.belongsToMany(models.domain_collection_instances, {
    //   through: 'domain_collection_instances_domains',
    //   otherKey: {
    //     name: 'domainCollectionInstanceId'
    //   }
    // });
  };

  return domainInstances;
};
