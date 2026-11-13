// After insert, one human review task for every intake, never issues credit.
(function executeRule(current,previous){
 var child=new GlideRecord('task');child.addQuery('parent',current.getUniqueValue());child.addQuery('correlation_id','JEXREVIEW-'+current.getUniqueValue());child.setLimit(1);child.query();if(child.hasNext())return;
 child.initialize();child.parent=current.getUniqueValue();child.correlation_id='JEXREVIEW-'+current.getUniqueValue();child.short_description='[JEWEL DEMO] '+current.getValue('u_triage')+' — '+current.getValue('correlation_id');child.description='Synthetic human review request. No payment authorized. '+current.getValue('u_reasons');child.assigned_to=gs.getUserID();if(!child.insert())throw 'Review task creation failed';
})(current,previous);
