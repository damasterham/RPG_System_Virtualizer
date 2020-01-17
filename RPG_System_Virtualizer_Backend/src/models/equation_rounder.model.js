// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const equationRounder = sequelizeClient.define('equation_rounder', {
    functionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    // 0-1
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.5
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  equationRounder.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    equationRounder.belongsTo(models.functions, {
      foreignKey: {
        name: 'functionId'
      },
      onDelete: 'cascade'
    });

  };

  return equationRounder;
};
