// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient-rpgsv_db_test');
  const system = sequelizeClient.define('system', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shorthand: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  system.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return system;
};
