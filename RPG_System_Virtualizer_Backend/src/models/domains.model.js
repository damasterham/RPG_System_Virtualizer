// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient-rpgsv_db_test');
  const domains = sequelizeClient.define('domains', {
    // system_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shorthand: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // parentDomainId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    version: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '0.0'
    }
  }, {
    underscored: true,
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
    models.systems.hasMany(domains);
    
    // Domains.id <= Domains.parent_domain_id
    domains.hasOne(domains, {
      foreignKey: 'parent_domain_id',
      // constraint: false,
    });
  };

  return domains;
};
