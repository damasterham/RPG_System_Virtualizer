// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let service;
    let id;
    if (context.result.function_id) {
      service = context.app.service('functions');
      id = context.result.function_id;
    } else if (context.result.domain_id) {
      service = context.app.service('domains');
      id = context.result.domain_id;
    } else if (context.result.system_id) {
      service = context.app.service('systems');
      id = context.result.system_id;
    }
    const res = await service.get(id);
    const version = res.version.split('.');
    version[0] = parseInt(version[0]);
    version[0]++;

    await service.patch(
      id,
      { version: version[0] + '.' + version[1] },
      { $keepVersion: true }
    );
    return context;
  };
};
