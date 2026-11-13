const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {evaluateClaim:e,evaluateBatch:b}=require('../src/policy');
const o={X:{eligible_paise:1000000,customer_token:'C',policy:'SILVER55_V1'}};
const c={id:'A',original_item:'X',customer_token:'C',claimed_paise:550000,item_received:true};
test('exact 55 percent credit requires approval',()=>{const r=e(c,o,[],false);a.equal(r.status,'READY_FOR_APPROVAL');a.equal(r.expected_paise,550000);a.equal(r.payment_authorized,false);});
for(const [label,delta,reason] of [
 ['overclaim',{claimed_paise:550001},'CREDIT_MISMATCH'],['underclaim',{claimed_paise:549999},'CREDIT_MISMATCH'],
 ['negative',{claimed_paise:-1},'INVALID_AMOUNT'],['string amount',{claimed_paise:'550000'},'INVALID_AMOUNT'],
 ['fraction',{claimed_paise:1.2},'INVALID_AMOUNT'],['infinite',{claimed_paise:Infinity},'INVALID_AMOUNT'],
 ['too large',{claimed_paise:1000000001},'INVALID_AMOUNT'],['wrong customer',{customer_token:'Q'},'CUSTOMER_MISMATCH'],
 ['missing bill',{original_item:'Q'},'ORIGINAL_NOT_FOUND'],['unreceived item',{item_received:false},'ITEM_NOT_RECEIVED'],
 ['missing case id',{id:''},'MISSING_IDENTITY']])test(label,()=>a.ok(e({...c,...delta},o,[],false).reasons.includes(reason)));
test('consumed item blocked',()=>a.ok(e(c,o,['X'],false).reasons.includes('ALREADY_EXCHANGED')));
test('both duplicate batch claims held',()=>a.ok(b([c,{...c,id:'B'}],o,[]).every(r=>r.reasons.includes('DUPLICATE_BATCH_ITEM'))));
test('unknown policy held',()=>a.ok(e(c,{X:{...o.X,policy:'UNKNOWN'}},[],false).reasons.includes('POLICY_REVIEW')));
test('invalid trusted amount held',()=>a.ok(e(c,{X:{...o.X,eligible_paise:-1}},[],false).reasons.includes('INVALID_ORIGINAL')));
test('round fractional paise once',()=>a.equal(e({...c,claimed_paise:1},{X:{...o.X,eligible_paise:1}},[],false).expected_paise,1));
test('high value threshold boundary',()=>{a.ok(!e(c,{X:{...o.X,eligible_paise:9090909}},[],false).reasons.includes('HIGH_VALUE_REVIEW'));a.ok(e(c,{X:{...o.X,eligible_paise:9090910}},[],false).reasons.includes('HIGH_VALUE_REVIEW'));});
test('synthetic fixture four ready eight held',()=>{const read=n=>JSON.parse(fs.readFileSync(path.join(__dirname,'../data',n+'.json')));const r=b(read('claims'),read('originals'),read('consumed'));a.equal(r.filter(x=>x.status==='HOLD').length,8);a.equal(r.filter(x=>x.status==='READY_FOR_APPROVAL').length,4);});
test('evaluation does not modify source',()=>{const before=JSON.stringify([c,o]);e(c,o,[],false);a.equal(JSON.stringify([c,o]),before);});
