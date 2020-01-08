// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const Primitives = require('./primitives');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const variables = sequelizeClient.define('variables', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'functionVariableUnique'
    },
    dataType: {
      type: Primitives,
      allowNull: false
    },
    referenceType: {
      type: DataTypes.ENUM('function', 'property', 'domain'),
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
  variables.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // Variables.system_id => Systems.id
    variables.belongsTo(models.systems);
    // Variables.domain_id => Domains.id
    variables.belongsTo(models.domains);

    // Variables.function_id => Functions.id
    // corresponds to parameters of function
    variables.belongsTo(models.functions, {
      foreignKey: {
        unique: 'functionVariableUnique',
        allowNull: false
      }
    });

  };

  return variables;
};
