// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    


    
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

    }
    break;
    case 'function': {
      // Needs to be able to create entry in junction table propertys_fuctions
    }
    break;
      default:
        // throw exception
        break;
    }



    return context;
  };
};
