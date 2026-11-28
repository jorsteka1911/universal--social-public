const hosts=new Set(["fcm.googleapis.com","updates.push.services.mozilla.com","web.push.apple.com"]);
export function validatePushSubscription(value){
 if(!value||typeof value.endpoint!=="string"||value.endpoint.length>2048)throw Error("invalid_endpoint");
 const url=new URL(value.endpoint);
 if(url.protocol!=="https:"||url.username||url.password||url.port||url.hash||!hosts.has(url.hostname))throw Error("unsupported_endpoint");
 const p=value.keys?.p256dh,a=value.keys?.auth;
 if(typeof p!=="string"||!/^[A-Za-z0-9_-]{87}$/.test(p)||typeof a!=="string"||!/^[A-Za-z0-9_-]{22}$/.test(a))throw Error("invalid_keys");
 const decode=s=>Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(s.length/4)*4,"=")),c=>c.charCodeAt(0));
 const key=decode(p);
 if(key.length!==65||key[0]!==4||decode(a).length!==16)throw Error("invalid_keys");
 return {endpoint:url.href,keys:{p256dh:p,auth:a}};
}
