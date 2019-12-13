// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const systems = sequelizeClient.define('systems', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shorthand: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagelink: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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

  // // eslint-disable-next-line no-unused-vars
  // systems.associate = function (models) {
  //   // Define associations here
  //   // See http://docs.sequelizejs.com/en/latest/docs/associations/
  // };

  return systems;
};
