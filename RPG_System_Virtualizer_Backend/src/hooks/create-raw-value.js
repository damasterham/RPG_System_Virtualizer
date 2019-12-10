// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // Creates raw value with default value
    const rawValueService = await context.app.service('raw-values');
    await rawValueService.create({
      propertyId: context.result.id,
      defaultValue: context.data.defaultValue
      // default value isnotnullorundefined 
    });
    return context;
  };
};
