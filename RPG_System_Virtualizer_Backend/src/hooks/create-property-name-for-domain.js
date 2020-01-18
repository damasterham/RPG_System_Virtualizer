// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const propertyService = context.app.service('properties');

    // TODO-Maybe: should probably make this as a query instead of hooks
    // Should not be made when, domain has parent, can use name from parent
    if (context.result.parentId)
      return context;
    // Constraint of name and domain id is actually for its parents as well
    // Or perhaps, if creating a new property of the same name you are overriding the parents
    // UI: have a button to make new domain that inherits form contextual domain
    // Domains + (new Domain)
    // -SomeDomain >+ (new Inherited domain)

    // eslint-disable-next-line no-unused-vars
    const nameProp = await propertyService.create({
      // normalizename: 'name'
      name: 'Name',
      dataType: 'string',
      referenceType: 'raw_value',
      // FK
      domainId: context.result.id,
      systemId: context.result.system_id
    });

    // eslint-disable-next-line require-atomic-updates
    context.result.properties = [nameProp];

    return context;
  };
};
