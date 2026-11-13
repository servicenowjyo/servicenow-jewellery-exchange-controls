const fs=require('node:fs'),path=require('node:path'),{performance}=require('node:perf_hooks');
const root=path.resolve(__dirname,'..');const read=n=>JSON.parse(fs.readFileSync(path.join(root,'data',n+'.json')));
const {evaluateBatch}=require('./policy');const start=performance.now();
const results=evaluateBatch(read('claims'),read('originals'),read('consumed'));const elapsed=performance.now()-start;
const summary={environment:'LOCAL_NODE_SIMULATION_NOT_SERVICENOW',cases:results.length,ready:results.filter(r=>r.status==='READY_FOR_APPROVAL').length,held:results.filter(r=>r.status==='HOLD').length,engine_ms:Number(elapsed.toFixed(3)),human_approval_required_for_all:true,production_savings_measured:false};
fs.mkdirSync(path.join(root,'evidence'),{recursive:true});fs.writeFileSync(path.join(root,'evidence/results.json'),JSON.stringify({summary,results},null,2));console.log(JSON.stringify(summary,null,2));
