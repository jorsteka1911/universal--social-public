import test from "node:test";
import assert from "node:assert/strict";
import {registerGystePush} from "../push-registration.mjs";
const publicKey=Buffer.concat([Buffer.from([4]),Buffer.alloc(64,1)]).toString("base64url");
test("denied permission never subscribes or saves",async()=>{
 const fail=()=>{throw Error("unexpected call")};
 assert.deepEqual(await registerGystePush({publicKey,save:fail,registration:{pushManager:{getSubscription:fail}},notification:{requestPermission:async()=>"denied"}}),{registered:false,permission:"denied"});
});
test("granted permission saves existing subscription",async()=>{
 const payload={endpoint:"https://example.com/push"};let saved;
 const result=await registerGystePush({publicKey,save:async x=>{saved=x},registration:{pushManager:{getSubscription:async()=>({toJSON:()=>payload})}},notification:{requestPermission:async()=>"granted"}});
 assert.equal(result.registered,true);assert.deepEqual(saved,payload);
});
test("failed persistence does not report success",async()=>{
 await assert.rejects(registerGystePush({publicKey,save:async()=>{throw Error("offline")},registration:{pushManager:{getSubscription:async()=>({toJSON:()=>({})})}},notification:{requestPermission:async()=>"granted"}}),/offline/);
});

import {unregisterGystePush} from "../push-registration.mjs";
test("revocation removes server record before unsubscribing",async()=>{
 const calls=[];const sub={endpoint:"https://example.com/push",unsubscribe:async()=>{calls.push("browser");return true}};
 assert.deepEqual(await unregisterGystePush({registration:{pushManager:{getSubscription:async()=>sub}},remove:async endpoint=>{assert.equal(endpoint,sub.endpoint);calls.push("server")}}),{registered:false});
 assert.deepEqual(calls,["server","browser"]);
});
test("failed server revocation does not claim success",async()=>{
 const sub={endpoint:"https://example.com/push",unsubscribe:async()=>assert.fail("unexpected unsubscribe")};
 await assert.rejects(unregisterGystePush({registration:{pushManager:{getSubscription:async()=>sub}},remove:async()=>{throw Error("offline")}}),/offline/);
});
test("persistent browser subscription is reported as failure",async()=>{
 const sub={endpoint:"https://example.com/push",unsubscribe:async()=>false};
 await assert.rejects(unregisterGystePush({registration:{pushManager:{getSubscription:async()=>sub}},remove:async()=>{}}),/unsubscribe_failed/);
});
