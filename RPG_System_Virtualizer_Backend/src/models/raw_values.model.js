// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient-rpgsv_db_test');
  const rawValues = sequelizeClient.define('raw_values', {
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    defaultValue: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {

    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  rawValues.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    rawValues.belongsTo(models.properties, {
      foreignkey:{
        name: 'property_id',
        // primaryKey: true,
        // allowNull: false
      }
    });
  };

  return rawValues;
};
