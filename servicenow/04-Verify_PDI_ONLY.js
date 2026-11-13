(function(){
 var g=new GlideRecord('u_jewel_exchange_case');g.addQuery('correlation_id','STARTSWITH','JEX-');g.orderBy('correlation_id');g.query();var count=0,ready=0,held=0,reviews=0;
 while(g.next()){count++;var s=g.getValue('u_triage');if(s==='HOLD')held++;if(s==='READY_FOR_APPROVAL')ready++;var t=new GlideRecord('task');t.addQuery('parent',g.getUniqueValue());t.addQuery('correlation_id','JEXREVIEW-'+g.getUniqueValue());t.query();var n=0;while(t.next())n++;if(n===1)reviews++;
 gs.print(g.getValue('correlation_id')+' | '+s+' | credit paise '+g.getValue('u_expected_paise')+' | '+g.getValue('u_reasons')+' | review tasks '+n);
 }
 if(count!==12||ready!==5||held!==7||reviews!==12)throw 'PLATFORM CHECK FAILED';
 gs.print('PASS: 12 persisted cases; 5 ready; 7 held; 12 unique human-review tasks. Sequential intake, no payment.');
 var edit=new GlideRecord('u_jewel_exchange_case');edit.get('correlation_id','JEX-001');var old=edit.getValue('u_claimed_paise');edit.u_claimed_paise=1;var id=edit.update();edit.get('correlation_id','JEX-001');if(id||edit.getValue('u_claimed_paise')!==old)throw 'Immutability check failed';gs.print('PASS: evaluated intake edits rejected.');
})();
