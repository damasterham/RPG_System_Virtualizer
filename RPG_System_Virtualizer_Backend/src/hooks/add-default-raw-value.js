/* eslint-disable require-atomic-updates */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    // Get default value of raw-values when creating an instanced raw
    const rawValues = context.app.service('raw-values');
    const res = await rawValues.get(context.data.propertyId);
    if (res.defaultValue)
      context.data.value = res.defaultValue;

    return context;
  };
};
