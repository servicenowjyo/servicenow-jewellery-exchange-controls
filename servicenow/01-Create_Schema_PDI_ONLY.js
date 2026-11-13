// PDI ONLY. New isolated demo tables. Rollback capture enabled in Scripts Background.
(function(){
 function table(name,label,parent){var g=new GlideRecord('sys_db_object');g.addQuery('name',name);g.query();if(g.next())return;g.initialize();g.name=name;g.label=label;if(parent){var p=new GlideRecord('sys_db_object');if(!p.get('name',parent))throw 'Missing parent';g.super_class=p.getUniqueValue();}if(!g.insert())throw 'Table failed '+name;gs.print('CREATED '+name);}
 function field(t,n,label,type,len){var g=new GlideRecord('sys_dictionary');g.addQuery('name',t);g.addQuery('element',n);g.query();if(g.next())return;g.initialize();g.name=t;g.element=n;g.column_label=label;g.internal_type=type;g.max_length=len||80;if(!g.insert())throw 'Field failed '+n;gs.print('FIELD '+t+'.'+n);}
 table('u_jewel_original','Jewellery Original');table('u_jewel_redemption','Jewellery Redemption');table('u_jewel_exchange_case','Jewellery Exchange Case','task');
 field('u_jewel_original','u_item_key','Original item key','string',80);field('u_jewel_original','u_customer_token','Customer token','string',80);field('u_jewel_original','u_eligible_paise','Eligible purchase paise','integer',40);field('u_jewel_original','u_policy','Policy version','string',40);
 field('u_jewel_redemption','u_original_item','Original item key','string',80);
 var t='u_jewel_exchange_case';field(t,'u_original_item','Original item key','string',80);field(t,'u_customer_token','Customer token','string',80);field(t,'u_claimed_paise','Claimed credit paise','integer',40);field(t,'u_item_received','Item received','boolean',40);field(t,'u_expected_paise','Expected credit paise','integer',40);field(t,'u_triage','Triage','string',40);field(t,'u_reasons','Review reasons','string',1000);field(t,'u_result','Policy result JSON','string',4000);
 gs.print('JEWELLERY SCHEMA READY. Fresh run required before policy installation.');
})();
