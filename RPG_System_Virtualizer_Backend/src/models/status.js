const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

// Different states a definition can be in

// 'creating' is while being defined, and can be relativly safely removed
// 'inUse' has instance of a domain (property or function?)
//  and should warn that deleting it will delete the instances
//  The 2 above could just be used by checking if there are any instances (count or first)

// 'toBeDeleted' marks a definition for deletion,
//  and prompts user to handle all associated definitions (domains, properties, functions)
module.exports  = function () {
  var status = DataTypes.ENUM('creating','inUse','toBeDeleted');
  return status;
};