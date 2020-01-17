// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const propertyInstances = sequelizeClient.define('property_instances', {
    version: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  propertyInstances.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // The properties definition
    propertyInstances.belongsTo(models.properties);

    // The instanced domain it belongs to
    // Will allow for domain instances with parents to be able
    // contain all properties instead of instancing the parents themselves
    propertyInstances.belongsTo(models.domain_instances, {
      onDelete: 'cascade'
    });
  };

  return propertyInstances;
};
