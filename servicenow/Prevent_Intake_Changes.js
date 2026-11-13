// Before update: preserve the evaluated intake snapshot. Replacements are new cases.
(function executeRule(current,previous){
 var fields=['u_original_item','u_customer_token','u_claimed_paise','u_item_received','correlation_id','u_expected_paise','u_triage','u_reasons','u_result'];
 for(var i=0;i<fields.length;i++)if(current.getElement(fields[i]).changes()){
  gs.addErrorMessage('Evaluated jewellery intake is immutable. Create a replacement case.');current.setAbortAction(true);return;
 }
})(current,previous);
