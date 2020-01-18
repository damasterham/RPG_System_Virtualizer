/* eslint-disable require-atomic-updates */
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {

    // Move query to just params, ensures it isn't read as a query column
    if (!context.params.query.data)
      return context;

    context.params.data = context.params.query.data;
    // Check the current reftype
    // if (context.params.query.data.prevReferenceType)
    //   return context;

    const sequelize = context.app.get('sequelize');

    const res = await sequelize.query(`select reference_type from variables
    where id = :variableId`, {
      replacements: {
        variableId: context.id
      },
      type: sequelize.QueryTypes.SELECT
    });

    context.params.data.prevReferenceType = res[0].reference_type;

    delete context.params.query.data; // Removes the query data property

    return context;
  };
};
