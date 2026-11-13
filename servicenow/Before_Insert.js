// Global PDI lab, before insert on u_jewel_exchange_case. Script Include must exist.
// u_jewel_original is a protected snapshot table, not values supplied by claimant.
(function executeRule(current,previous){
 function norm(v){return String(v||'').replace(/^\s+|\s+$/g,'').toUpperCase();}
 var key=norm(current.getValue('u_original_item'));current.u_original_item=key;
 var originals={},g=new GlideRecord('u_jewel_original');g.addQuery('u_item_key',key);g.setLimit(1);g.query();
 if(g.next())originals[key]={eligible_paise:Number(g.getValue('u_eligible_paise')),customer_token:g.getValue('u_customer_token'),policy:g.getValue('u_policy')};
 var consumed=[],ledger=new GlideRecord('u_jewel_redemption');ledger.addQuery('u_original_item',key);ledger.setLimit(1);ledger.query();if(ledger.hasNext())consumed.push(key);
 var prior=new GlideRecord('u_jewel_exchange_case');prior.addQuery('u_original_item',key);prior.setLimit(1);prior.query();
 var raw=current.getValue('u_claimed_paise');
 var claim={id:current.getValue('correlation_id'),original_item:key,customer_token:current.getValue('u_customer_token'),claimed_paise:raw===null||raw===''?null:Number(raw),item_received:current.getValue('u_item_received')==='1'};
 var result=new JewelleryExchangePolicy().evaluate(claim,originals,consumed,prior.hasNext());
 current.u_result=JSON.stringify(result);current.u_triage=result.status;current.u_reasons=result.reasons.join(', ');
 current.u_expected_paise=result.expected_paise===null?'':result.expected_paise;
 current.short_description='Synthetic jewellery exchange '+claim.id+' | '+result.status;
 // No current.update(), no payment, and no redemption ledger write.
})(current,previous);
