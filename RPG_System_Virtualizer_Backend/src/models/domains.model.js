// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient-rpgsv_db_test');
  const domains = sequelizeClient.define('domains', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shorthand: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    version: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '0.0'
    }
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

    // TODO: Model out how domain inheritance should be checked
    // sketch a graph of it

    // Systems.id <= Domains.system_id
    domains.belongsTo(models.systems);
    // models.systems.hasMany(domains);

    // Domains.id <= Domains.parent_domain_id
    domains.hasOne(domains, {
      foreignKey:  {
        name: 'parent_domain_id',
        allowNull: true
      }
      // constraint: false,
    });


    // Domain associations used as glorified enum
    domains.belongsToMany(models.properties, {
      as: 'PropertyDomainEnum',
      through: 'property_domain_enums',
      otherKey: {
        name: 'property_id',
        unique: true,
      }
    });

    domains.belongsToMany(models.variables, {
      as: 'VariableDomainEnum',
      through: 'variable_domain_enums',
      otherKey: {
        name: 'variable_id',
        unique: true,
      }
    });

  };

  return domains;
};
