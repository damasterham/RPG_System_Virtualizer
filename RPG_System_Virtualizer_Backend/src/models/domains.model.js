// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
// const Status = require('./status');


module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const domains = sequelizeClient.define('domains', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: 'systemDomainUnique'
    },
    shorthand: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    version: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '0.0'
    },
    toBeDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
    // status: Status
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  domains.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // OBS: sequelize, by default, does not make cascading deletes or stops deletes
    // of model that other models are dependant on. It just just sets null on column
    // used as the foreign key

    // Systems.id <= Domains.system_id
    domains.belongsTo(models.systems, {
      foreignKey: {
        unique: 'systemDomainUnique'
      }
    });
    // models.systems.hasMany(domains);

    // Domains.id <= Domains.parent_domain_id
    domains.hasOne(domains, {
      foreignKey:  {
        name: 'parentDomainId',
        allowNull: true
      }
      // constraint: false,
    });

    // Domain dependencies
    domains.belongsToMany(domains, {
      as: 'domainDependencies',
      through: 'domain_dependencies',
      foreignKey: {
        name: 'domainId',
      }
    });


    // Domain associations used as glorified enum
    domains.belongsToMany(models.properties, {
      as: 'propertiesDomains',
      through: 'properties_domains',
      otherKey: {
        name: 'propertyId',
        unique: true,
      }
    });

    domains.belongsToMany(models.variables, {
      as: 'variablesDomains',
      through: 'variables_domains',
      otherKey: {
        name: 'variable_id',
        unique: true,
      }
    });

  };

  return domains;
};
