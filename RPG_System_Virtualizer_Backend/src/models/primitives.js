const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports  = function () {
  var primitives = DataTypes.ENUM('int','string','boolean','float');
  return primitives;
};