import {validatePushSubscription} from "./push-subscription-validation.mjs";
export async function saveAuthenticatedPush({token,subscription,verifyUser,store}={}){
 if(typeof token!=="string"||!token||token.length>8192||typeof verifyUser!=="function"||typeof store!=="function")throw Error("unauthorized");
 const user=await verifyUser(token);
 if(!user||typeof user.id!=="string"||!user.id)throw Error("unauthorized");
 const valid=validatePushSubscription(subscription);
 await store({user_id:user.id,endpoint:valid.endpoint,p256dh:valid.keys.p256dh,auth:valid.keys.auth});
 return {registered:true};
}
