// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const primitives = require('./primitives');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient-rpgsv_db_test');
  const properties = sequelizeClient.define('properties', {
    domain_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
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
    defaultValue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reference: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    data_type: {
      type: primitives,
      allowNull: false
    },
    reference_type: {
      type: DataTypes.ENUM('function', 'property', 'raw_value'),
      allowNull: false
    },
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
  properties.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // Properties.system_id => Systems.id
    properties.belongsTo(models.systems);
    // Properties.domain_id => Domains.id
    properties.belongsTo(models.domains);


    // Reference belongsTo eithers a raw value (itself) (null), properties or funtions
    // Probably need custom definitions for this, if we want constraints

    // We could make a many many table for 
    // properties <- direct_reference -> properties
    // properties <- property_functioins -> functions
    // so instead of having reference being in the properties table, it is on it own

    // or

    // Model inheritance by having a base table that properties and functions

  };

  return properties;
};
