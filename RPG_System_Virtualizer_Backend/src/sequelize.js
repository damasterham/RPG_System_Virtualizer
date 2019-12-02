const Sequelize = require('sequelize');


module.exports = function (app) {
  const postgresConfig = app.get('postgres');
  const DB_DEV = app.get('env').state === 'dev'; // True if modifications are being made to db
  const oldSetup = app.setup;

  // Enumerate each connectionString
  Object.keys(postgresConfig).forEach(key => {
    const connectionString = postgresConfig[key];
    const sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      logging: false,
      define: {
        freezeTableName: true
      }
    });

    // Sets key-value pair to reference the specific DB
    app.set(`sequelizeClient-${key}`, sequelize);

    //
    app.setup = function (...args) {
      const result = oldSetup.apply(this, args);

      // Set up data relationships
      const models = sequelize.models;
      Object.keys(models).forEach(name => {
        if ('associate' in models[name]) {
          models[name].associate(models);
        }
      });

      let options = {};

      if (DB_DEV === true)
      {
        options.alter = true; // Will make db update table to fit model
        options.force = true; // Will make db drop all tables before creating new ones
      }

      // Sets reference to Sync to the database
      app.set('sequelizeSync', sequelize.sync(options)); // with force will drop then create



      return result;
    };
  });



};
