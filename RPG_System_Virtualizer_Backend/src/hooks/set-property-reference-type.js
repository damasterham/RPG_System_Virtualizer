// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    const sequelize = await context.app.get('sequelize');
    // const props = context.app.get('sequelize').models.properties_properties;


    // console.log('context.sequelize', props);

    switch (context.result.referenceType) {
    case 'raw_value': {
      const rawValueService = await context.app.service('raw-values');
      await rawValueService.create({
        propertyId: context.result.id,
        defaultValue: context.data.defaultValue
        // default value isnotnullorundefined
      });
    }
      break;
    case 'property': {
      // context.app.service('properties')
      // Needs to be able to create entry in junction table properties_properties
      // const sequelizeClient = app.get('sequelize');
      const propertyReference = sequelize.models.properties_properties;

      // Adds property reference to properties_properties

      // using though in .belongsToMany() should supposedly create new add* methods to contextual models, but doesn't seem to work
      // properties.addPropertyReference({

      await propertyReference.create({
        propertyId: context.result.id,
        // property_reference_id: context.data.propertyReference,
        propertyReferenceId: context.data.propertyReference,
      });
    }
      break;
    case 'function': {
      // Needs to be able to create entry in junction table propertys_fuctions
      const propertyFunctions = sequelize.models.properties_functions;

      await propertyFunctions.create({
        propertyId: context.result.id,
        functionId: context.data.propertyReference
      });
    }
      break;

    // TODO make domain dependencies check, to ensure no circular dependencies
    case 'domain': {
      // Check if in domain dependencies
      const domainDependencies = sequelize.models.domain_dependencies;

      const dependencies = await domainDependencies.findOne({
        where: {
          domainId: context.data.domainId,
          domainDependencyId: context.data.propertyReference
        }
      });

      if (dependencies)
      {
        // Create domain reference
        const propertyDomainEnums = sequelize.models.property_domain_enums;
        await propertyDomainEnums.create({
          propertyId: context.result.id,
          domainId: context.data.propertyReference
        });
      }
      else
      {
        // Throw error about trying to use a domain for a property
        // Without a dependency to that domain
        return Promise.reject({
          name: 'BadReferenceError',
          message: `BadReferenceError: You are attempting to use a domain as a property reference
          that is not a dependency on the properties domain. Add the desired domain for the property reference domain
          to the properties domain dependencies before adding it as a property reference domain.`
        });

        /*
        throw ({
          name: 'BadReferenceError',
          message: `You are attempting to use a domain as a property reference
          that is not a dependency on the properties domain. Add the desired domain for the property reference domain
          to the properties domain dependencies before adding it as a property reference domain.`
        });
        */


      }


    }
      break;

    default:
      // throw exception
      break;
    }



    return context;
  };
};
