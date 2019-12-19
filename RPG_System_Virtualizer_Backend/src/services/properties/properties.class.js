const { Service } = require('feathers-sequelize');

exports.Properties = class Properties extends Service {
  setup(app) {
    this.app = app;
    this.sequelize = app.get('sequelize');
  }

  // TODO set hook validation that checks for parents/dependencies
  async setReference(id, referenceType, referenceId)
  {
    switch (referenceType) {
    case 'raw_value': {
      const rawValueService = await this.app.service('raw-values');
      return rawValueService.create({
        propertyId: id,
        // defaultValue: data.defaultValue // Should maybe not be passed yet
        // default value isnotnullorundefined
      });
    }
    case 'property': {
      // context.app.service('properties')
      // Needs to be able to create entry in junction table properties_properties
      // const sequelizeClient = app.get('sequelize');
      const propertyDirectReference = this.sequelize.models.properties_properties;

      // Adds property reference to properties_properties

      // using though in .belongsToMany() should supposedly create new add* methods to contextual models, but doesn't seem to work
      // properties.addPropertyReference({

      // Could be used to get relevant property if wanted
      return propertyDirectReference.create({
        propertyId: id,
        propertyReferenceId: referenceId,
      });
    }
    case 'function': {
      // Needs to be able to create entry in junction table propertys_fuctions
      const propertyFunctions = this.sequelize.models.properties_functions;
      // Could be used to get relevant function if wanted
      return propertyFunctions.create({
        propertyId: id,
        functionId: referenceId
      });
    }

    // TODO make domain dependencies check, to ensure no circular dependencies
    // Partially completed?? with hook: validate-is-valid-property-reference.js
    case 'domain': {
      // Create domain reference
      const propertyDomainEnums = this.sequelize.models.property_domain_enums;
      // Could be used to get relevant domain if wanted
      return propertyDomainEnums.create({
        propertyId: id,
        domainId: referenceId
      });

    }

    default:
      throw new Error(`Invaldi property reference type, tried to set type '${referenceType}' which does not exist
      Must be of type raw_value, property, function or domain`);
    }
  }

  async setDefaultValue(id, defaultValue)
  {
    const rawValues = await this.app.service('raw-values');
    return rawValues.patch(id, {
      defaultValue: defaultValue
    });
  }
};
