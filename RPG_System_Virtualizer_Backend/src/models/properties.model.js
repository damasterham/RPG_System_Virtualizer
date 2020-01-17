// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const Primitives = require('./primitives');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelize');
  const properties = sequelizeClient.define('properties', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: 'domainPropertyUnique'
    },
    shorthand: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dataType: {
      type: Primitives,
      allowNull: false
    },
    referenceType: {
      type: DataTypes.ENUM('function', 'property', 'raw_value', 'domain'),
      allowNull: false
    },
    version: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '0.0'
    },
  }, {

    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  properties.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/

    // TODO: Check if searching/sorting on system.id localy in a table is faster than through associations
    // Properties.system_id => Systems.id
    properties.belongsTo(models.systems);

    // Domain owner of properties
    // Properties.domain_id => Domains.id
    properties.belongsTo(models.domains,{
      foreignKey: {
        unique: 'domainPropertyUnique',
        allowNull: false
      }
    });


    // Reference belongsTo eithers a raw value (itself) (null), properties or funtions
    // Probably need custom definitions for this, if we want constraints

    // We could make a many many table for
    // properties <- direct_reference -> properties
    // properties <- property_functions -> functions
    // so instead of having reference being in the properties table, it is on it own
    // and raw_value table for raw values specifically to keep the refernece style consistent

    // Property with reference to another property
    properties.belongsToMany(models.properties, {
      // Sets otherkey name to propertyReferenceId
      as: {
        singular: 'propertyReference',
        plural: 'propertyReferences'
      },
      //'propertyReference',
      through: 'properties_properties',
      // modelname: 'propertyReference',
      // unique on property_id
      foreignKey: {
        name: 'propertyId',
        unique: true,
      }
    });

    // Variable with reference to a function
    properties.belongsToMany(models.variables, {
      as: 'variableProperty',
      through: 'variables_properties',
      otherKey: {
        name: 'variableId',
        unique: true,
      }
    });
    // OnDelete remvove

    // properties.hasOne(models.raw_values, {
    //   foreignkey:{
    //     name: 'property_id',
    //     // primaryKey: true,
    //     allowNull: false
    //   }
    // });

    // or

    // Model inheritance by having a base table that properties and functions



    // which property is wanted for the variables
    properties.belongsToMany(models.variables, {
      through: 'property_specific_variables',
      otherKey: {
        name: 'variableId',
        unique: true
      },
      foreignKey: {
        name: 'propertyReferenceId'
      }
    });

  };

  return properties;
};
