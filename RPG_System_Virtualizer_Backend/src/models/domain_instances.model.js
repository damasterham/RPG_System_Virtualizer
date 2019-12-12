// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const domainInstances = sequelizeClient.define('domain_instances', {
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
  domainInstances.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // The id of the Domain Definition
    domainInstances.belongsTo(models.domains);
  };

  return domainInstances;
};
