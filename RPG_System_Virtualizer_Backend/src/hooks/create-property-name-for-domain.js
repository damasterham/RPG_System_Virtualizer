// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const propertyService = context.app.service('properties');

    // TODO: should probably make this as a query instead of hooks
    await propertyService.create({
      // normalizename: 'name'
      name: 'Name',
      dataType: 'string',
      referenceType: 'raw_value',
      // FK
      domain_id: context.result.id,
      system_id: context.result.system_id
    });
    return context;
  };
};
