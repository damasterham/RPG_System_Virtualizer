/* eslint-disable require-atomic-updates */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    // Only run if params.data.refenceId is present
    if (!context.params.data.referenceId)
      return context;

    const res = await context.service.setReference(context.id,
      context.params.data.referenceType,
      context.params.data.referenceId);
    // .then((res) => {
    context.result = {
      propertyId: res.propertyId,
      referenceId: res.propertyReferenceId || res.functionId || res.domainId
    };
    return context;
    // }).catch((err) => {
    //   throw new Error(err);
    // });
  };
};


// Old implementation
// const sequelize = await context.app.get('sequelize');
// let result;

// // Handle which reference type it is
// //// Could now be rewritten to use junction services
// switch (context.result.referenceType) {
// //// Raw value handled on frontend currently
// // case 'raw_value': {
// //   const rawValueService = await context.app.service('raw-values');
// //   await rawValueService.create({
// //     propertyId: context.id,
// //     defaultValue: context.data.defaultValue // Should maybe not be passed yet
// //     // default value isnotnullorundefined
// //   });
// // }
// //   break;
// case 'property': {
//   // context.app.service('properties')
//   // Needs to be able to create entry in junction table properties_properties
//   // const sequelizeClient = app.get('sequelize');
//   const propertyDirectReference = sequelize.models.properties_properties;

//   // Adds property reference to properties_properties

//   // using though in .belongsToMany() should supposedly create new add* methods to contextual models, but doesn't seem to work
//   // properties.addPropertyReference({

//   // Could be used to get relevant property if wanted
//   result = await propertyDirectReference.create({
//     propertyId: context.id,
//     propertyReferenceId: context.params.data.referenceId,
//   });
// }
//   break;
// case 'function': {
//   // Needs to be able to create entry in junction table propertys_fuctions
//   const propertyFunctions = sequelize.models.properties_functions;
//   // Could be used to get relevant function if wanted
//   result = await propertyFunctions.create({
//     propertyId: context.id,
//     functionId: context.params.data.referenceId
//   });
// }
//   break;

// // TODO make domain dependencies check, to ensure no circular dependencies
// // Partially completed?? with hook: validate-is-valid-property-reference.js
// //// Is this checked by hook validation???
// case 'domain': {
//   // Check if in domain dependencies
//   const domainDependencies = sequelize.models.domain_dependencies;

//   const dependencies = await domainDependencies.findOne({
//     where: {
//       domainId: context.data.domainId,
//       domainDependencyId: context.params.data.referenceId
//     }
//   });

//   if (dependencies)
//   {
//     // Create domain reference
//     const propertyDomainEnums = sequelize.models.properties_domains;
//     // Could be used to get relevant domain if wanted
//     await propertyDomainEnums.create({
//       propertyId: context.id,
//       domainId: context.params.data.referenceId
//     });
//   }
//   else
//   {
//     // Throw error about trying to use a domain for a property
//     // Without a dependency to that domain
//     return Promise.reject({
//       name: 'BadReferenceError',
//       message: `BadReferenceError: You are attempting to use a domain as a property reference
//       that is not a dependency on the properties domain. Add the desired domain for the property reference domain
//       to the properties domain dependencies before adding it as a property reference domain.`
//     });

//     /*
//     throw ({
//       name: 'BadReferenceError',
//       message: `You are attempting to use a domain as a property reference
//       that is not a dependency on the properties domain. Add the desired domain for the property reference domain
//       to the properties domain dependencies before adding it as a property reference domain.`
//     });
//     */
//   }
// }
//   break;
// default:
//   // throw exception
//   break;
// }
