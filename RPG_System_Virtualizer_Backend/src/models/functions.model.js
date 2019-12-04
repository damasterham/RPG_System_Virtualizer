// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const primitives = require('./primitives');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient-rpgsv_db_test');
  const functions = sequelizeClient.define('functions', {
    // domain_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
    // system_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    definition: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_type: {
      type: primitives,
      allowNull: false
    },
    function_type: {
      type: DataTypes.ENUM('equation','lookup','string_formatter'),
      allowNull: false
    },
    version: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '0.0'
    }
  }, {
    underscored: true,
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  functions.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // Functions.system_id => Systems.id
    functions.belongsTo(models.systems);
    // Functions.domain_id => Domains.id
    functions.belongsTo(models.domains);
  };

  return functions;
};
