// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  // Auto creates a raw value entry corresponding the property
  // Could alternativly be don via service('properties').setReference()

  // Could get this data back from same, propertService.create call
  return async context => {
    await context.app.service('raw-values').create({
      propertyId: context.result.id
    });
    return context;
  };
};
