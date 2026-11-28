export async function registerGystePush({publicKey,save,registration,notification=globalThis.Notification}={}){
 if(typeof save!=="function"||!registration?.pushManager||!notification)throw Error("push_unavailable");
 if(typeof publicKey!=="string"||!/^[A-Za-z0-9_-]{87}$/.test(publicKey))throw Error("invalid_public_key");
 const raw=atob(publicKey.replace(/-/g,"+").replace(/_/g,"/")+"=");
 const key=Uint8Array.from(raw,c=>c.charCodeAt(0));
 if(key.length!==65||key[0]!==4)throw Error("invalid_public_key");
 const permission=await notification.requestPermission();
 if(permission!=="granted")return {registered:false,permission};
 let subscription=await registration.pushManager.getSubscription();
 if(!subscription)subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
 await save(subscription.toJSON());
 return {registered:true,permission};
}
