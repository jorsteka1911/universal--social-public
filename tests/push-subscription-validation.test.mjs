import test from "node:test";
import assert from "node:assert/strict";
import {validatePushSubscription} from "../push-subscription-validation.mjs";
const keys={p256dh:Buffer.concat([Buffer.from([4]),Buffer.alloc(64,1)]).toString("base64url"),auth:Buffer.alloc(16,2).toString("base64url")};
test("accept supported HTTPS endpoint",()=>{const endpoint="https://fcm.googleapis.com/fcm/send/test";assert.deepEqual(validatePushSubscription({endpoint,keys}),{endpoint,keys});});
test("reject unsafe destinations",()=>{for(const endpoint of ["http://fcm.googleapis.com/test","https://127.0.0.1/test","https://fcm.googleapis.com.evil.example/test","https://user@fcm.googleapis.com/test","https://fcm.googleapis.com:444/test"])assert.throws(()=>validatePushSubscription({endpoint,keys}));});
test("reject malformed keys",()=>assert.throws(()=>validatePushSubscription({endpoint:"https://fcm.googleapis.com/test",keys:{...keys,auth:"bad"}})));
