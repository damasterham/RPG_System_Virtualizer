/* eslint-disable require-atomic-updates */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    let servicename;
    let definitionId;

    switch (context.path) {
    case 'domain-collection-instances':
      servicename = 'domain-collections';
      definitionId = context.data.domainCollectionId;
      break;
    case 'domain-instances':
      servicename = 'domains';
      definitionId = context.data.domainId;
      break;
    case 'property-instances':
      servicename = 'properties';
      definitionId = context.data.propertyId;
      break;

    default:
      return context;
    }

    const definitionService = await context.app.service(servicename);
    // eslint-disable-next-line no-unused-vars
    const definition = await definitionService.get(definitionId);
    context.data.version = definition.version;
    return context;
  };
};
