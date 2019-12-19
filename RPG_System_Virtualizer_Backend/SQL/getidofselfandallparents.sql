with recursive parents as (
select d.id, d.name, d.parent_domain_id from domains d
where d.id = 102 -- owner domain id
union select dn.id, dn.name, dn.parent_domain_id from domains dn
	inner join parents on parents.parent_domain_id = dn.id
) 
select id from parents
where parents.id = 101; -- references domain id