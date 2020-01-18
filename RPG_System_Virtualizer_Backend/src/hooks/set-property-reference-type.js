/* eslint-disable require-atomic-updates */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    // console.log(context.params.data);
    // Only run if params.data.refenceId is present
    if (!context.params.query.data || !context.params.query.data.referenceId)
      return context;

    const res = await context.service.setReference(context.id,
      context.params.query.data.referenceType,
      context.params.query.data.referenceId);
    // .then((res) => {
    // context.result = {
    //   propertyId: res.propertyId,
    //   referenceId: res.propertyReferenceId || res.functionId || res.domainId
    // };
    context.result = res;
    return context;
    // }).catch((err) => {
    //   throw new Error(err);
    // });
  };
};