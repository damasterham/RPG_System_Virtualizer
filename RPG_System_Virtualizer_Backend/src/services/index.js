const test = require('./test/test.service.js');
const system = require('./system/system.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(test);
  app.configure(system);
};
