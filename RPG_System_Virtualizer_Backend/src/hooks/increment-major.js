// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let service;
    let id;
    // Determines the specific parent to progoate change to
    if (context.result.functionId) {
      service = context.app.service('functions');
      id = context.result.functionId;
    } else if (context.result.domainId) {
      service = context.app.service('domains');
      id = context.result.domainId;
    } else if (context.result.systemId) {
      service = context.app.service('systems');
      id = context.result.systemId;
    }
    // Updates parents major version number
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
