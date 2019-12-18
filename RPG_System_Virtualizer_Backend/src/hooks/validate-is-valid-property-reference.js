// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
  // Reftype valid if
  // owned by same domain or parent domains
  // or
  // reference present in junction table

    // Ignore if reference type is raw_value 
    if (context.data.referenceType === 'raw_value')
      return context;

    // Validate if necesary paramenters for parent/dependency check is present
    if (!context.data.domainId || !context.data.propertyReference.domainId)
    {
      // If not present return failure
      return Promise.reject({
        name: 'MissingDomainReference',
        message: 'MissingDomainReference: A domain id attribute was missing from the passed object'
      });

      // Alternate solution
      // still create property but set incomplete flag
    }

    const sequelize = await context.app.get('sequelize');
    // Validate if property refence domain is the same or
    const hasValidInheritance = await sequelize.query(`with recursive parents as (
      select d.id, d.name, d.parent_domain_id from domains d
      where d.id = :ownerDomain
      union select dn.id, dn.name, dn.parent_domain_id from domains dn
        inner join parents on parents.parent_domain_id = dn.id
      ) 
      select id from parents
      where parents.id = :referenceDomain;`, {
      replacements: {
        ownerDomain: context.data.domainId,
        referenceDomain: context.data.propertyReference.domainId
      },
      type: sequelize.QueryTypes.SELECT
    });

    if (hasValidInheritance.length === 1)
      return context;

    // Validate if property reference domain is a dependency
    const domainDependencies = sequelize.models.domain_dependencies;
    const hasValidDependency = await domainDependencies.findOne({
      where: {
        domainId: context.data.domainId,
        domainDependencyId: context.data.propertyReference.domainId
      }
    });

    if (hasValidDependency)
      return context;
  
    // If the property refence domain is not the same, nor parent, nor dependency return failure
    return Promise.reject({
      name: 'MissingDomainReference',
      message: 'MissingDomainRefence: There was no association between the property domain and the reference domain'
    });
    // Alternate solution
    // still create property but set incomplete flag





    // Should also actualy check if that domain contains any properties/functons of the datatype, 
    // (and on its own domain, that isn't the property itself)

    // NOT/// or domain dependency parents, recursive


    // switch (context.data.referenceType) {
    //   case 'raw_value':
        
    //     break;
    //   case 'property':
      
    //     break;
    //   case 'function':
    
    //     break;
    //   case 'domain':
  
    //     break;
    //   default:
    //     return Promise.reject({
    //       name: 'InvalidReferenceType',
    //       message: `InvalidReferenceType: and invalid enum value was passed '${context.data.referenceType}'
    //       Must be of type 'raw_value', 'property', 'function', or 'domain'` 
    //     });
    // }
    

  };
};
