// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const primitives = require('./primitives');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient-rpgsv_db_test');
  const variables = sequelizeClient.define('variables', {
    // domain_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // system_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
    // function_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reference: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_type: {
      type: primitives,
      allowNull: false
    },
    reference_type: {
      type: DataTypes.ENUM('function, property'),
      allowNull: false
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
  variables.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // Variables.system_id => Systems.id
    variables.belongsTo(models.systems);
    // Variables.domain_id => Domains.id
    variables.belongsTo(models.domains);
    // Variables.domain_id => Function.id
    variables.belongsTo(models.functions);

    // We have another either or reference here, but i cannot remember why
  };

  return variables;
};
