const { Service } = require('feathers-sequelize');

exports.Variables = class Variables extends Service {

  async setup(app) {
    this.app = app;
    this.varProps = await app.service('variables-properties');
    this.varFuncs = await app.service('variables-functions');
    this.varDoms = await app.service('variables-domains');
  }

  async deleteReference(id, referenceType) {
    const where = {
      query: {
        variableId: id
      }
    };
    switch(referenceType) {
    case 'property': {
      return this.varProps.remove(null, where);
    }
    case 'function': {
      return this.varFuncs.remove(null, where);
    }
    case 'domain': {
      return this.varDoms.remove(null, where);
    }
    default:
      throw new Error(`Invalid variable reference type, tried to set type '${referenceType}' which does not exist
        Must be of type property, function or domain`);
    }
  }

  async setReference(id, referenceType, referenceId) {
    let varRef = {
      variableId: id
    };
    switch(referenceType) {
    case 'property': {
      varRef.propertyId = referenceId;
      return this.varProps.create(varRef);
    }
    case 'function': {
      varRef.functionId = referenceId;
      return this.varFuncs.create(varRef);
    }
    case 'domain': {
      varRef.domainId = referenceId;
      return this.varDoms.create({
        variableId: id,
        domainId: referenceId
      });
    }
    default:
      throw new Error(`Invalid variable reference type, tried to set type '${referenceType}' which does not exist
      Must be of type property, function or domain`);
    }
  }

};
