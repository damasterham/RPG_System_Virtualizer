const assert = require('assert');
const app = require('../../src/app');

describe('\'systems\' service', () => {
  let service = {};
  let newEntry;
  let patchedEntry;

  before(() => {
    service = app.service('systems');
  });

  it('registered the service', () => {
    assert.ok(service, 'Did not register the service');
  });

  it('created an entry', async () => {
    newEntry = await service.create({
      name: 'testSystem',
      shorthand: 'tS'
    });
    console.log('new entry:', newEntry);

    assert.ok(newEntry.id, 'Did not create an entry');
  });

  it('patched an entry', async () => {
    patchedEntry = await service.patch(newEntry.id, { name: 'newName' });
    console.log('Patched Entry:', patchedEntry);

    assert.ok(patchedEntry.name === 'newName', 'Did not patch an entry');
    assert.ok(patchedEntry.version === '0.1', 'Did not increment minor version number');
  });

  it('removed an entry', async () => {
    const res = await service.remove(patchedEntry.id);
    console.log('removed entry:', res);

    assert.ok(res.id, 'entry was not removed');
  });
});
