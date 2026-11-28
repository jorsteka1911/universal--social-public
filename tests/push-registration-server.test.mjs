import test from "node:test";
import assert from "node:assert/strict";
import {saveAuthenticatedPush} from "../push-registration-server.mjs";
const subscription={user_id:"other",endpoint:"https://fcm.googleapis.com/fcm/send/test",keys:{p256dh:Buffer.concat([Buffer.from([4]),Buffer.alloc(64,1)]).toString("base64url"),auth:Buffer.alloc(16,2).toString("base64url")}};
test("owner comes from verified identity, not submitted data",async()=>{let row;await saveAuthenticatedPush({token:"test",subscription,verifyUser:async()=>({id:"verified"}),store:async x=>{row=x}});assert.equal(row.user_id,"verified");});
test("unauthenticated requests cannot store subscriptions",async()=>{await assert.rejects(saveAuthenticatedPush({token:"test",subscription,verifyUser:async()=>null,store:async()=>assert.fail("unexpected write")}),/unauthorized/);});
test("failed storage never reports success",async()=>{await assert.rejects(saveAuthenticatedPush({token:"test",subscription,verifyUser:async()=>({id:"verified"}),store:async()=>{throw Error("offline")}}),/offline/);});
