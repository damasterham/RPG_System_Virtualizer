const feathers = require('@feathersjs/feathers');
const app = feathers();

// A messages service that allows to create new
// and return all existing messages
const TESTS = 'tests';

class TestService {
  constructor() {
    this.tests = [];
  }

  async find () {
    // Just return all our messages
    return this.tests;
  }

  async get (id) {
    return this.tests.find(x => x.id === id);
  }

  async create (data) {
    // The new message is the data merged with a unique identifier
    // using the messages length since it changes whenever we add one
    const test = {
      id: this.tests.length,
      value: data.value
    };

    // Add new message to the list
    this.tests.push(test);

    return test;
  }

  async remove (id) {
    return this.tests.splice(this.tests.findIndex(x => x.id === id), 1);
  }
}

// Register the message service on the Feathers application
app.use(TESTS, new TestService());

// Log every time a new message has been created
app.service(TESTS).on('created', test => {
  console.log(`A new test has been created, with value:'${test.value}', id:${test.id}`);
});

app.service(TESTS).on('removed', test => {
  console.log(`A test has been deleted, with value: '${test.value}', id:${test.id}`);
});

// A function that creates new messages and then logs
// all existing messages
const main = async () => {


  // Create a new message on our message service
  const item = await app.service(TESTS).create({
    value: 'Create Test'
  });

  // Find all existing messages
  const tests = await app.service(TESTS).find();

  console.log('All tests', tests);

  await app.service(TESTS).remove(item.id);

};

main();
