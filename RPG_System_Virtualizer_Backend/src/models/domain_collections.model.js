// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const domainCollections = sequelizeClient.define('domain_collections', {
    // TODO hook hooks
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
      unique: 'collectionNameForSystem'
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

  // eslint-disable-next-line no-unused-vars
  domainCollections.associate = function (models) {
    // Define associations here
    domainCollections.belongsTo(models.systems, {
      foreignKey: {
        name: 'systemId',
        unique: 'collectionNameForSystem',
        allowNull: false
      }
    });
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return domainCollections;
};
