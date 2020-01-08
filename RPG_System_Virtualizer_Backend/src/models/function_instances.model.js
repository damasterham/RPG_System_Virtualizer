// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
// const Sequelize = require('sequelize');
// const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const functionInstances = sequelizeClient.define('function_instances', {

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  functionInstances.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return functionInstances;
};
