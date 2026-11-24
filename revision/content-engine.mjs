// Server-side discovery. Returns review candidates; never publishes or downloads.
export const topics=Object.freeze({
 calistenia:Object.freeze(["flexiones","dominadas","movilidad","equilibrio","fuerza abdominal","progresiones"]),
 taekwondo:Object.freeze(["poomsae","equilibrio","flexibilidad","freestyle","preparacion fisica"]),
 cuero:Object.freeze(["patrones","corte","costura","cantos","carteras","bolsos"]),
 dibujo:Object.freeze(["perspectiva","proporciones","sombreado"]),
 pintura:Object.freeze(["color","composicion","veladuras"]),
 escultura:Object.freeze(["volumen","modelado","acabados"]),
 taichi:Object.freeze(["posturas","equilibrio","respiracion","formas"])
});
const validId=s=>typeof s==="string"&&/^[A-Za-z0-9_-]{11}$/.test(s);
const validChannel=s=>typeof s==="string"&&/^UC[A-Za-z0-9_-]{22}$/.test(s);
export function chooseTopic(category,history=[]){
 if(!Object.hasOwn(topics,category))throw Error("Categoria desconocida");
 const list=topics[category],counts=new Map(list.map(t=>[t,0]));
 for(const row of history)if(row?.category===category&&counts.has(row.topic))counts.set(row.topic,counts.get(row.topic)+1);
 return [...list].sort((a,b)=>counts.get(a)-counts.get(b))[0];
}
export function prepareQueue(rows,{knownIds=[],approvedChannels=[],category,topic,limit=3}={}){
 if(!Object.hasOwn(topics,category)||!topics[category].includes(topic))throw Error("Tema desconocido");
 const known=new Set(knownIds),channels=new Set(approvedChannels.filter(validChannel)),out=[];
 const cap=Number.isInteger(limit)?Math.min(3,Math.max(1,limit)):3;
 for(const row of rows){
 if(!row||!validId(row.id)||known.has(row.id)||!channels.has(row.channelId)||row.embeddable!==true||row.privacyStatus!=="public"||row.ageRestricted!==false||row.madeForKids!==false||row.liveBroadcastContent!=="none"||row.regionAllowed!==true||row.category!==category||row.topic!==topic)continue;
 known.add(row.id);
 out.push({id:row.id,category,topic,state:"pendiente_revision",source:"YouTube",channelId:row.channelId,title:String(row.title||"").slice(0,300),checkedAt:row.checkedAt||null});
 if(out.length>=cap)break;
 }
 return out;
}
export async function discover({apiKey,category,approvedChannels=[],knownIds=[],history=[],region="ES",fetcher=globalThis.fetch}={}){
 if(typeof apiKey!=="string"||!apiKey.trim())throw Error("Falta clave de servidor");
 if(typeof fetcher!=="function")throw Error("Falta cliente HTTP");
 if(!/^[A-Z]{2}$/.test(region))throw Error("Region invalida");
 const channels=[...new Set(approvedChannels.filter(validChannel))];
 if(!channels.length||channels.length>2)throw Error("Selecciona 1 o 2 canales revisados");
 const topic=chooseTopic(category,history);
 async function request(path,params){
 const query=Object.entries(params).map(([k,v])=>encodeURIComponent(k)+"="+encodeURIComponent(v)).join("&");
 const url="https://www.googleapis.com/youtube/v3/"+path+"?"+query;
 const options={headers:{"X-Goog-Api-Key":apiKey},redirect:"error"};
 if(typeof AbortSignal!=="undefined"&&typeof AbortSignal.timeout==="function")options.signal=AbortSignal.timeout(10000);
 let res;try{res=await fetcher(url,options);}catch{throw Error("Fallo de conexion con YouTube");}
 if(!res.ok)throw Error("YouTube no disponible ("+Number(res.status)+")");
 try{return await res.json();}catch{throw Error("Respuesta de YouTube invalida");}
 }
 const ids=new Set(),known=new Set(knownIds);
 for(const channelId of channels){
 const data=await request("search",{part:"snippet",type:"video",channelId,q:topic+" "+category+" tutorial",videoEmbeddable:"true",videoSyndicated:"true",safeSearch:"strict",maxResults:"10",relevanceLanguage:"es",regionCode:region});
 for(const x of data.items||[])if(validId(x?.id?.videoId)&&!known.has(x.id.videoId))ids.add(x.id.videoId);
 }
 if(!ids.size)return [];
 const data=await request("videos",{part:"snippet,status,contentDetails",id:[...ids].join(",")});
 const checkedAt=new Date().toISOString();
 const rows=(data.items||[]).filter(x=>ids.has(x.id)).map(x=>{
 const regionInfo=x.contentDetails?.regionRestriction;
 const regionAllowed=!regionInfo||((!Array.isArray(regionInfo.allowed)||regionInfo.allowed.includes(region))&&(!Array.isArray(regionInfo.blocked)||!regionInfo.blocked.includes(region)));
 return {id:x.id,channelId:x.snippet?.channelId,title:x.snippet?.title,embeddable:x.status?.embeddable,privacyStatus:x.status?.privacyStatus,ageRestricted:x.contentDetails?x.contentDetails.contentRating?.ytRating==="ytAgeRestricted":null,madeForKids:x.status?.madeForKids,liveBroadcastContent:x.snippet?.liveBroadcastContent,regionAllowed,category,topic,checkedAt};
 });
 return prepareQueue(rows,{knownIds,approvedChannels:channels,category,topic});
}
