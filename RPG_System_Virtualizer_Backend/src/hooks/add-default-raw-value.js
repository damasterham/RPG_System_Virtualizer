/* eslint-disable require-atomic-updates */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    let propertyId;
    if (context.data && context.data.propertyId)
      propertyId = context.data.propertyId;
    else {
      const propertyInstanceService = await context.app.service('property-instances');
      const res = await propertyInstanceService.get(context.data.propertyInstanceId);
      propertyId = res.propertyId;
    }
    // Get default value of raw-values when creating an instanced raw
    const rawValues = await context.app.service('raw-values');
    const res = await rawValues.get(propertyId);
    if (res.defaultValue || res.defaultValue !== '') // TO empty string or not to empty...
      context.data.value = res.defaultValue;

    return context;
  };
};
