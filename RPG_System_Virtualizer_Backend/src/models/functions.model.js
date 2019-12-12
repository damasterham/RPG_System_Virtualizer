// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const Primitives = require('./primitives');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const functions = sequelizeClient.define('functions', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    definition: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dataType: {
      type: Primitives,
      allowNull: false
    },
    functionType: {
      type: DataTypes.ENUM('equation','lookup','string_formatter'),
      allowNull: false
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
  functions.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // Functions.system_id => Systems.id
    functions.belongsTo(models.systems);

    // Domain owner of functions
    // Functions.domain_id => Domains.id
    functions.belongsTo(models.domains);

    // Property with reference to a function
    functions.belongsToMany(models.properties, {
      as: 'PropertyFunction',
      through: 'properties_functions',
      otherKey: {
        name: 'property_id',
        unique: true
      }
    });

    // Variable with reference to a function
    functions.belongsToMany(models.variables, {
      as: 'VariableFunction',
      through: 'variables_functions',
      otherKey: {
        name: 'variable_id',
        unique: true,
      }
    });

  };

  return functions;
};
