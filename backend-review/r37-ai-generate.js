// CANDIDATE ONLY. No deployment until isolated tests, privacy review and provider price approval.
const origins=new Set(["https://gyste2025.vercel.app"]);
const env=k=>Deno.env.get(k);
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const styles=new Set(["curiosity","inspire","teach","humor","community"]);
Deno.serve(async req=>{
 const origin=req.headers.get("origin")||"";
 const headers={"Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin",...(origins.has(origin)?{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info","Access-Control-Allow-Methods":"POST, OPTIONS"}:{})};
 const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(origin&&!origins.has(origin))return reply({status:"origin_denied"},403);
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST")return reply({status:"method_denied"},405);
 if(env("GYSTE_AI_GENERATION_ENABLED")!=="true")return reply({status:"disabled"},503);
 const auth=req.headers.get("authorization")||"",base=env("SUPABASE_URL"),anon=env("SUPABASE_ANON_KEY"),admin=env("SUPABASE_SERVICE_ROLE_KEY"),key=env("GEMINI_API_KEY"),model=env("GYSTE_AI_APPROVED_MODEL");
 if(!/^Bearer [A-Za-z0-9_.-]+$/.test(auth))return reply({status:"unauthorized"},401);
 if(!base||!anon||!admin||!key||!model||!/^gemini-[a-z0-9.-]{2,80}$/.test(model))return reply({status:"configuration"},503);
 try{
  const u=await fetch(base+"/auth/v1/user",{headers:{Authorization:auth,apikey:anon},signal:AbortSignal.timeout(5000)});
  if(!u.ok)return reply({status:"unauthorized"},401);
  const user=await u.json();if(!uuid.test(user.id||""))return reply({status:"unauthorized"},401);
  // Limit bytes before JSON parsing; do not log request content.
  if(!req.body)return reply({status:"invalid"},400);
  const reader=req.body.getReader(),decoder=new TextDecoder();let raw="",bytes=0;
  try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>4096){await reader.cancel();return reply({status:"too_large"},413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();}finally{reader.releaseLock();}
  let b;try{b=JSON.parse(raw);}catch{return reply({status:"invalid"},400);}
  if(!b||Object.keys(b).some(k=>!["requestId","topic","style","duration","consent"].includes(k))||!uuid.test(b.requestId||"")||b.consent!==true||typeof b.topic!=="string"||!b.topic.trim()||b.topic.length>160||!styles.has(b.style)||![15,30,60].includes(b.duration))return reply({status:"invalid"},400);
  const topic=b.topic.trim();
  if(/@|https?:|\b(?:\d{8}[a-z]|[xyz]\d{7}[a-z]|\d{7,}|contrase[ñn]a|password|otp|iban)\b/i.test(topic))return reply({status:"private_data_warning"},400);
  // Service role stays server-side. The database atomically enforces eligibility and caps.
  const reserve=await fetch(base+"/rest/v1/rpc/gyste_ai_reserve_pilot",{method:"POST",headers:{apikey:admin,Authorization:"Bearer "+admin,"Content-Type":"application/json"},body:JSON.stringify({p_actor:user.id,p_request:b.requestId}),signal:AbortSignal.timeout(5000)});
  if(!reserve.ok)return reply({status:"quota_unavailable"},503);
  const outcome=await reserve.json();
  if(outcome!=="reserved")return reply({status:["duplicate","user_limit","daily_limit","monthly_limit","denied"].includes(outcome)?outcome:"quota_unavailable"},outcome==="denied"?403:429);
  // No automatic retries. Reservation is retained on failure or timeout.
  const prompt="Crea un guion original en español, apropiado para público general. No inventes hechos, no incluyas datos privados. Devuelve únicamente JSON con scenes (3 a 8 frases de máximo 110 caracteres) y caption (máximo 500 caracteres). Tema, estilo y duración: "+JSON.stringify({topic,style:b.style,duration:b.duration});
  const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+model+":generateContent",{method:"POST",headers:{"x-goog-api-key":key,"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:700,responseMimeType:"application/json",candidateCount:1}}),signal:AbortSignal.timeout(15000)});
  if(!response.ok)return reply({status:"provider_unavailable"},502);
  const data=await response.json(),candidate=data.candidates?.[0];
  if(candidate?.finishReason!=="STOP")return reply({status:"incomplete"},422);
  const result=JSON.parse((candidate.content?.parts||[]).filter(p=>!p.thought&&typeof p.text==="string").map(p=>p.text).join(""));
  if(!Array.isArray(result?.scenes)||result.scenes.length<3||result.scenes.length>8||result.scenes.some(x=>typeof x!=="string"||!x.trim()||x.length>110||/[\r\n]/.test(x))||typeof result.caption!=="string"||result.caption.length>500)return reply({status:"invalid_output"},422);
  return reply({status:"ok",scenes:result.scenes,caption:result.caption});
 }catch{return reply({status:"unavailable"},503);}
});
