const { Service } = require('feathers-sequelize');

exports.Properties = class Properties extends Service {
  async setup(app) {
    this.app = app;
    this.propProps = await app.service('properties-properties');
    this.propFuncs = await app.service('properties-functions');
    this.propDoms = await app.service('properties-domains');
    this.rawValues = await this.app.service('raw-values');
  }

  // TODO set hook validation that checks for parents/dependencies
  async setReference(id, referenceType, referenceId)
  {
    let propRef = {
      propertyId: id
    };
    switch (referenceType) {

    case 'property': {
      propRef.propertyReferenceId = referenceId;
      return this.propProps.create(propRef);
    }
    case 'function': {
      propRef.functionId = referenceId;
      return this.propFuncs.create(propRef);
    }
    case 'domain': {
      propRef.domainId = referenceId;
      return this.propDoms.create(propRef);
    }
    default:
      throw new Error(`Invalid property reference type, tried to set type '${referenceType}' which does not exist
      Must be of type raw_value, property, function or domain`);
    }
  }

  async setDefaultValue(id, defaultValue)
  {
    return this.rawValues.patch(id, {
      defaultValue: defaultValue
    });
  }
};
