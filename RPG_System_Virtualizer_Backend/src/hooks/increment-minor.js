// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (!context.params.$keepVersion) {
      let record = await context.service.get(context.id);
      const version = record.version.split('.');
      version[1] = parseInt(version[1]);
      version[1]++;
      record.version = version.join('.');
      // eslint-disable-next-line require-atomic-updates
      context.data.version = record.version;
    }
    return context;
  };
};
