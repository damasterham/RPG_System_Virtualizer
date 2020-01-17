// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const propertySpecificVariables = sequelizeClient.define('property_specific_variables', {
    propertyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    variableId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    propertyReferenceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
  propertySpecificVariables.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/


  };

  return propertySpecificVariables;
};
