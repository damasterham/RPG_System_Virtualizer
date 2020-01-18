// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
// const Sequelize = require('sequelize');
// const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const domainDependencyInstances = sequelizeClient.define('domain_dependency_instances', {

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  domainDependencyInstances.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return domainDependencyInstances;
};
