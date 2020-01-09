// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    // If no reference type on patch exit
    if (!context.data.referenceType)
      return context;

    // If it had a previous reference, delete it
    if (context.params.data || context.params.data.prevReferenceType) {
      // Can actually run async?
      await context.service.deleteReference(context.id,
        context.params.data.prevReferenceType);
    }

    const res = await context.service.setReference(
      context.id,
      context.data.referenceType,
      context.params.data.referenceId);

    // eslint-disable-next-line require-atomic-updates
    context.result.reference = res;
    return context;
  };
};
