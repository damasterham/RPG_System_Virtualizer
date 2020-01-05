const assert = require('assert');
const app = require('../../src/app');

describe('\'domains\' service', () => {

  let sequelize;
  let systemService;
  let system;
  let domainService;

  let newEntry;
  let patchedEntry; // Parent
  let entryWithParent; // Dependency
  let entryWithDependency;

  before(async () => {
    sequelize = app.get('sequelize');

    // Create System
    systemService = await app.service('systems');
    system = await systemService.create({
      name: 'DomainsTest-System'
    });
  });

  it('registered "domains" service', async () => {
    domainService = await app.service('domains');
    assert.ok(domainService, 'Registered the service');
  });

  it('created a domain entry, with name property', async () => {
    newEntry = await domainService.create({
      systemId: system.id,
      name: 'DomainsTest-Domain',
      shorthand: 'DT-D'
    });
    assert.ok(newEntry.id, 'Did not create entry');
    const nameProp = newEntry.properties[0];
    assert.ok(nameProp.id, 'Did not pass name property to domain.properties[]');
    assert.ok(nameProp.name === 'Name', 'Did not pass name property to domain.properties[]');

    const nameProperty = await sequelize.models.properties.findOne({
      where: {
        domainId: newEntry.id,
        name: 'Name'
      }
    });
    assert.ok(nameProperty.id, 'Did not create name property as default for new domain');
    assert.ok(nameProperty.name === 'Name', 'Did not create name property as default for new domain');
    assert.ok(nameProperty.dataType === 'string', 'Did not create name property as default for new domain');
  });

  it('did not create domain with same name', () => {
    assert.rejects(domainService.create({
      systemId: system.id,
      name: 'DomainsTest-Domain',
      shorthand: 'DT-D'
    }),
    { name: 'BadRequest'},
    'Did not throw a BadRequest error on duplicate names');
  });

  it('patched an entry with new name', async () => {
    patchedEntry = await domainService.patch(newEntry.id, { name: 'newName' });

    assert.ok(patchedEntry.name === 'newName', 'Did not patch an entry');
    assert.ok(patchedEntry.version === '0.1', 'Did not increment minor version number');

    const sys = await systemService.get(patchedEntry.systemId);
    assert.ok(sys.version === '0.0', 'Incremented major version number for parent');
  });

  context('domain with inheritance', () => {
    let entryWithoutParent;

    it('created entry', async () =>{
      entryWithoutParent = await domainService.create({
        systemId: system.id,
        name: 'DomainsTest-DomainWithParent',
        shorthand: 'DT-DWP',
        // parentDomainId: patchedEntry.id
      });
      assert.ok(entryWithoutParent.id, 'did not create an entry (with parent)');
    });

    it('added parent domain to entry', async () => {
      entryWithParent = await domainService.addParent(entryWithoutParent.id, patchedEntry.id);
      assert.ok(entryWithParent.id === entryWithoutParent.id, 'did not patch an entry with parent');
      assert.ok(entryWithParent.parentDomainId === patchedEntry.id, 'did not patch an entry with the correct parent');

      assert.ok(entryWithParent.id, 'Did not create new entry with parent domain');
      assert.ok(entryWithParent.parentDomainId === patchedEntry.id, 'Did not create new entry with parent domain');
    });
  });

  context('domain with dependencies', () => {
    const domainDependencies = app.service('domain-dependencies');
    let otherDomainDependency;

    it('created entry and added a dependency to entry', async () => {
      entryWithDependency = await domainService.create({
        systemId: system.id,
        name: 'DomainTest-DomainWithDependency',
        shorthand: 'DT-DWD'
      });
      assert.ok(entryWithDependency.id, 'did not create entry');

      const dependecy = await domainService.addDependency(entryWithDependency.id, entryWithParent.id);
      assert.ok(dependecy.domainId === entryWithDependency.id, 'dependency does not have correct domain id');
      assert.ok(dependecy.domainDependencyId === entryWithParent.id, 'dependency does not have correct dependency id');
      // const domain = await sequelize.models.domains.findByPk(entryWithDependency.id);
      // const dependencies = await domain.getDomainDependencies();

      // assert.ok(domain.id === entryWithDependency.id, 'Did not find the domain with dependecy');
      // assert.ok(dependencies[0].id === entryWithParent.id, 'Dependency added to domain was not present');
    });

    // ONLY WORKS IN BACKEND
    // it('found all dependency ids of entry', async () => {
    //   otherDomainDependency = await domainService.create({
    //     systemId: system.id,
    //     name: 'DomainTest-SomeDomainDependency',
    //   });
    //   assert.ok(otherDomainDependency.id, 'did not create entry');

    //   const dependecy = await domainService.addDependency(entryWithDependency.id, otherDomainDependency.id);
    //   assert.ok(dependecy.domainId === entryWithDependency.id, 'dependency does not have correct domain id');
    //   assert.ok(dependecy.domainDependencyId === otherDomainDependency.id, 'dependency does not have correct dependency id');

    //   const dependencies = await domainService.findAllDependencyIds(entryWithDependency.id);
    //   assert.ok(dependencies.length === 2, 'there was not the expected amount of dependencies');
    //   assert.ok(dependencies[0].domainId === entryWithDependency.id, 'dependency does not have correct domain id');
    //   assert.ok(dependencies[0].domainDependencyId === entryWithParent.id, 'dependency does not have correct domain id');
    //   assert.ok(dependencies[1].domainDependencyId === otherDomainDependency.id, 'dependency does not have correct domain id');

    // });

    it('found all dependency ids of entry', async () => {
      otherDomainDependency = await domainService.create({
        systemId: system.id,
        name: 'DomainTest-SomeDomainDependency',
      });
      assert.ok(otherDomainDependency.id, 'did not create entry');

      const dependecy = await domainService.addDependency(entryWithDependency.id, otherDomainDependency.id);
      assert.ok(dependecy.domainId === entryWithDependency.id, 'dependency does not have correct domain id');
      assert.ok(dependecy.domainDependencyId === otherDomainDependency.id, 'dependency does not have correct dependency id');

      const dependenciesWrap = await domainDependencies.find({
        query: {
          domainId: entryWithDependency.id
        }
      });
      const dependencies = dependenciesWrap.data;
      //const dependencies = await domainService.findAllDependencyIds(entryWithDependency.id);
      assert.ok(dependencies.length === 2, 'there was not the expected amount of dependencies');
      assert.ok(dependencies[0].domainId === entryWithDependency.id, 'dependency does not have correct domain id');
      assert.ok(dependencies[0].domainDependencyId === entryWithParent.id, 'dependency does not have correct domain id');
      assert.ok(dependencies[1].domainDependencyId === otherDomainDependency.id, 'dependency does not have correct domain id');

    });

  });

  // it('added parent domain to entry', async () => {
  //   entryWithParent = await service.create({
  //     systemId: system.id,
  //     name: 'DomainsTest-DomainWithParent',
  //     shorthand: 'DT-DWP',
  //     parentDomainId: patchedEntry.id
  //   });

  //   assert.ok(entryWithParent.id, 'Did not create new entry with parent domain');
  //   assert.ok(entryWithParent.parentDomainId === patchedEntry.id, 'Did not create new entry with parent domain');
  // });



  // Attempt at making a large include statement, that makes domain dependencies be nested within a domain
  // const entryAndDependencies = await sequelize.models.domains.findAll({
  //   where: {
  //     id: entryWithDependency.id
  //   },
  //   include: [{
  //     // model: 'domains',
  //     // as: 'domainDependencies',
  //     association: 'domainDependencies',
  //     through: {
  //       where: {
  //         domainId: entryWithDependency.id
  //       }
  //     }
  //   }]
  // });
  // let dom;

  // dom = await sequelize.models.domains.findByPk(entryWithDependency.id).then(domain => {
  //   console.log('Domain',domain);
  //   domain.getDomainDependencies().then(dependencies =>{
  //     console.log('Dependencies', dependencies);
  //   });
  // });



  // console.log('Domain DONE', domm);
  // console.log('Dependencies DONE', depend);
  // .then(() => {
  //   console.log('DEPENDENCIES', entryAndDependencies);
  // });

  // entryAndDependencies.done();

  // assert.ok(entryAndDependencies.id, 'Did not find entry with dependencies');


  // TODO

  // ON REMOVAL OF DOMAINS/PROPERTIES, IT WILL CASCADE TO THE JUNCTION TABLES
  // CHECK FOR ALL PROPERTIES

  // Remove parent domain, check if in use/cascade zerosetting?
  // Should removing a parent domain increment major verison??? probably

  // X Add dependency
  // Remove dependency, check if dependency is in use/casade zero setting (change to raw val) of properties using dependency
  // Prompts changes of wherever a property/variable has been in use
  // Should probably increment major version

  context('domain that is a parent of other', () =>
  {
    it('was not able to be removed without other alterations', () =>
    {
      assert.ok(false, 'TODO');
    });

    it('compiled a list of needed changes for safe removal', () =>
    {
      assert.ok(false, 'TODO');
    });

    it('was able to be removed after alterations were done', () =>
    {
      assert.ok(false, 'TODO');
    });

  });

  context('domain that other domains depened upon', () =>
  {
    it('was not able to be removed without other alterations', () =>
    {
      assert.ok(false, 'TODO');
    });

    it('compiled a list of needed changes for safe removal', () =>
    {
      assert.ok(false, 'TODO');
    });

    it('was able to be removed after alterations were done', () =>
    {
      assert.ok(false, 'TODO');
    });

  });

  context('independant domain with 1 dependency and no parent', () =>
  {
    it('was removed', async () => {
      const res = await domainService.remove(patchedEntry.id);
      assert.ok(res.id, 'entry was not removed');
      const sys = await systemService.get(patchedEntry.systemId);
      assert.ok(sys.version === '1.0', 'Did not increment major version number for parent');
    });
  });

  // eslint-disable-next-line no-constant-condition
  if('bla', () => {
    assert.ok(newEntry.name === 'DomainsTest-Domain', 'bla');
  });

});