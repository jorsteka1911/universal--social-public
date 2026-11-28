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
