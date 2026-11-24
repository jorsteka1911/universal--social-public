import {chooseTopic,prepareQueue,discover} from "./content-engine.mjs";
let count=0;const a=x=>{if(!x)throw Error("Fallo "+(count+1));count++};
const ch="UC"+"a".repeat(22),other="UC"+"b".repeat(22);
const b={id:"abcdefghijk",channelId:ch,embeddable:true,privacyStatus:"public",ageRestricted:false,madeForKids:false,liveBroadcastContent:"none",regionAllowed:true,category:"calistenia",topic:"movilidad"};
const o={category:"calistenia",topic:"movilidad",approvedChannels:[ch]};
a(chooseTopic("calistenia",[{category:"calistenia",topic:"flexiones"}])==="dominadas");
a(prepareQueue([b,b],o).length===1);
a(prepareQueue([b],{...o,knownIds:[b.id]}).length===0);
for(const patch of [{channelId:other},{embeddable:false},{privacyStatus:"private"},{ageRestricted:true},{madeForKids:true},{madeForKids:undefined},{liveBroadcastContent:"live"},{topic:"flexiones"},{regionAllowed:false},{id:"no"}])a(!prepareQueue([{...b,...patch}],o).length);
a(prepareQueue([b],o)[0].state==="pendiente_revision");
a(prepareQueue(Array.from({length:6},(_,i)=>({...b,id:"abcdefghij"+i})),o).length===3);
let calls=0;
const fetcher=async(url,options)=>{
 calls++;a(!url.includes("test-secret"));a(options.headers["X-Goog-Api-Key"]==="test-secret");
 if(url.includes("/search?")){a(url.includes("videoEmbeddable=true")&&url.includes("safeSearch=strict"));return {ok:true,json:async()=>({items:[{id:{videoId:b.id}}]})};}
 return {ok:true,json:async()=>({items:[{id:b.id,snippet:{channelId:ch,title:"Ejemplo",liveBroadcastContent:"none"},status:{embeddable:true,privacyStatus:"public",madeForKids:false},contentDetails:{}}]})};
};
const options={apiKey:"test-secret",category:"calistenia",approvedChannels:[ch],fetcher};
const result=await discover(options);a(result.length===1&&calls===2);a(result[0].state==="pendiente_revision");
calls=0;a((await discover({...options,knownIds:[b.id]})).length===0&&calls===1);
let fail=false;try{await discover({...options,fetcher:async()=>({ok:false,status:403})})}catch(e){fail=e.message.includes("403")}a(fail);
fail=false;try{await discover({...options,apiKey:""})}catch(e){fail=e.message.includes("clave")}a(fail);
fail=false;try{await discover({...options,fetcher:async()=>{throw Error("test-secret")}})}catch(e){fail=!e.message.includes("test-secret")}a(fail);

console.log(count+" comprobaciones superadas (API simulada)");
