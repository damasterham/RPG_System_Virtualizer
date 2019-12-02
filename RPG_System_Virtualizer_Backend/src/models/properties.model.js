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
    system_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shorthand: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    default_value: {
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
    }
  }, {
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
  };

  return properties;
};
