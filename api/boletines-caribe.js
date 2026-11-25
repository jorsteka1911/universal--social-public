// Fixed public feed; never forwards user data or accepts arbitrary upstream URLs.
module.exports = async function handler(req,res){
 if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).end();}
 try{
  const upstream=await fetch("https://www.nhc.noaa.gov/index-at-sp.xml",{redirect:"error",signal:AbortSignal.timeout(7000),headers:{Accept:"application/rss+xml, application/xml, text/xml"}});
  if(!upstream.ok||!upstream.body)throw Error("upstream");
  const reader=upstream.body.getReader(),parts=[];let bytes=0;
  while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>512000){await reader.cancel();throw Error("size");}parts.push(Buffer.from(value));}
  const xml=Buffer.concat(parts).toString("utf8");
  if(!/<rss\b/i.test(xml)||/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error("invalid feed");
  res.setHeader("Content-Type","application/xml; charset=utf-8");
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("Cache-Control","public, s-maxage=900, stale-while-revalidate=60");
  return res.status(200).send(xml);
 }catch{
  res.setHeader("Cache-Control","no-store");
  return res.status(503).json({error:"Fuente temporalmente no disponible"});
 }
};