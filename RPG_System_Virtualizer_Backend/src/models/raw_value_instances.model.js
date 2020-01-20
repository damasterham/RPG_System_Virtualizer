// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const rawValueInstances = sequelizeClient.define('raw_value_instances', {
    propertyInstanceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false // Gets either value from input, or default
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  rawValueInstances.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    rawValueInstances.belongsTo(models.raw_values, {
      foreignKey: {
        name: 'propertyInstanceId',
      },
      onDelete: 'cascade'
    });
  };

  return rawValueInstances;
};
