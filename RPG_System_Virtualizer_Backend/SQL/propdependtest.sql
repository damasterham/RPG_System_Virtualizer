select * from properties as pm
left join property_domain_enums as pde on pde.property_id = pm.id
left join domains as d on d.id = pde.domain_id
where pm.name = 'PropertyTest-PropertyDomain-NoDependency'
