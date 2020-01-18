select * from properties as pm
left join properties_domains as pde on pde.property_id = pm.id
left join domains as d on d.id = pde.domain_id
where pm.name = 'PropertyTest-PropertyDomain-NoDependency'
