var JewelleryExchangePolicy = Class.create();
JewelleryExchangePolicy.prototype = {
 initialize:function(){},
 evaluate: function(c, originals, consumed, duplicate) {
  var reasons=[], original=originals[c.original_item];
  function money(n){return typeof n==='number' && isFinite(n) && Math.floor(n)===n && n>=0 && n<=1000000000;}
  if(!c.id || !c.original_item || !c.customer_token) reasons.push('MISSING_IDENTITY');
  if(!money(c.claimed_paise)) reasons.push('INVALID_AMOUNT');
  if(!original) reasons.push('ORIGINAL_NOT_FOUND');
  if(duplicate) reasons.push('DUPLICATE_BATCH_ITEM');
  if(consumed.indexOf(c.original_item)>=0) reasons.push('ALREADY_EXCHANGED');
  var expected=null;
  if(original){
    if(!money(original.eligible_paise)) reasons.push('INVALID_ORIGINAL');
    else expected=Math.round(original.eligible_paise*55/100);
    if(original.customer_token!==c.customer_token) reasons.push('CUSTOMER_MISMATCH');
    if(original.policy!=='SILVER55_V1') reasons.push('POLICY_REVIEW');
    if(c.item_received!==true) reasons.push('ITEM_NOT_RECEIVED');
    if(expected!==null && money(c.claimed_paise) && c.claimed_paise!==expected) reasons.push('CREDIT_MISMATCH');
    if(expected!==null && expected>5000000) reasons.push('HIGH_VALUE_REVIEW');
  }
  return {id:c.id,original_item:c.original_item,claimed_paise:c.claimed_paise,expected_paise:expected,
    variance_paise:expected!==null && money(c.claimed_paise)?c.claimed_paise-expected:null,
    status:reasons.length?'HOLD':'READY_FOR_APPROVAL',reasons:reasons,
    policy:'SILVER55_V1',payment_authorized:false};
},
 type:'JewelleryExchangePolicy'
};
